import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import { isTokenExpiring, refreshAccessToken } from "@/lib/auth/token-refresh";
import {
  ApiError,
  extractServerMessage,
  notifyError,
  notifySuccess,
  type HttpMessageOptions,
} from "@/lib/http/http-messages";

// Prefer NEXT_PUBLIC_API_BASE_URL (public HTTP API), then fallback to NEXT_PUBLIC_API_BASE, then default
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://marketplace.devminds.net/api";

export const axiosClient = axios.create({
  baseURL,
  withCredentials: false,
});

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
  } catch { }
}
declare module "axios" {
  interface AxiosRequestConfig {
    /** HTTP message middleware options (see lib/http/http-messages). */
    messages?: HttpMessageOptions;
    /** internal: request already retried after a token refresh */
    _retried?: boolean;
  }
}

function readToken(): string | null {
  if (cachedToken) return cachedToken;
  try {
    const token = useAuthStore.getState()?.session?.token ?? null;
    if (token) cachedToken = token;
    return token;
  } catch {
    return null;
  }
}

/** Store a freshly rotated access token everywhere the client reads it from. */
function applyRefreshedToken(token: string) {
  setCachedToken(token);
  try {
    useAuthStore.getState().setToken(token);
  } catch { }
}

async function refreshOrSignOut(): Promise<string | null> {
  const token = await refreshAccessToken();
  if (token) {
    applyRefreshedToken(token);
    return token;
  }
  return null;
}

// ── Request middleware: attach (and proactively refresh) the bearer token ──────────────
axiosClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    if (typeof window !== "undefined") {
      if (new URLSearchParams(window.location.search).get("appearance-preview") === "1") {
        config.baseURL = "/backend/api";
        delete (config.headers as any)?.Authorization;
        return config;
      }
      let token = readToken();
      if (token && isTokenExpiring(token)) token = (await refreshOrSignOut()) ?? token;
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
    }
  } catch { }
  return config;
});

// ── Response middleware: surface the server's message, refresh on 401 once ────────────
axiosClient.interceptors.response.use(
  (res: AxiosResponse) => {
    notifySuccess(res.config?.method, res.data, res.config?.messages);
    return res;
  },
  async (error: AxiosError<any>) => {
    const config = error.config;
    const status = error.response?.status ?? 0;
    const sentToken = Boolean(config?.headers?.get?.("Authorization") || (config?.headers as any)?.Authorization);
    const isAuthEndpoint = /\/auth\/(login|refresh|logout|social)/.test(String(config?.url || ""));

    if (status === 401 && config && sentToken && !isAuthEndpoint && !config._retried && typeof window !== "undefined") {
      config._retried = true;
      const token = await refreshOrSignOut();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
        return axiosClient.request(config);
      }
      // refresh token missing / revoked / expired: end the session cleanly
      const { signOut } = await import("@/lib/auth/session-client");
      void signOut();
    }

    const message =
      extractServerMessage(error.response?.data) ||
      (status === 0 ? "Network error, please check your connection" : error.message) ||
      "Request failed";
    notifyError(message, config?.messages);
    return Promise.reject(new ApiError(message, status, error.response?.data, !config?.messages?.silent));
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

type RequestOptions = { headers?: any; messages?: HttpMessageOptions };

export const api = {
  get: <T = any>(url: string, params?: any, headers?: any, opts: RequestOptions = {}) => axiosClient.get<ApiEnvelope<T> | T>(url, { params, headers, messages: opts.messages }).then((r) => unwrap<T>(r)),
  post: <T = any>(url: string, data?: any, headers?: any, opts: RequestOptions = {}) => axiosClient.post<ApiEnvelope<T> | T>(url, data, { headers, messages: opts.messages }).then((r) => unwrap<T>(r)),
  put: <T = any>(url: string, data?: any, headers?: any, opts: RequestOptions = {}) => axiosClient.put<ApiEnvelope<T> | T>(url, data, { headers, messages: opts.messages }).then((r) => unwrap<T>(r)),
  patch: <T = any>(url: string, data?: any, headers?: any, opts: RequestOptions = {}) => axiosClient.patch<ApiEnvelope<T> | T>(url, data, { headers, messages: opts.messages }).then((r) => unwrap<T>(r)),
  delete: <T = any>(url: string, headers?: any, opts: RequestOptions = {}) => axiosClient.delete<ApiEnvelope<T> | T>(url, { headers, messages: opts.messages }).then((r) => unwrap<T>(r)),
};
