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
  const appId = process.env.FACEBOOK_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const fallbackTarget = new URL("/sign-in?error=social_auth_failed", getBaseUrl(req));

  if (!code || !appId || !appSecret) {
    return NextResponse.redirect(fallbackTarget);
  }

  const redirectUri = new URL("/api/auth/callback/facebook", getBaseUrl(req)).toString();
  const tokenUrl = new URL("https://graph.facebook.com/v22.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);

  const tokenResponse = await fetch(tokenUrl, { cache: "no-store" }).then((response) => response.json());
  if (!tokenResponse?.access_token) {
    return NextResponse.redirect(fallbackTarget);
  }

  const loginResponse = await fetch(`${getApiBase()}/auth/social/facebook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken: tokenResponse.access_token }),
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