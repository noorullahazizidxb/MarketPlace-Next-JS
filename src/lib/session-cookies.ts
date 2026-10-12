import type { NextResponse } from "next/server";

export const SESSION_COOKIE = "mp_session";
export const USER_INFO_COOKIE = "user_info";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: true,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export function slimSessionUser(user: any) {
  if (!user || typeof user !== "object") return null;
  const roles = Array.isArray(user.roles)
    ? user.roles.map((role: any) => ({
        id: role?.id,
        userId: role?.userId,
        role: role?.role,
      }))
    : [];
  return {
    id: user.id,
    email: user.email ?? null,
    name: user.fullName || user.name || user.email || null,
    fullName: user.fullName || user.name || null,
    photo: user.photo || user.avatarUrl || null,
    roles,
  };
}

export function applySessionCookies(
  response: NextResponse,
  values: { session: string; userInfo: string },
) {
  response.cookies.set(SESSION_COOKIE, values.session, sessionCookieOptions);
  response.cookies.set(USER_INFO_COOKIE, values.userInfo, sessionCookieOptions);
  return response;
}
