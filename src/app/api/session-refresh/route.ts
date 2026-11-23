import { NextResponse } from "next/server";
import { clearSession, getSession, setSession, type SessionData } from "@/lib/session";
import { postBackend } from "@/lib/server/backend-api";

export const dynamic = "force-dynamic";

/**
 * Exchanges the refresh token stored in the HttpOnly session cookie for a new access token.
 * The API rotates the refresh token on every call; the new one replaces the old in the cookie.
 */
export async function POST() {
  const session = await getSession<SessionData>().catch(() => null);
  if (!session?.refreshToken) {
    return NextResponse.json({ ok: false, message: "Your session has expired, please sign in again" }, { status: 401 });
  }
  const result = await postBackend<any>("/auth/refresh", { refreshToken: session.refreshToken });
  const data = result.body?.data;
  if (!result.ok || !data?.accessToken) {
    // 401 = revoked / expired / reused token: drop the dead session. Network errors keep it for a retry.
    if (result.status === 401) await clearSession();
    return NextResponse.json(
      { ok: false, message: result.body?.message || "Your session has expired, please sign in again" },
      { status: result.status === 0 ? 503 : 401 },
    );
  }
  await setSession({ token: data.accessToken, refreshToken: data.refreshToken, user: session.user });
  return NextResponse.json(
    { ok: true, token: data.accessToken, expiresAt: data.expiresAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
