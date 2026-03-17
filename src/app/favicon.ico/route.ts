import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Redirect legacy /favicon.ico requests to the existing SVG favicon
  const url = new URL("/favicon.svg", request.url);
  return NextResponse.redirect(url, 308);
}
