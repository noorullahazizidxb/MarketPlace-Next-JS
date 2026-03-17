import { NextRequest, NextResponse } from "next/server";
import { setSession, setUserInfo } from "@/lib/session";

function getBaseUrl(req: NextRequest) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host") || "localhost:3000";
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function getApiBase() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE ||
    "http://localhost:3002/api"
  ).replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const rawState = req.nextUrl.searchParams.get("state");
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const fallbackTarget = new URL("/sign-in?error=social_auth_failed", getBaseUrl(req));

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(fallbackTarget);
  }

  const redirectUri = new URL("/api/auth/callback/google", getBaseUrl(req)).toString();

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  }).then((response) => response.json());

  if (!tokenResponse?.id_token) {
    return NextResponse.redirect(fallbackTarget);
  }

  const loginResponse = await fetch(`${getApiBase()}/auth/social/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken: tokenResponse.id_token }),
    cache: "no-store",
  }).then(async (response) => {
    const json = await response.json().catch(() => null);
    return response.ok ? json : null;
  });

  const payload = loginResponse?.data || loginResponse;
  if (!payload?.token || !payload?.user) {
    return NextResponse.redirect(fallbackTarget);
  }

  await setSession({ token: payload.token, user: payload.user });
  await setUserInfo(payload.user).catch(() => null);

  let next = "/listings";
  if (rawState) {
    try {
      const parsed = JSON.parse(Buffer.from(rawState, "base64url").toString("utf8"));
      if (typeof parsed?.next === "string" && parsed.next.startsWith("/")) {
        next = parsed.next;
      }
    } catch { }
  }

  return NextResponse.redirect(new URL(next, getBaseUrl(req)));
}