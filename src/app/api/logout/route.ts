import { NextResponse } from "next/server";
import { clearSession, getSession, type SessionData } from "@/lib/session";
import { postBackend } from "@/lib/server/backend-api";

export const dynamic = "force-dynamic";

/**
 * Sign-out: revoke the refresh-token family on the API (best effort, short timeout) and
 * always clear the HttpOnly session cookies, even when the API is unreachable.
 */
export async function POST() {
  const session = await getSession<SessionData>().catch(() => null);
  if (session?.refreshToken) {
    await postBackend("/auth/logout", { refreshToken: session.refreshToken }, { timeoutMs: 4000, token: session.token });
  }
  await clearSession();
  return NextResponse.json(
    { ok: true, success: true, message: "Signed out successfully" },
    { headers: { "Cache-Control": "no-store", "Clear-Site-Data": '"cache"' } },
  );
}

export async function GET() {
  return NextResponse.json({ ok: true, note: "Use POST to logout" });
}
