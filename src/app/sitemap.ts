import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/site-config";

const STATIC_PATHS = [
  "/",
  "/listings",
  "/blogs",
  "/about",
  "/contact",
] as const;

async function fetchIds(endpoint: string): Promise<string[]> {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ||
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
      "";
    if (!apiBase) return [];
    const res = await fetch(`${apiBase}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as
      | { data?: Array<Record<string, unknown>> }
      | Array<Record<string, unknown>>;
    const rows = Array.isArray(json) ? json : json.data ?? [];
    return rows
      .map((row) => {
        const id = row.id ?? row.slug;
        return id != null ? String(id) : null;
      })
      .filter((v): v is string => Boolean(v));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" || path === "/listings" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const [listingIds, blogIds] = await Promise.all([
    fetchIds("/listings"),
    fetchIds("/blogs"),
  ]);

  return [
    ...staticEntries,
    ...listingIds.map((id) => ({
      url: `${SITE_URL}/listings/${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...blogIds.map((id) => ({
      url: `${SITE_URL}/blogs/${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
