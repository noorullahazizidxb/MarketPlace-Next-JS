"use server";

// Encrypted HttpOnly session. Cookies keep the token and a small user profile.

import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  USER_INFO_COOKIE,
  sessionCookieOptions,
  slimSessionUser,
} from "@/lib/session-cookies";

function getRawKey(): string {
  return process.env.SESSION_SECRET || process.env.NEXT_PUBLIC_SESSION_SECRET || "dev-insecure-secret-please-change";
}

async function importKey() {
  const enc = new TextEncoder();
  const raw = enc.encode(getRawKey().slice(0, 32).padEnd(32, "0"));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encrypt(json: any): Promise<string> {
  const key = await importKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(json));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  const buff = new Uint8Array(iv.byteLength + cipher.byteLength);
  buff.set(iv, 0);
  buff.set(new Uint8Array(cipher), iv.byteLength);
  return Buffer.from(buff).toString("base64url");
}

async function decrypt(token: string): Promise<any | null> {
  try {
    const key = await importKey();
    const bytes = Buffer.from(token, "base64url");
    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    const text = new TextDecoder().decode(plain);
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function buildSessionCookies(data: { token: string; user: any; refreshToken?: string | null }) {
  const user = slimSessionUser(data.user);
  const session = await encrypt({ token: data.token, refreshToken: data.refreshToken ?? null, user });
  const userInfo = await encrypt(user);
  return { session, userInfo };
}

export async function setSession(data: any) {
  const value = await encrypt({
    token: data?.token,
    // Rotating refresh token lives only in this HttpOnly, encrypted cookie (never in JS-readable storage).
    refreshToken: data?.refreshToken ?? null,
    user: slimSessionUser(data?.user),
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, value, sessionCookieOptions);
}

export async function setUserInfo(user: any) {
  try {
    const val = await encrypt(slimSessionUser(user));
    const cookieStore = await cookies();
    cookieStore.set(USER_INFO_COOKIE, val, sessionCookieOptions);
  } catch {
    // best-effort
  }
}

export async function getUserInfo<T = any>(): Promise<T | null> {
  const cookieStore = await cookies();
  const c = cookieStore.get(USER_INFO_COOKIE)?.value;
  if (!c) return null;
  return (await decrypt(c)) as T | null;
}

export async function getSession<T = any>(): Promise<T | null> {
  const cookieStore = await cookies();
  const c = cookieStore.get(SESSION_COOKIE)?.value;
  if (!c) return null;
  return (await decrypt(c)) as T | null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  // Overwrite with the exact same attributes (path/secure/sameSite) and an immediate expiry so the
  // browser reliably drops the cookie.
  const expired = { ...sessionCookieOptions, maxAge: 0, expires: new Date(0) };
  cookieStore.set(SESSION_COOKIE, "", expired);
  cookieStore.set(USER_INFO_COOKIE, "", expired);
}

export type SessionData = {
  token: string;
  refreshToken?: string | null;
  user: any;
};

export async function pickCountsFromSession(session: any) {
  const user = session?.user || {};
  return {
    notifications: (user.notifications || []).length || 0,
    listings: (user.listings || []).length || 0,
    approvedListings: (user.approvedListings || []).length || 0,
    auditLogs: (user.auditLogs || []).length || 0,
    feedback: (user.feedbacks || []).length || 0,
  };
}
