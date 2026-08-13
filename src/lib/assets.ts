export type AssetImage = {
  url?: string | null;
  alt?: string | null;
};

const FALLBACK_BY_CATEGORY = {
  automotive: "/images/mock/automotive.svg",
  electronics: "/images/mock/electronics.svg",
  fashion: "/images/mock/fashion.svg",
  jobs: "/images/mock/jobs.svg",
  realEstate: "/images/mock/real-estate.svg",
  services: "/images/mock/services.svg",
} as const;

export const DEFAULT_LISTING_IMAGE = FALLBACK_BY_CATEGORY.services;

function asString(value?: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (value instanceof URL) return value.toString();
  return "";
}

function sameOriginUploadPath(value: string) {
  const normalized = value.replace(/\\/g, "/");

  try {
    if (/^https?:\/\//i.test(normalized)) {
      const parsed = new URL(normalized);
      if (/^\/uploads\//i.test(parsed.pathname)) {
        return `${parsed.pathname}${parsed.search}`;
      }
      if (/^\/api\/uploads\//i.test(parsed.pathname)) {
        return `${parsed.pathname.replace(/^\/api/i, "")}${parsed.search}`;
      }
    }
  } catch {
    return "";
  }

  if (/^\/?api\/uploads\//i.test(normalized)) {
    return `/${normalized.replace(/^\/?api\//i, "")}`;
  }
  if (/^\/?uploads\//i.test(normalized)) {
    return `/${normalized.replace(/^\//, "")}`;
  }

  return "";
}

/**
 * Resolve API assets without exposing the backend origin to the browser.
 * Uploads intentionally stay on `/uploads/*`, where the App Router proxy can
 * reach the configured backend in local, Docker, and production deployments.
 */
export function asset(url?: unknown) {
  const value = asString(url);
  if (!value) return "";

  const uploadPath = sameOriginUploadPath(value);
  if (uploadPath) return uploadPath;

  if (/^(https?:\/\/|blob:|data:)/i.test(value)) return value;

  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    ""
  ).replace(/\/?api\/?$/, "");
  if (!base) return value.startsWith("/") ? value : `/${value}`;

  const left = base.endsWith("/") ? base.slice(0, -1) : base;
  const right = value.startsWith("/") ? value : `/${value}`;
  return `${left}${right}`;
}

export function listingFallbackImage(categoryName?: string | null) {
  const category = String(categoryName ?? "").toLowerCase();

  if (/car|auto|motor|vehicle|transport/.test(category)) {
    return FALLBACK_BY_CATEGORY.automotive;
  }
  if (/electronic|phone|mobile|computer|tech|gadget/.test(category)) {
    return FALLBACK_BY_CATEGORY.electronics;
  }
  if (/fashion|cloth|apparel|shoe|beauty/.test(category)) {
    return FALLBACK_BY_CATEGORY.fashion;
  }
  if (/job|career|employment|vacan/.test(category)) {
    return FALLBACK_BY_CATEGORY.jobs;
  }
  if (/home|house|property|estate|apartment|land|rent/.test(category)) {
    return FALLBACK_BY_CATEGORY.realEstate;
  }

  return DEFAULT_LISTING_IMAGE;
}

export function normalizeAssetImages(
  images?: Array<AssetImage | string | null | undefined> | null,
  fallbackAlt = "Listing image",
): Array<{ url: string; alt: string }> {
  if (!Array.isArray(images)) return [];

  return images.flatMap((image) => {
    const rawUrl = typeof image === "string" ? image : image?.url;
    const url = asset(rawUrl);
    if (!url) return [];
    const alt = typeof image === "string" ? fallbackAlt : image?.alt || fallbackAlt;
    return [{ url, alt }];
  });
}
