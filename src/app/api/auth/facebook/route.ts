import { NextRequest, NextResponse } from "next/server";

function getBaseUrl(req: NextRequest) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host") || "localhost:3000";
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function GET(req: NextRequest) {
  const appId = process.env.FACEBOOK_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  if (!appId) {
    return NextResponse.redirect(new URL("/sign-in?error=social_auth_unavailable", getBaseUrl(req)));
  }

  const redirectUri = new URL("/api/auth/callback/facebook", getBaseUrl(req)).toString();
  const nextParam = req.nextUrl.searchParams.get("next") || "/listings";
  const state = Buffer.from(JSON.stringify({ next: nextParam }), "utf8").toString("base64url");
  const authUrl = new URL("https://www.facebook.com/v22.0/dialog/oauth");
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "public_profile,email");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl);
}