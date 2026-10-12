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

/**
 * Map any representation of an uploads path to same-origin `/uploads/...`
 * so next/image hits the App Router proxy (never Express cross-origin directly).
 */
function sameOriginUploadPath(value: string) {
  const normalized = value.replace(/\\/g, "/");

  try {
    if (/^https?:\/\//i.test(normalized)) {
      const parsed = new URL(normalized);
      // Blob objects live at /uploads/... on *.blob.vercel-storage.com.
      // Rewriting those to the site proxy drops the file and cards show the SVG fallback.
      if (/\.blob\.vercel-storage\.com$/i.test(parsed.hostname)) {
        return "";
      }
      if (/^\/uploads\//i.test(parsed.pathname)) {
        return `${parsed.pathname}${parsed.search}`;
      }
      if (/^\/api\/uploads\//i.test(parsed.pathname)) {
        return `${parsed.pathname.replace(/^\/api/i, "")}${parsed.search}`;
      }
      return "";
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
 * Resolve API assets for the browser.
 * - Disk uploads → same-origin `/uploads/*` (App Router proxies to Express).
 * - Absolute https/blob/data (e.g. Vercel Blob) → pass through unchanged.
 */
export function asset(url?: unknown) {
  const value = asString(url);
  if (!value) return "";

  if (/^(blob:|data:)/i.test(value)) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    const uploadPath = sameOriginUploadPath(value);
    return uploadPath || value;
  }

  const uploadPath = sameOriginUploadPath(value);
  if (uploadPath) return uploadPath;

  return value.startsWith("/") ? value : `/${value}`;
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
    const alt =
      typeof image === "string" ? fallbackAlt : image?.alt || fallbackAlt;
    return [{ url, alt }];
  });
}

/** First usable cover URL from a story/listing-like image list. */
export function firstAssetUrl(
  images?: Array<AssetImage | string | null | undefined> | null,
  fallback: string = DEFAULT_LISTING_IMAGE,
) {
  const [first] = normalizeAssetImages(images);
  return first?.url || fallback;
}
