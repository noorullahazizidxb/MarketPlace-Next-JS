"use client";

import type { ComponentType, ReactNode } from "react";
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

type PreviewLoader = () => Promise<{ default: ComponentType }>;

const PAGE_LABELS: Partial<Record<AdminPageId, string>> = {
  listings: "Listings",
  "listing-detail": "Listing detail",
  "listings-create": "Create listing",
  "my-listings": "My listings",
  blogs: "Blogs",
  "blog-detail": "Blog detail",
  profile: "Profile",
  about: "About",
  contact: "Contact",
  "sign-in": "Sign in",
  "sign-up": "Sign up",
  admin: "Admin",
  "settings-appearance": "Appearance",
};

/** Lightweight live-preview shells for Appearance Studio. */
function PreviewShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="app-shell-card rounded-[var(--radius)] border border-border bg-card text-card-foreground">
      <p className="app-text-heading-sm mb-[var(--space-gap)]">{title}</p>
      {children}
    </div>
  );
}

function ListingsPreview() {
  return (
    <PreviewShell title="Listings">
      <div className="grid gap-[var(--space-gap)]">
        <div className="h-[var(--ctrl-h)] rounded-[var(--radius)] bg-muted" />
        <div className="grid grid-cols-2 gap-[var(--space-gap)]">
          <div className="min-h-24 rounded-[var(--radius)] border border-border bg-background p-[var(--space-card)]">
            <p className="app-text-label">Card title</p>
            <p className="app-text-caption text-muted-foreground">Body copy</p>
          </div>
          <div className="min-h-24 rounded-[var(--radius)] border border-border bg-background p-[var(--space-card)]">
            <p className="app-text-label">Card title</p>
            <p className="app-text-caption text-muted-foreground">Body copy</p>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function ControlsPreview() {
  return (
    <PreviewShell title="Controls">
      <div className="flex flex-wrap items-center gap-[var(--space-gap)]">
        <button
          type="button"
          className="min-h-[var(--ctrl-h)] px-[var(--ctrl-px)] rounded-[var(--radius)] bg-primary text-primary-foreground app-text-action"
        >
          Primary
        </button>
        <button
          type="button"
          className="min-h-[var(--ctrl-h-sm)] px-[var(--ctrl-px)] rounded-[var(--radius)] border border-border app-text-action"
        >
          Secondary
        </button>
        <span className="inline-flex min-h-[var(--badge-h)] items-center rounded-full bg-muted px-[var(--badge-px)] app-text-badge">
          Badge
        </span>
      </div>
    </PreviewShell>
  );
}

function SidebarPreview() {
  return (
    <PreviewShell title="Sidebar">
      <div className="rounded-[var(--radius)] border border-sidebar-border bg-sidebar p-[var(--space-filter)] text-sidebar-foreground">
        <p className="app-text-label opacity-70">Group</p>
        <div className="mt-2 space-y-1">
          <div className="rounded-md bg-sidebar-accent px-[var(--nav-item-px)] py-[var(--nav-item-py)] app-text-body">
            Active item
          </div>
          <div className="px-[var(--nav-item-px)] py-[var(--nav-item-py)] app-text-body opacity-80">
            Item
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function TablePreview() {
  return (
    <PreviewShell title="Table">
      <div className="overflow-hidden rounded-[var(--radius)] border border-border">
        <div
          className="flex items-center border-b border-border bg-muted/40 px-[var(--table-cell-px)]"
          style={{ height: "var(--table-head-h)", fontSize: "var(--table-head-text)" }}
        >
          Column
        </div>
        <div
          className="px-[var(--table-cell-px)] py-[var(--table-cell-py)]"
          style={{ fontSize: "var(--table-cell-text)" }}
        >
          Row value
        </div>
      </div>
    </PreviewShell>
  );
}

function DecorativePreview() {
  return (
    <PreviewShell title="Decorative">
      <div className="relative h-28 overflow-hidden rounded-[var(--radius)] border border-border bg-background">
        <div className="bg-aurora-one absolute -left-6 top-2 size-24 rounded-full blur-2xl" />
        <div className="bg-aurora-two absolute -right-4 bottom-0 size-20 rounded-full blur-2xl" />
      </div>
    </PreviewShell>
  );
}

function LoadingPreview() {
  return (
    <PreviewShell title="Loading">
      <div className="flex items-center gap-[var(--space-gap)]">
        <div
          className="size-[var(--ctrl-h-sm)] rounded-full border-2 border-border border-t-primary animate-spin"
          style={{ transform: "scale(var(--loading-spinner-scale, 1))" }}
        />
        <div className="h-3 flex-1 animate-shimmer rounded bg-muted" />
      </div>
    </PreviewShell>
  );
}

function MobilePreview() {
  return (
    <PreviewShell title="Mobile">
      <div className="mx-auto w-[12rem] rounded-[1.25rem] border border-border bg-background p-2">
        <div
          className="flex items-center justify-center rounded-full bg-muted"
          style={{ height: "var(--pill-h)", paddingInline: "var(--pill-px)" }}
        >
          <span className="app-text-caption">Pill</span>
        </div>
      </div>
    </PreviewShell>
  );
}

function SpacingPreview() {
  return (
    <PreviewShell title="Spacing">
      <div className="flex flex-col gap-[var(--space-section)]">
        <div className="rounded-[var(--radius)] bg-muted p-[var(--space-page-x)] app-text-caption">
          page-x
        </div>
        <div className="rounded-[var(--radius)] bg-muted/70 p-[var(--space-card)] app-text-caption">
          card
        </div>
      </div>
    </PreviewShell>
  );
}

function TypographyPreview() {
  return (
    <PreviewShell title="Typography">
      <div className="space-y-2">
        <p className="app-text-heading">Heading</p>
        <p className="app-text-heading-sm">Heading sm</p>
        <p className="app-text-body">Body copy for marketplace density.</p>
        <p className="app-text-caption text-muted-foreground">Caption</p>
        <p className="app-text-label">Label</p>
      </div>
    </PreviewShell>
  );
}

function WeightsPreview() {
  return (
    <PreviewShell title="Weights">
      <div className="space-y-1">
        <p className="app-text-body app-weight-body">Body weight</p>
        <p className="app-text-label app-weight-label">Label weight</p>
        <p className="app-text-heading-sm app-weight-heading">Heading weight</p>
        <p className="app-text-action app-weight-action">Action weight</p>
      </div>
    </PreviewShell>
  );
}

const PAGE_WIDGET_PREVIEW_LOADERS: Partial<Record<AdminPageId, PreviewLoader>> = {
  listings: async () => ({ default: ListingsPreview }),
  "listing-detail": async () => ({ default: ListingsPreview }),
  "listings-create": async () => ({ default: ControlsPreview }),
  "my-listings": async () => ({ default: ControlsPreview }),
  blogs: async () => ({ default: TablePreview }),
  "blog-detail": async () => ({ default: DecorativePreview }),
  profile: async () => ({ default: WeightsPreview }),
  about: async () => ({ default: SpacingPreview }),
  contact: async () => ({ default: MobilePreview }),
  "sign-in": async () => ({ default: MobilePreview }),
  "sign-up": async () => ({ default: MobilePreview }),
  admin: async () => ({ default: SidebarPreview }),
  "settings-appearance": async () => ({ default: TypographyPreview }),
};

export const CATEGORY_WIDGET_PAGE_MAP: Record<AppearanceDensityTab, AdminPageId> = {
  typography: "listings",
  weights: "profile",
  icons: "my-listings",
  controls: "listings-create",
  spacing: "about",
  sidebar: "admin",
  table: "blogs",
  mobile: "contact",
  decorative: "blog-detail",
  "loading-motion": "listing-detail",
};

export const resolvePreviewLoader = (pageId: AdminPageId): PreviewLoader | null => {
  return PAGE_WIDGET_PREVIEW_LOADERS[pageId] ?? null;
};

export const resolvePreviewPageLabel = (pageId: AdminPageId): string => {
  return PAGE_LABELS[pageId] ?? pageId;
};
