"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { api, HttpMethod } from "./axiosClient";
import { notifyError, notifySuccess, extractServerMessage, ApiError } from "./http/http-messages";
import { config as appConfig } from "./config";
import { resolveMockMutation, resolveMockRequest } from "../mock/api-mocks";

type ErrorType = AxiosError<{ message?: string } | string> | Error;
// User feedback (success / error toasts) is handled centrally by the HTTP message middleware:
// - external API calls: axios interceptors in ./axiosClient show the server's entity-specific message
// - internal Next routes: localFetch below shows the route's `message` when it provides one

async function runExternalRequest<TData>(
  method: HttpMethod,
  url: string,
  body?: any,
  config?: AxiosRequestConfig
) {
  if (appConfig.useMockData) {
    if (method === "get") {
      return (await resolveMockRequest(url, config?.params)) as TData;
    }
    return (await resolveMockMutation(method, url, body, config?.params)) as TData;
  }

  const opts = { messages: config?.messages };
  switch (method) {
    case "post":
      return (await api.post<TData>(url, body, config?.headers, opts)) as TData;
    case "put":
      return (await api.put<TData>(url, body, config?.headers, opts)) as TData;
    case "patch":
      return (await api.patch<TData>(url, body, config?.headers, opts)) as TData;
    case "delete":
      return (await api.delete<TData>(url, config?.headers, opts)) as TData;
    case "get":
    default:
      return (await api.get<TData>(url, config?.params, config?.headers, opts)) as TData;
  }
}

// Axios-backed fetcher for external API routes (errors are toasted by the axios interceptor)
async function axiosGet<T>(url: string, params?: Record<string, any>): Promise<T> {
  return runExternalRequest<T>("get", url, undefined, { params });
}

// Same-origin fetcher for internal Next API routes (/api/*)
async function localFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const method = (init?.method || "get").toLowerCase();
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", ...init });
  } catch {
    const message = "Network error, please check your connection";
    notifyError(message);
    throw new ApiError(message, 0, undefined, true);
  }
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const message = extractServerMessage(body) || `Request failed (${res.status})`;
    notifyError(message);
    throw new ApiError(message, res.status, body, true);
  }
  notifySuccess(method, body);
  return body as T;
}

// React Query GET for external API with axios interceptor (Authorization etc.)
export function useSWRGet<T = any>(
  key: string | any[] | null,
  url: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T, ErrorType>, "queryKey" | "queryFn">
) {
  const queryClient = useQueryClient();
  const queryKey: any[] = key === null ? ["__disabled__"] : Array.isArray(key) ? key : [key];
  const result = useQuery<T, ErrorType>({
    queryKey,
    queryFn: () => axiosGet<T>(url, params),
    enabled: key !== null,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
  // SWR-compatible bound mutate: mutate(data?, revalidate? = true)
  const mutate = (data?: T | ((prev: T | undefined) => T), revalidate = true) => {
    if (data !== undefined) queryClient.setQueryData<T>(queryKey, data as any);
    if (revalidate !== false) queryClient.invalidateQueries({ queryKey });
  };
  return { ...result, mutate };
}

// React Query GET for internal Next API routes (/api/*)
export function useLocalGet<T = any>(
  key: string | any[],
  url: string,
  options?: Omit<UseQueryOptions<T, ErrorType>, "queryKey" | "queryFn">
) {
  const queryClient = useQueryClient();
  const queryKey: any[] = Array.isArray(key) ? key : [key];
  const result = useQuery<T, ErrorType>({
    queryKey,
    queryFn: () => localFetch<T>(url),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
  const mutate = (data?: T | ((prev: T | undefined) => T), revalidate = true) => {
    if (data !== undefined) queryClient.setQueryData<T>(queryKey, data as any);
    if (revalidate !== false) queryClient.invalidateQueries({ queryKey });
  };
  return { ...result, mutate };
}

// Immutable variant for internal GETs (staleTime: Infinity means never re-fetch)
export function useLocalGetImmutable<T = any>(
  key: string | any[] | null,
  url: string,
  options?: Omit<UseQueryOptions<T, ErrorType>, "queryKey" | "queryFn">
) {
  const queryClient = useQueryClient();
  const queryKey: any[] = key === null ? ["__disabled__"] : Array.isArray(key) ? key : [key];
  const result = useQuery<T, ErrorType>({
    queryKey,
    queryFn: () => localFetch<T>(url),
    enabled: key !== null,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    ...options,
  });
  const mutate = (data?: T | ((prev: T | undefined) => T), revalidate = true) => {
    if (data !== undefined) queryClient.setQueryData<T>(queryKey, data as any);
    if (revalidate !== false) queryClient.invalidateQueries({ queryKey });
  };
  return { ...result, mutate };
}

// Backward-compatible wrapper
export function useApiGet<TData = any>(
  key: readonly unknown[] | null,
  url: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<TData, ErrorType>, "queryKey" | "queryFn">
) {
  return useSWRGet<TData>(key as any, url, params, options);
}

type MutationBody = any;
type MutationOptions<TData> = UseMutationOptions<TData, ErrorType, MutationBody>;

// React Query mutations for external API
export function useApiMutation<TData = any>(
  method: HttpMethod,
  url: string,
  config?: AxiosRequestConfig,
  options?: MutationOptions<TData>
) {
  return useMutation<TData, ErrorType, MutationBody>({
    mutationFn: async (body: MutationBody) => {
      return runExternalRequest<TData>(method, url, body, config);
    },
    ...options,
  });
}

// Dynamic URL mutation: use when the URL segment (e.g., id) is only known at action time
export function useApiMutationDynamic<TData = any>(
  method: HttpMethod,
  options?: MutationOptions<TData>
) {
  return useMutation<TData, ErrorType, { url: string; body?: any; config?: AxiosRequestConfig }>(
    {
      mutationFn: async ({ url, body, config }) => {
        return runExternalRequest<TData>(method, url, body, config);
      },
      ...options,
    }
  );
}

// React Query mutations for internal Next API routes (/api/*)
export function useLocalMutation<TData = any>(
  method: HttpMethod,
  url: string,
  options?: MutationOptions<TData>
) {
  return useMutation<TData, ErrorType, MutationBody>({
    mutationFn: async (body?: MutationBody) => {
      const init: RequestInit = {
        method: method.toUpperCase(),
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      };
      return localFetch<TData>(url, init);
    },
    ...options,
  });
}
