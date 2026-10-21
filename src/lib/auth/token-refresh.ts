"use client";

/**
 * Client side of the rotating refresh-token flow. The refresh token itself never reaches JS:
 * it lives in the encrypted HttpOnly session cookie and /api/session-refresh rotates it.
 */

const REFRESH_SKEW_SECONDS = 60;
let inflight: Promise<string | null> | null = null;

export function decodeTokenExpiry(token: string | null | undefined): number | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

export function isTokenExpiring(token: string | null | undefined, skewSeconds = REFRESH_SKEW_SECONDS) {
  const exp = decodeTokenExpiry(token);
  if (!exp) return false;
  return exp - skewSeconds <= Math.floor(Date.now() / 1000);
}

/** Single-flight refresh: concurrent 401s share one rotation (rotating tokens must not be used twice). */
export function refreshAccessToken(): Promise<string | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/session-refresh", { method: "POST", cache: "no-store", credentials: "same-origin" });
      if (!res.ok) return null;
      const body = await res.json().catch(() => null);
      return typeof body?.token === "string" ? body.token : null;
    } catch {
      return null;
    } finally {
      setTimeout(() => {
        inflight = null;
      }, 0);
    }
  })();
  return inflight;
}
