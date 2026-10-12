import { NextRequest, NextResponse } from "next/server";
import { buildSessionCookies } from "@/lib/session";
import { applySessionCookies } from "@/lib/session-cookies";

function getBaseUrl(req: NextRequest) {
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.headers.get("host") || "localhost:3000";
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured && !host.includes("localhost")) return configured;
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
  const fallbackTarget = new URL("/sign-in?error=social_auth_failed", getBaseUrl(req));

  if (!code) {
    return NextResponse.redirect(fallbackTarget);
  }

  const redirectUri = new URL("/api/auth/callback/google", getBaseUrl(req)).toString();

  const loginResponse = await fetch(`${getApiBase()}/auth/social/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, redirectUri }),
    cache: "no-store",
  }).then(async (response) => {
    const json = await response.json().catch(() => null);
    return response.ok ? json : null;
  });

  const payload = loginResponse?.data || loginResponse;
  if (!payload?.token || !payload?.user) {
    return NextResponse.redirect(fallbackTarget);
  }

  let next = "/listings";
  if (rawState) {
    try {
      const parsed = JSON.parse(Buffer.from(rawState, "base64url").toString("utf8"));
      if (typeof parsed?.next === "string" && parsed.next.startsWith("/")) {
        next = parsed.next;
      }
    } catch { }
  }

  const response = NextResponse.redirect(new URL(next, getBaseUrl(req)));
  const cookies = await buildSessionCookies({ token: payload.token, user: payload.user });
  return applySessionCookies(response, cookies);
}