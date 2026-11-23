"use client";

import { queryClient } from "@/lib/query-client";
import { setCachedToken } from "@/lib/axiosClient";
import { useAuthStore } from "@/store/auth.store";
import { useListingsStore } from "@/store/listings.store";
import { useNotificationsStore } from "@/store/notifications.store";

const AUTH_CHANNEL = "mp-auth";
const SIGN_IN_PATH = "/sign-in";

/**
 * Wipe every client-side copy of the session: in-memory axios token, the persisted zustand
 * auth store (localStorage), user-scoped stores and the React Query cache. The cache matters:
 * `useAuth` caches /api/session-token forever, and a stale cached token would otherwise be
 * written straight back into the store right after sign-out.
 */
export function clearClientSession() {
  setCachedToken(null);
  queryClient.cancelQueries();
  queryClient.clear();
  useAuthStore.getState().clear();
  useListingsStore.getState().clear();
  useNotificationsStore.getState().clear();
  try {
    useAuthStore.persist?.clearStorage?.();
  } catch {
    /* storage unavailable */
  }
}

let signingOut: Promise<void> | null = null;

/**
 * Single sign-out flow for every role and every UI entry point:
 * 1. clear client state first (so nothing can resurrect the session),
 * 2. revoke the refresh token + clear HttpOnly cookies on the server,
 * 3. notify other tabs, 4. hard-navigate to the sign-in page.
 */
export function signOut({ redirectTo = SIGN_IN_PATH, broadcast = true }: { redirectTo?: string; broadcast?: boolean } = {}) {
  if (signingOut) return signingOut;
  signingOut = (async () => {
    clearClientSession();
    try {
      await fetch("/api/logout", { method: "POST", cache: "no-store", credentials: "same-origin", keepalive: true });
    } catch {
      /* cookies are cleared server-side when reachable; client state is already gone */
    }
    if (broadcast) postAuthEvent("signed-out");
    if (typeof window !== "undefined") window.location.replace(redirectTo);
  })();
  return signingOut;
}

function postAuthEvent(type: "signed-out") {
  try {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage({ type });
    channel.close();
  } catch {
    /* BroadcastChannel unsupported */
  }
}

/** Keep tabs in sync: when one tab signs out, all others do too (no stale tab can re-persist the session). */
export function subscribeToAuthEvents() {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return () => {};
  const channel = new BroadcastChannel(AUTH_CHANNEL);
  channel.onmessage = (event) => {
    if (event?.data?.type === "signed-out") {
      clearClientSession();
      window.location.replace(SIGN_IN_PATH);
    }
  };
  return () => channel.close();
}
