"use client";

import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { api, HttpMethod } from "./axiosClient";

type ErrorType = AxiosError<{ message?: string } | string> | Error;

export function useApiGet<TData = any>(
  key: readonly unknown[],
  url: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<TData, ErrorType, TData, readonly unknown[]>, "queryKey" | "queryFn">
) {
  return useQuery<TData, ErrorType>({
    queryKey: key,
  queryFn: () => api.get<TData>(url, params),
    ...options,
  });
}

type MutationBody = any;
type MutationOptions<TData> = UseMutationOptions<TData, ErrorType, MutationBody>;

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
          return api.post<TData>(url, body, config?.headers);
        case "put":
          return api.put<TData>(url, body);
        case "patch":
          return api.patch<TData>(url, body);
        case "delete":
          return api.delete<TData>(url);
        case "get":
        default:
          return api.get<TData>(url, config?.params);
      }
    },
    ...options,
  });
}
