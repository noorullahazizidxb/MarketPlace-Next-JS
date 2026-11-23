"use client";

import { toastError, toastSuccess } from "@/lib/toast";

/**
 * HTTP message middleware (UI side).
 * The API returns an entity-specific `message` in every envelope ("Product created successfully",
 * "User not found", ...). This module decides when to surface it so components don't have to
 * hand-craft generic messages.
 */

export type HttpMessageOptions = {
  /** Suppress toasts for this request entirely. */
  silent?: boolean;
  /** Also toast successful GET responses (off by default). */
  toastOnGet?: boolean;
};

const MUTATING = new Set(["post", "put", "patch", "delete"]);

export function extractServerMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return typeof body === "string" && body.length < 300 ? body : null;
  const b = body as any;
  const message = b.message ?? b.error?.message ?? (typeof b.error === "string" ? b.error : null);
  return typeof message === "string" && message.trim() ? message.trim() : null;
}

export function notifySuccess(method: string | undefined, body: unknown, opts: HttpMessageOptions = {}) {
  if (opts.silent) return;
  const m = String(method || "get").toLowerCase();
  if (!MUTATING.has(m) && !opts.toastOnGet) return;
  const message = extractServerMessage(body);
  if (message) toastSuccess(message);
}

export function notifyError(message: string, opts: HttpMessageOptions = {}) {
  if (opts.silent || !message) return;
  toastError(message);
}

/** Error carrying the server's message, HTTP status and machine-readable code. */
export class ApiError extends Error {
  status: number;
  code?: string;
  data?: unknown;
  notified: boolean;
  constructor(message: string, status = 0, data?: unknown, notified = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = (data as any)?.error?.code;
    this.notified = notified;
  }
}
