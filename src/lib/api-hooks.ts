"use client";

import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import useSWRImmutable from "swr/immutable";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { api, HttpMethod } from "./axiosClient";
import { toastSuccess, toastError } from "./toast";

type ErrorType = AxiosError<{ message?: string } | string> | Error;

// Axios-backed SWR fetcher for external API routes
async function axiosGet<T>(url: string, params?: Record<string, any>): Promise<T> {
  try {
    const res = await api.get<T>(url, params);
    try {
      const entity = (res as any)?.entity || (res as any)?.data?.entity || "Resource";
      toastSuccess(`${String(entity)} fetched successfully`);
    } catch {}
    return res;
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
    const body = (await res.json()) as T;
    // try to infer entity and show fetch success for GET
    if (!init || init.method === "GET") {
      try {
        const entity = (body as any)?.entity || (body as any)?.data?.entity || "Resource";
        toastSuccess(`${String(entity)} fetched successfully`);
      } catch {}
    }
    return body;
  } catch (err: any) {
    toastError(err?.message || "Request failed");
    throw err;
  }
}

// SWR GET for external API with axios interceptor (Authorization etc.)
export function useSWRGet<T = any>(
  key: string | any[],
  url: string,
  params?: Record<string, any>,
  options?: SWRConfiguration<T, ErrorType>
): SWRResponse<T, ErrorType> {
  const swrKey = Array.isArray(key) ? key : [key];
  return useSWR<T, ErrorType>(swrKey, () => axiosGet<T>(url, params), {
    revalidateOnFocus: false,
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
    ...options,
  }) as unknown as SWRResponse<T, ErrorType>;
}

// Backward-compatible wrapper: delegate React Query GETs to SWR
export function useApiGet<TData = any>(
  key: readonly unknown[],
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
      switch (method) {
        case "post":
          try {
            const r = await api.post<TData>(url, body, config?.headers);
            try {
              const entity = (r as any)?.entity || (r as any)?.data?.entity || "Resource";
              toastSuccess(`${String(entity)} created successfully`);
            } catch {}
            return r;
          } catch (err: any) {
            toastError(err?.message || "Request failed");
            throw err;
          }
        case "put":
          try {
            const r = await api.put<TData>(url, body);
            try {
              const entity = (r as any)?.entity || (r as any)?.data?.entity || "Resource";
              toastSuccess(`${String(entity)} updated successfully`);
            } catch {}
            return r;
          } catch (err: any) {
            toastError(err?.message || "Request failed");
            throw err;
          }
        case "patch":
          try {
            const r = await api.patch<TData>(url, body);
            try {
              const entity = (r as any)?.entity || (r as any)?.data?.entity || "Resource";
              toastSuccess(`${String(entity)} updated successfully`);
            } catch {}
            return r;
          } catch (err: any) {
            toastError(err?.message || "Request failed");
            throw err;
          }
        case "delete":
          try {
            const r = await api.delete<TData>(url);
            try {
              const entity = (r as any)?.entity || (r as any)?.data?.entity || "Resource";
              toastSuccess(`${String(entity)} deleted successfully`);
            } catch {}
            return r;
          } catch (err: any) {
            toastError(err?.message || "Request failed");
            throw err;
          }
        case "get":
        default:
          try {
            const r = await api.get<TData>(url, config?.params);
            try {
              const entity = (r as any)?.entity || (r as any)?.data?.entity || "Resource";
              toastSuccess(`${String(entity)} fetched successfully`);
            } catch {}
            return r;
          } catch (err: any) {
            toastError(err?.message || "Request failed");
            throw err;
          }
      }
    },
    ...options,
  });
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
          else if (method === "delete") toastSuccess(`${String(entity)} deleted successfully`);
          else toastSuccess(`${String(entity)} fetched successfully`);
        } catch {}
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
