import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: false,
});

// Attach token by calling a tiny local endpoint that reads the HttpOnly session cookie.
let cachedToken: string | null = null;
axiosClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    if (typeof window !== "undefined") {
      if (!cachedToken) {
        const res = await fetch("/api/session-token", { cache: "no-store" });
        if (res.ok) {
          const j = (await res.json()) as { token?: string };
          cachedToken = j.token || null;
        }
      }
      if (cachedToken) config.headers.set("Authorization", `Bearer ${cachedToken}`);
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
  get: <T = any>(url: string, params?: any) => axiosClient.get<ApiEnvelope<T> | T>(url, { params }).then((r) => unwrap<T>(r)),
  post: <T = any>(url: string, data?: any, headers?: any) => axiosClient.post<ApiEnvelope<T> | T>(url, data, { headers }).then((r) => unwrap<T>(r)),
  put: <T = any>(url: string, data?: any) => axiosClient.put<ApiEnvelope<T> | T>(url, data).then((r) => unwrap<T>(r)),
  patch: <T = any>(url: string, data?: any) => axiosClient.patch<ApiEnvelope<T> | T>(url, data).then((r) => unwrap<T>(r)),
  delete: <T = any>(url: string) => axiosClient.delete<ApiEnvelope<T> | T>(url).then((r) => unwrap<T>(r)),
};
