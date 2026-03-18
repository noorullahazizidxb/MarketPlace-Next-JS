import { NextRequest, NextResponse } from "next/server";

function getApiOrigin() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE ||
    "http://localhost:3002/api";

  return apiBase.replace(/\/?api\/?$/, "").replace(/\/$/, "");
}

function buildUploadUrl(req: NextRequest, pathParts: string[]) {
  const pathname = pathParts.map(encodeURIComponent).join("/");
  const upstream = new URL(`/uploads/${pathname}`, getApiOrigin());

  req.nextUrl.searchParams.forEach((value, key) => {
    upstream.searchParams.append(key, value);
  });

  return upstream;
}

async function proxyUpload(req: NextRequest, pathParts: string[]) {
  const upstream = buildUploadUrl(req, pathParts);
  const response = await fetch(upstream, {
    method: req.method,
    headers: {
      accept: req.headers.get("accept") || "*/*",
      range: req.headers.get("range") || "",
      "if-none-match": req.headers.get("if-none-match") || "",
      "if-modified-since": req.headers.get("if-modified-since") || "",
    },
    cache: "no-store",
    redirect: "follow",
  });

  const headers = new Headers();
  for (const name of [
    "content-type",
    "content-length",
    "cache-control",
    "etag",
    "last-modified",
    "accept-ranges",
    "content-range",
  ]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyUpload(req, path || []);
}

export async function HEAD(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyUpload(req, path || []);
}