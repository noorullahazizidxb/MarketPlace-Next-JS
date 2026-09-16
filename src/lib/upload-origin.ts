/**
 * Resolve the Express origin that serves `/uploads/*`.
 *
 * Prefer BACKEND_VERCEL_URL (API host or local :4000).
 * Never treat `…/backend` as the file host — a leading `/uploads`
 * on that base drops `/backend` and loops back to Next (HTML → invalid image).
 */

const DEFAULT_UPLOAD_ORIGIN = "http://localhost:4000";

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function firstDefined(...values: Array<string | undefined>) {
  for (const value of values) {
    const trimmed = String(value ?? "").trim();
    if (trimmed) return trimmed;
  }
  return "";
}

export function getUploadOrigin(): string {
  const backend = stripTrailingSlash(
    firstDefined(process.env.BACKEND_VERCEL_URL),
  );
  if (backend) return backend;

  const apiBase = firstDefined(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE,
    process.env.API_BASE,
    `${DEFAULT_UPLOAD_ORIGIN}/api`,
  );

  let origin = stripTrailingSlash(apiBase.replace(/\/?api\/?$/i, ""));

  // Same-domain Next rewrite path is not Express.
  if (/\/backend$/i.test(origin)) {
    return DEFAULT_UPLOAD_ORIGIN;
  }

  return origin || DEFAULT_UPLOAD_ORIGIN;
}

/** Reject empty, absolute, or traversal segments before proxying. */
export function sanitizeUploadPathParts(pathParts: string[]): string[] | null {
  if (!Array.isArray(pathParts) || pathParts.length === 0) return null;

  const safe: string[] = [];
  for (const part of pathParts) {
    const segment = String(part ?? "").trim();
    if (!segment || segment === "." || segment === "..") return null;
    if (segment.includes("/") || segment.includes("\\") || segment.includes("\0")) {
      return null;
    }
    safe.push(segment);
  }
  return safe.length ? safe : null;
}

export function buildUpstreamUploadUrl(
  pathParts: string[],
  searchParams?: URLSearchParams,
): URL | null {
  const safeParts = sanitizeUploadPathParts(pathParts);
  if (!safeParts) return null;

  const pathname = safeParts.map(encodeURIComponent).join("/");
  const upstream = new URL(`/uploads/${pathname}`, `${getUploadOrigin()}/`);

  if (searchParams) {
    searchParams.forEach((value, key) => {
      upstream.searchParams.append(key, value);
    });
  }

  return upstream;
}
