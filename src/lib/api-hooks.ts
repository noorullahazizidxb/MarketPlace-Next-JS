"use client";

import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import useSWRImmutable from "swr/immutable";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { api, HttpMethod } from "./axiosClient";
import { toastSuccess, toastError } from "./toast";
import { config as appConfig } from "./config";
import { resolveMockMutation, resolveMockRequest } from "../mock/api-mocks";

type ErrorType = AxiosError<{ message?: string } | string> | Error;
const SUCCESS_VERBS: Record<Exclude<HttpMethod, "get">, string> = {
  post: "created",
  put: "updated",
  patch: "updated",
  delete: "deleted",
};

function toEntityName(payload: any) {
  return payload?.entity || payload?.data?.entity || "Resource";
}

function notifyMutationSuccess(method: HttpMethod, payload: any) {
  if (method === "get") return;
  const verb = SUCCESS_VERBS[method as Exclude<HttpMethod, "get">];
  if (!verb) return;
  toastSuccess(`${String(toEntityName(payload))} ${verb} successfully`);
}

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

  switch (method) {
    case "post":
      return (await api.post<TData>(url, body, config?.headers)) as TData;
    case "put":
      return (await api.put<TData>(url, body, config?.headers)) as TData;
    case "patch":
      return (await api.patch<TData>(url, body, config?.headers)) as TData;
    case "delete":
      return (await api.delete<TData>(url, config?.headers)) as TData;
    case "get":
    default:
      return (await api.get<TData>(url, config?.params, config?.headers)) as TData;
  }
}

// Axios-backed SWR fetcher for external API routes
async function axiosGet<T>(url: string, params?: Record<string, any>): Promise<T> {
  try {
    return await runExternalRequest<T>("get", url, undefined, { params });
  } catch (err: any) {
    toastError(err?.message || "Request failed");
    throw err;
  }
}

// Same-origin fetcher for internal Next API routes (/api/*)
async function localFetch<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) {
      const txt = await res.text();
      const err = new Error(txt || `Request failed: ${res.status}`);
      toastError(err.message || "Request failed");
      throw err;
    }
    return (await res.json()) as T;
  } catch (err: any) {
    toastError(err?.message || "Request failed");
    throw err;
  }
}

// SWR GET for external API with axios interceptor (Authorization etc.)
export function useSWRGet<T = any>(
  key: string | any[] | null,
  url: string,
  params?: Record<string, any>,
  options?: SWRConfiguration<T, ErrorType>
): SWRResponse<T, ErrorType> {
  const swrKey = key === null ? null : Array.isArray(key) ? key : [key];
  return useSWR<T, ErrorType>(swrKey as any, () => axiosGet<T>(url, params), {
    revalidateOnFocus: false,
    // Cache results for 5 minutes to prevent re-fetching on navigation / remount
    dedupingInterval: 5 * 60 * 1000,
    revalidateIfStale: false,
    ...options,
  });
}

// SWR GET for internal Next API routes (/api/*)
export function useLocalGet<T = any>(
  key: string | any[],
  url: string,
  options?: SWRConfiguration<T, ErrorType>
): SWRResponse<T, ErrorType> {
  const swrKey = Array.isArray(key) ? key : [key];
  return useSWR<T, ErrorType>(swrKey, () => localFetch<T>(url), {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
    revalidateIfStale: false,
    ...options,
  });
}

// Immutable variant for internal GETs
export function useLocalGetImmutable<T = any>(
  key: string | any[] | null,
  url: string,
  options?: SWRConfiguration<T, ErrorType>
): SWRResponse<T, ErrorType> {
  const swrKey = key === null ? null : Array.isArray(key) ? key : [key];
  return useSWRImmutable<T, ErrorType>(swrKey as any, () => localFetch<T>(url), {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
    ...options,
  }) as unknown as SWRResponse<T, ErrorType>;
}

// Backward-compatible wrapper: delegate React Query GETs to SWR
export function useApiGet<TData = any>(
  key: readonly unknown[] | null,
  url: string,
  params?: Record<string, any>,
  options?: SWRConfiguration<TData, ErrorType>
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
      try {
        const response = await runExternalRequest<TData>(method, url, body, config);
        notifyMutationSuccess(method, response);
        return response;
      } catch (err: any) {
        toastError(err?.message || "Request failed");
        throw err;
      }
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
        try {
          const response = await runExternalRequest<TData>(method, url, body, config);
          notifyMutationSuccess(method, response);
          return response;
        } catch (err: any) {
          toastError(err?.message || "Request failed");
          throw err;
        }
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
      try {
        const res = await localFetch<TData>(url, init);
        try {
          const entity = (res as any)?.entity || (res as any)?.data?.entity || "Resource";
          if (method === "post") toastSuccess(`${String(entity)} created successfully`);
          else if (method === "put") toastSuccess(`${String(entity)} updated successfully`);
          else if (method === "patch") toastSuccess(`${String(entity)} updated successfully`);
          else if (method === "delete") toastSuccess(`${String(entity)} deleted successfully`);
        } catch { }
        return res;
      } catch (err: any) {
        toastError(err?.message || "Request failed");
        throw err;
      }
    },
    ...options,
  });
}

export { useSWRImmutable };
