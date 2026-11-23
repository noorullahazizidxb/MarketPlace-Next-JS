import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUploadUrl } from "@/lib/upload-origin";

const REQUEST_HEADER_KEYS = [
  "accept",
  "range",
  "if-none-match",
  "if-modified-since",
] as const;

const RESPONSE_HEADER_KEYS = [
  "content-type",
  "content-length",
  "cache-control",
  "etag",
  "last-modified",
  "accept-ranges",
  "content-range",
] as const;

const DEFAULT_CACHE_CONTROL = "public, max-age=604800, immutable";

function copyRequestHeaders(req: NextRequest): HeadersInit {
  const headers: Record<string, string> = {};
  for (const key of REQUEST_HEADER_KEYS) {
    const value = req.headers.get(key);
    if (value) headers[key] = value;
  }
  return headers;
}

function copyResponseHeaders(source: Headers): Headers {
  const headers = new Headers();
  for (const key of RESPONSE_HEADER_KEYS) {
    const value = source.get(key);
    if (value) headers.set(key, value);
  }
  if (!headers.has("cache-control")) {
    headers.set("cache-control", DEFAULT_CACHE_CONTROL);
  }
  return headers;
}

async function proxyUpload(req: NextRequest, pathParts: string[]) {
  const upstream = buildUpstreamUploadUrl(
    pathParts || [],
    req.nextUrl.searchParams,
  );

  if (!upstream) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let response: Response;
  try {
    response = await fetch(upstream, {
      method: req.method,
      headers: copyRequestHeaders(req),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return new NextResponse("Bad Gateway", { status: 502 });
  }

  // Do not follow redirects into HTML pages (would poison next/image).
  if (response.status >= 300 && response.status < 400) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const contentType = response.headers.get("content-type") || "";
  if (
    response.ok &&
    contentType &&
    !/^(image|video|audio|application\/octet-stream|font)\b/i.test(contentType) &&
    /text\/html/i.test(contentType)
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: copyResponseHeaders(response.headers),
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
