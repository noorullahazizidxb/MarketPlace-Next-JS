"use client";

import {
  LayoutGrid,
  AlignHorizontalJustifyStart,
  BookOpen,
  List,
} from "lucide-react";
import type { ReactNode } from "react";
import { useComponentVariants } from "@/hooks/use-component-variants";
import { ComponentVariantPreview } from "@/components/ui/molecules/component-variant-preview";
import type {
  ListingCardVariant,
  NavbarVariant,
  FooterVariant,
  BlogCardVariant,
  SidebarVariantStyle,
  StoriesBarVariant,
  SkeletonTheme,
  CaptchaVariant,
  RadiusVariant,
} from "@/lib/theme/types";
import { cn } from "@/lib/cn";

type VariantOption<T extends string> = {
  value: T;
  label: string;
  description: string;
};

function VariantPicker<T extends string>({
  label,
  options,
  value,
  onChange,
  renderPreview,
}: {
  label: string;
  options: VariantOption<T>[];
  value: T;
  onChange: (v: T) => void;
  renderPreview: (variant: T) => ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="app-text-label font-medium">{label}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {options.map((opt) => (
          <article
            key={opt.value}
            className={cn(
              "overflow-hidden rounded-xl border transition-all duration-150",
              value === opt.value
                ? "border-primary bg-primary/8 ring-1 ring-primary/40"
                : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60",
            )}
          >
            <button
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={value === opt.value}
              className="w-full p-3 text-left"
            >
              <p className="app-text-label font-semibold truncate">{opt.label}</p>
              <p className="app-text-caption text-muted-foreground line-clamp-2">
                {opt.description}
              </p>
            </button>
            <div
              aria-hidden="true"
              inert
              className="h-28 overflow-hidden border-t border-border/60 bg-background/50"
            >
              {renderPreview(opt.value)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const listingCardOptions: VariantOption<ListingCardVariant>[] = [
  {
    value: "grid",
    label: "Grid Card",
    description: "Image slider with action buttons",
  },
  {
    value: "horizontal",
    label: "Horizontal",
    description: "Compact thumbnail + info row",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Full-width hero image overlay",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Text list with price badge",
  },
];

const navbarOptions: VariantOption<NavbarVariant>[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Flat bar, text links + underline (OurWorks)",
  },
  {
    value: "glass",
    label: "Glass Pill",
    description: "Links in a glass pill tray (DevMinds portfolio)",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Squircle tray, filled active link (Portfolio v2)",
  },
  {
    value: "fullwidth",
    label: "Full Width",
    description: "Wide with category strip",
  },
];

const footerOptions: VariantOption<FooterVariant>[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Full links + newsletter",
  },
  { value: "compact", label: "Compact", description: "Single row with links" },
  {
    value: "editorial",
    label: "Editorial",
    description: "Large brand + minimal links",
  },
  { value: "minimal", label: "Minimal", description: "Copyright line only" },
];

const sidebarOptions: VariantOption<SidebarVariantStyle>[] = [
  { value: "default", label: "Default", description: "Standard sidebar style" },
  { value: "glass", label: "Glass", description: "Transparent frosted glass" },
  { value: "minimal", label: "Minimal", description: "Icon-only compact mode" },
  { value: "brand", label: "Brand", description: "Gradient brand atmosphere" },
];

const blogCardOptions: VariantOption<BlogCardVariant>[] = [
  { value: "card", label: "Card", description: "Vertical image card" },
  {
    value: "horizontal",
    label: "Horizontal",
    description: "Thumb + excerpt row",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Magazine hero style",
  },
  { value: "compact", label: "Compact", description: "Dense text list" },
];

const storiesOptions: VariantOption<StoriesBarVariant>[] = [
  {
    value: "bubble",
    label: "Bubble",
    description: "Circular gradient avatar rings",
  },
  { value: "cards", label: "Cards", description: "Vertical preview cards" },
  {
    value: "strip",
    label: "Strip",
    description: "Cinematic horizontal strips",
  },
];

const skeletonOptions: VariantOption<SkeletonTheme>[] = [
  {
    value: "shimmer",
    label: "Shimmer",
    description: "Classic sweep animation",
  },
  { value: "pulse", label: "Pulse", description: "Soft opacity breathing" },
  { value: "wave", label: "Wave", description: "Tinted gradient wave" },
];

const captchaOptions: VariantOption<CaptchaVariant>[] = [
  { value: "classic", label: "Classic", description: "Type the answer" },
  { value: "tiles", label: "Tiles", description: "Tap the correct tile" },
  { value: "slider", label: "Slider", description: "Drag to the answer" },
];

const radiusOptions: VariantOption<RadiusVariant>[] = [
  { value: "default", label: "Default", description: "Each component's own radius" },
  { value: "none", label: "Square", description: "0px — sharp corners" },
  { value: "sm", label: "Small", description: "6px" },
  { value: "md", label: "Medium", description: "12px" },
  { value: "lg", label: "Large", description: "20px" },
  { value: "xl", label: "Extra large", description: "32px" },
];

const radiusPx: Record<RadiusVariant, string> = {
  default: "1rem",
  none: "0px",
  sm: "0.375rem",
  md: "0.75rem",
  lg: "1.25rem",
  xl: "2rem",
};

function RadiusPreview({ kind, variant }: { kind: "card" | "table"; variant: RadiusVariant }) {
  const radius = radiusPx[variant];
  if (kind === "card") {
    return (
      <div className="grid h-full place-items-center p-3">
        <div
          className="flex h-20 w-36 flex-col justify-end gap-1 border border-border bg-card p-2 shadow-sm"
          style={{ borderRadius: radius }}
        >
          <span className="h-2 w-20 rounded-full bg-primary/50" />
          <span className="h-2 w-14 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    );
  }
  return (
    <div className="grid h-full place-items-center p-3">
      <div className="w-40 overflow-hidden border border-border bg-card" style={{ borderRadius: radius }}>
        {[0, 1, 2].map((row) => (
          <div key={row} className={cn("flex gap-2 px-2 py-1.5", row === 0 ? "bg-primary/15" : "border-t border-border/60")}>
            <span className="h-1.5 w-10 rounded-full bg-foreground/30" />
            <span className="h-1.5 w-14 rounded-full bg-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Molecule: Component variant picker panel.
 * Used in the Appearance settings to switch the visual style of major UI components.
 */
export function ComponentVariantsPanel() {
  const { variants, error, updateVariant, resetVariants } = useComponentVariants();

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/10">
            <LayoutGrid className="app-icon-sm text-primary" />
          </span>
          <div>
            <h3 className="app-text-heading-sm font-semibold">
              Component Variants
            </h3>
            <p className="app-text-caption text-muted-foreground">
              Choose a visual style for each major UI section
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetVariants}
          className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 app-text-caption font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6 p-4 md:p-6">
        {error && (
          <p role="alert" className="app-text-caption text-destructive">
            {error}
          </p>
        )}
        <VariantPicker
          label="Listing Card Style"
          options={listingCardOptions}
          value={variants.listingCard}
          onChange={(v) => updateVariant("listingCard", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="listingCard" variant={variant} />
          )}
        />

        <VariantPicker
          label="Navbar Style"
          options={navbarOptions}
          value={variants.navbar}
          onChange={(v) => updateVariant("navbar", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="navbar" variant={variant} />
          )}
        />

        <VariantPicker
          label="Footer Style"
          options={footerOptions}
          value={variants.footer}
          onChange={(v) => updateVariant("footer", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="footer" variant={variant} />
          )}
        />

        <VariantPicker
          label="Sidebar Style"
          options={sidebarOptions}
          value={variants.sidebar}
          onChange={(v) => updateVariant("sidebar", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="sidebar" variant={variant} />
          )}
        />

        <VariantPicker
          label="Blog Card Style"
          options={blogCardOptions}
          value={variants.blogCard}
          onChange={(v) => updateVariant("blogCard", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="blogCard" variant={variant} />
          )}
        />

        <VariantPicker
          label="Stories Bar Style"
          options={storiesOptions}
          value={variants.storiesBar ?? "bubble"}
          onChange={(v) => updateVariant("storiesBar", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="storiesBar" variant={variant} />
          )}
        />

        <VariantPicker
          label="Skeleton Animation"
          options={skeletonOptions}
          value={variants.skeletonTheme ?? "shimmer"}
          onChange={(v) => updateVariant("skeletonTheme", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="skeletonTheme" variant={variant} />
          )}
        />

        <VariantPicker
          label="CAPTCHA Style"
          options={captchaOptions}
          value={variants.captchaVariant ?? "classic"}
          onChange={(v) => updateVariant("captchaVariant", v)}
          renderPreview={(variant) => (
            <ComponentVariantPreview kind="captchaVariant" variant={variant} />
          )}
        />

        <VariantPicker
          label="Card Border Radius"
          options={radiusOptions}
          value={variants.cardRadius ?? "default"}
          onChange={(v) => updateVariant("cardRadius", v)}
          renderPreview={(variant) => <RadiusPreview kind="card" variant={variant} />}
        />

        <VariantPicker
          label="Table Border Radius"
          options={radiusOptions}
          value={variants.tableRadius ?? "default"}
          onChange={(v) => updateVariant("tableRadius", v)}
          renderPreview={(variant) => <RadiusPreview kind="table" variant={variant} />}
        />
      </div>
    </div>
  );
}
