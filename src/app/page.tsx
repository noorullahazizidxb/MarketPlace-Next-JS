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

export default async function RootRedirect() {
  const headerStore = await headers();
  const requestOrigin = extractOrigin(headerStore.get("origin"));
  const refererOrigin = extractOrigin(headerStore.get("referer"));
  const sourceOrigin = requestOrigin || refererOrigin;
  const blogOrigin = process.env.BLOG_ORIGIN || null;
  const marketplaceOrigin = process.env.MARKETPLACE_ORIGIN || null;

  if (sourceOrigin && blogOrigin && sourceOrigin === blogOrigin) {
    redirect("/blogs");
  }

  if (sourceOrigin && marketplaceOrigin && sourceOrigin === marketplaceOrigin) {
    redirect("/listings");
  }

  redirect("/listings");
}
