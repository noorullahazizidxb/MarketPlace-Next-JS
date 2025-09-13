"use server";

// Minimal encrypted session using Web Crypto (AES-GCM) and HttpOnly cookie storage.
// We keep it simple: store the whole auth `data` object encrypted in a cookie.

import { cookies } from "next/headers";

const COOKIE_NAME = "mp_session";
const KEY_NAME = "mp_session_key"; // stored in process env during runtime; fallback for dev

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

export async function setSession(data: any) {
	const value = await encrypt(data);
	cookies().set(COOKIE_NAME, value, {
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	});
}

// Also persist a minimal encrypted user_info cookie for client-side reference by name
const USER_INFO_COOKIE = "user_info";
export async function setUserInfo(user: any) {
	try {
		const minimal = { id: user?.id, name: user?.fullName || user?.name || user?.email, photo: user?.avatarUrl || user?.photo };
		const val = await encrypt(minimal);
		cookies().set(USER_INFO_COOKIE, val, {
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
	} catch (e) {
		// best-effort
	}
}

export async function getSession<T = any>(): Promise<T | null> {
	const c = cookies().get(COOKIE_NAME)?.value;
	if (!c) return null;
	return (await decrypt(c)) as T | null;
}

export async function clearSession() {
	cookies().delete(COOKIE_NAME);
}

export type SessionData = {
	token: string;
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
