import type { AdminPageId } from "@repo/types";

export type AppearanceDensityTab =
  | "typography"
  | "weights"
  | "icons"
  | "controls"
  | "spacing"
  | "sidebar"
  | "table"
  | "mobile"
  | "decorative"
  | "loading-motion";

export type AppearancePreviewPage = {
  id: AdminPageId;
  label: string;
  path: string;
  description: string;
};

/** Public production routes used by the isolated page preview iframe. */
export const APPEARANCE_PAGE_OPTIONS: AppearancePreviewPage[] = [
  {
    id: "listings",
    label: "Listings",
    path: "/listings",
    description: "Marketplace search, filters, listing cards, and navigation.",
  },
  {
    id: "blogs",
    label: "Blogs",
    path: "/blogs",
    description: "Editorial cards, media, and social actions.",
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    description: "Long-form marketing sections and call-to-action surfaces.",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    description: "Contact form controls and narrow-screen layout.",
  },
  {
    id: "sign-in",
    label: "Sign in",
    path: "/sign-in",
    description: "Authentication surface without application chrome.",
  },
  {
    id: "sign-up",
    label: "Sign up",
    path: "/sign-up",
    description: "Multi-field authentication and validation states.",
  },
];

const PAGE_BY_ID = new Map(
  APPEARANCE_PAGE_OPTIONS.map((page) => [page.id, page] as const),
);

export function resolvePreviewPage(pageId: AdminPageId): AppearancePreviewPage | null {
  return PAGE_BY_ID.get(pageId) ?? null;
}

export function resolvePreviewPageLabel(pageId: AdminPageId): string {
  return resolvePreviewPage(pageId)?.label ?? pageId;
}

export const CATEGORY_WIDGET_PAGE_MAP: Record<AppearanceDensityTab, AdminPageId> = {
  typography: "listings",
  weights: "blogs",
  icons: "listings",
  controls: "contact",
  spacing: "about",
  sidebar: "listings",
  table: "blogs",
  mobile: "sign-in",
  decorative: "about",
  "loading-motion": "listings",
};
