import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: false,
});

// Attach token by calling a tiny local endpoint that reads the HttpOnly session cookie.
let cachedToken: string | null = null;
export function setCachedToken(token: string | null) {
  cachedToken = token;
  try {
    if (typeof window !== "undefined") {
      if (token) {
        // also set axios default header for immediate effect
        (axiosClient.defaults.headers as any).common = {
          ...(axiosClient.defaults.headers as any).common,
          Authorization: `Bearer ${token}`,
        };
      } else {
        if ((axiosClient.defaults.headers as any).common)
          delete (axiosClient.defaults.headers as any).common.Authorization;
      }
    }
  } catch {}
}
axiosClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    if (typeof window !== "undefined") {
      // prefer explicit cachedToken, otherwise try to read from auth store (persisted zustand)
      let token = cachedToken;
      try {
        if (!token) {
          const store = useAuthStore as any;
          const state = store.getState ? store.getState() : undefined;
          token = state?.session?.token ?? null;
          if (token) cachedToken = token;
        }
      } catch {}
      if (token) {
        // ensure headers exists
        (config.headers as any) = (config.headers as any) || {};
        // prefer standard header key
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
  } catch {}
  return config;
});

axiosClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError<any>) => {
    // minimal global error handling; surface data message when available
    const message = (error?.response?.data as any)?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export interface ApiEnvelope<T = any> {
  message: string;
  statusCode: number;
  success: boolean;
  entity?: string;
  data: T;
}

function unwrap<T>(r: AxiosResponse<ApiEnvelope<T> | T>): T {
  const body = r.data as any;
  if (body && typeof body === "object" && "data" in body) return (body as ApiEnvelope<T>).data;
  return body as T;
}

export const api = {
  get: <T = any>(url: string, params?: any, headers?: any) => axiosClient.get<ApiEnvelope<T> | T>(url, { params, headers }).then((r) => unwrap<T>(r)),
  post: <T = any>(url: string, data?: any, headers?: any) => axiosClient.post<ApiEnvelope<T> | T>(url, data, { headers }).then((r) => unwrap<T>(r)),
  put: <T = any>(url: string, data?: any, headers?: any) => axiosClient.put<ApiEnvelope<T> | T>(url, data, { headers }).then((r) => unwrap<T>(r)),
  patch: <T = any>(url: string, data?: any, headers?: any) => axiosClient.patch<ApiEnvelope<T> | T>(url, data, { headers }).then((r) => unwrap<T>(r)),
  delete: <T = any>(url: string, headers?: any) => axiosClient.delete<ApiEnvelope<T> | T>(url, { headers }).then((r) => unwrap<T>(r)),
};
