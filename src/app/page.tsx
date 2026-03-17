import { headers } from "next/headers";
import { redirect } from "next/navigation";

function extractOrigin(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
}

function normalizeHost(value: string | null) {
  if (!value) return null;
  const first = value.split(",")[0]?.trim().toLowerCase();
  if (!first) return null;
  return first.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function originToHost(value: string | null) {
  const origin = extractOrigin(value);
  if (!origin) return null;
  try {
    return new URL(origin).host.toLowerCase();
  } catch {
    return normalizeHost(origin);
  }
}

export default async function RootRedirect() {
  const headerStore = await headers();
  const requestOrigin = extractOrigin(headerStore.get("origin"));
  const refererOrigin = extractOrigin(headerStore.get("referer"));
  const forwardedHost = normalizeHost(headerStore.get("x-forwarded-host"));
  const requestHost = normalizeHost(headerStore.get("host"));
  const sourceOrigin = requestOrigin || refererOrigin;
  const sourceHost = forwardedHost || requestHost || originToHost(sourceOrigin);
  const blogOrigin = process.env.BLOG_ORIGIN || null;
  const marketplaceOrigin = process.env.MARKETPLACE_ORIGIN || null;
  const blogHost = originToHost(blogOrigin);
  const marketplaceHost = originToHost(marketplaceOrigin);

  if (
    (sourceOrigin && blogOrigin && sourceOrigin === blogOrigin) ||
    (sourceHost && blogHost && sourceHost === blogHost)
  ) {
    redirect("/blog");
  }

  if (
    (sourceOrigin && marketplaceOrigin && sourceOrigin === marketplaceOrigin) ||
    (sourceHost && marketplaceHost && sourceHost === marketplaceHost)
  ) {
    redirect("/listings");
  }

  redirect("/listings");
}
