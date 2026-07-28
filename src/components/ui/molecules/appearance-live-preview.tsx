"use client";

import { CalendarIcon, Search, X } from "lucide-react";
import { TbLuggage } from "react-icons/tb";
import { cn } from "../lib/cn";
import { LoadingSpinner } from "../atoms/shadcn/loading-spinner";
import {
  PreviewBaggageHeader,
  PreviewCurrencyTable,
  PreviewSidebarNav,
  PreviewUserControls,
} from "./preview-specimens";

export type AppearancePreviewVariant =
  | "typography"
  | "layout"
  | "spacing"
  | "fontPreview"
  | "base-tokens"
  | "icons"
  | "controls"
  | "table"
  | "sidebar"
  | "mobile"
  | "cards"
  | "weights"
  | "decorative"
  | "loading";

const previewShell = (className?: string) =>
  cn(
    "min-w-0 w-full max-w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-inner",
    className,
  );

function PreviewSpecimen({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border/50 bg-background/70 p-2">
      <div className="mb-1.5">
        <p className="app-text-label text-foreground">{title}</p>
        {note ? (
          <p className="app-text-caption text-muted-foreground">{note}</p>
        ) : null}
      </div>
      <div className="min-w-0 max-w-full">{children}</div>
    </section>
  );
}

export function AppearanceLivePreview({
  variant,
  className,
}: {
  variant: AppearancePreviewVariant;
  className?: string;
}) {
  if (variant === "icons") {
    return (
      <div className={cn(previewShell("p-2 space-y-2"), className)}>
        <p className="app-text-caption text-muted-foreground">
          Icon sizes use <code className="app-text-micro">app-icon-*</code> classes backed by{" "}
          <code className="app-text-micro">--icon-xs</code> through{" "}
          <code className="app-text-micro">--icon-lg</code>.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["XS", "app-icon-xs"],
              ["SM", "app-icon-sm"],
              ["MD", "app-icon-md"],
              ["LG", "app-icon-lg"],
            ] as const
          ).map(([label, iconClass]) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-3">
              {label === "LG" ? (
                <TbLuggage className={cn(iconClass, "text-primary")} aria-hidden />
              ) : (
                <Search className={cn(iconClass, "text-primary")} aria-hidden />
              )}
              <span className="app-text-micro text-muted-foreground">Icon {label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <CalendarIcon className="app-icon-sm text-muted-foreground" aria-hidden />
          <span className="app-text-body text-foreground">Inline field icon (SM)</span>
          <X className="app-icon-xs ms-auto text-muted-foreground" aria-hidden />
        </div>
      </div>
    );
  }

  if (variant === "controls") {
    return (
      <div className={cn(previewShell("space-y-2 p-2"), className)}>
        <p className="app-text-caption text-muted-foreground">
          Controls specimen from manage-users forms — field, policy card, and action buttons.
        </p>
        <PreviewUserControls />
        <div className="grid min-w-0 gap-2">
          <PreviewSpecimen
            title="Action buttons"
            note="`--ctrl-h`, `--ctrl-h-sm`, `--ctrl-px`, `--text-action`"
          >
            <div className="flex flex-wrap items-end gap-2">
              <button
                type="button"
                data-slot="button"
                className="rounded-lg border border-border/60 bg-primary text-primary-foreground shadow-sm app-text-action"
                style={{
                  minHeight: "var(--ctrl-h)",
                  paddingInline: "var(--ctrl-px)",
                }}
              >
                Save changes
              </button>
              <button
                type="button"
                data-slot="button"
                className="rounded-lg border border-border/60 bg-muted shadow-sm app-text-action"
                style={{
                  minHeight: "var(--ctrl-h-sm)",
                  paddingInline: "var(--ctrl-px)",
                }}
              >
                Reset
              </button>
            </div>
          </PreviewSpecimen>

          <PreviewSpecimen
            title="State pills / badges"
            note="`--badge-px`, `--badge-py`, `--text-badge`, `--badge-h`"
          >
            <div className="flex flex-wrap items-center gap-2">
              {["Active", "Pending", "Disabled"].map((state, index) => (
                <span
                  key={state}
                  data-slot="badge"
                  className={cn(
                    "inline-flex items-center rounded-full border app-text-badge",
                    index === 0
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border/50 bg-muted/35 text-muted-foreground",
                  )}
                  style={{
                    minHeight: "var(--badge-h)",
                    paddingInline: "var(--badge-px)",
                    paddingBlock: "var(--badge-py)",
                  }}
                >
                  {state}
                </span>
              ))}
            </div>
          </PreviewSpecimen>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn(previewShell("p-2 space-y-2"), className)}>
        <p className="app-text-caption text-muted-foreground">
          Production currency rates table with <code className="app-text-micro">ui-table-pair-col</code> pair column.
        </p>
        <PreviewCurrencyTable showPairColumn />
        <PreviewSpecimen title="Baggage rules row" note="Dense table cell tokens from baggage module">
          <div className="overflow-hidden rounded-lg border border-border/50">
            <table className="w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-border/40 bg-muted/40 text-muted-foreground uppercase tracking-wide">
                  <th data-slot="table-head" className="text-start app-text-label">Airline</th>
                  <th data-slot="table-head" className="text-start app-text-label">Allowance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border/40">
                  <td data-slot="table-cell" className="app-text-body">EK · Dubai</td>
                  <td data-slot="table-cell" className="font-mono app-text-mono">2 × 23kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </PreviewSpecimen>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={cn(previewShell("p-2"), className)}>
        <p className="mb-3 app-text-caption text-muted-foreground">
          Sidebar tokens from production shell — group label, nav item, badge, and sub-item sizes.
        </p>
        <PreviewSidebarNav />
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={cn(previewShell("p-2"), className)}>
        <p className="mb-3 app-text-caption text-muted-foreground">
          Mobile pills use <code className="app-text-micro">ui-mobile-pill-height</code> and{" "}
          <code className="app-text-micro">ui-mobile-pill-pad-x</code>.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Flights", "Hotels", "Wallet"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded-full border border-border/50 bg-muted/40 app-text-label text-muted-foreground ui-mobile-pill-height ui-mobile-pill-pad-x"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div
        className={cn(previewShell("space-y-2"), className)}
        style={{ padding: "var(--space-page-x)" }}
      >
        <PreviewBaggageHeader />
      </div>
    );
  }

  if (variant === "typography") {
    return (
      <div className={cn(previewShell("p-2 space-y-2"), className)}>
        <PreviewBaggageHeader />
      </div>
    );
  }

  if (variant === "layout") {
    return (
      <div
        className={cn(previewShell(), className)}
        style={{
          paddingInline: "var(--space-page-x)",
          paddingBlock: "var(--space-page-y)"
        }}
      >
        <div
          className="flex flex-col rounded-lg border border-dashed border-primary/25 bg-muted/20"
          style={{ gap: "var(--space-section)", padding: "var(--space-filter)" }}
        >
          <div className="h-3 w-1/3 rounded bg-primary/30" />
          <div
            className="rounded-lg border border-border/50 bg-background/80 shadow-sm"
            style={{ padding: "var(--space-card)" }}
          >
            <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
            <div className="mt-2 h-2 w-1/2 rounded bg-muted-foreground/15" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "spacing") {
    return (
      <div
        className={cn(previewShell("space-y-2"), className)}
        style={{
          paddingInline: "var(--space-page-x)",
          paddingBlock: "var(--space-page-y)",
        }}
      >
        <div
          className="flex flex-col rounded-lg border border-dashed border-primary/25 bg-muted/20"
          style={{ gap: "var(--space-section)", padding: "var(--space-filter)" }}
        >
          <div className="h-3 w-1/3 rounded bg-primary/30" />
          <div
            className="rounded-lg border border-border/50 bg-background/80 shadow-sm"
            style={{ padding: "var(--space-card)", display: "flex", flexDirection: "column", gap: "var(--card-gap)" }}
          >
            <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
            <div className="h-2 w-1/2 rounded bg-muted-foreground/15" />
          </div>
        </div>
        <div className="flex flex-wrap items-end" style={{ gap: "var(--space-gap)" }}>
          <button
            type="button"
            data-slot="button"
            className="rounded-lg border border-border/60 bg-primary px-3 text-primary-foreground shadow-sm"
            style={{ minHeight: "var(--ctrl-h)", paddingInline: "var(--ctrl-px)" }}
          >
            Primary
          </button>
          <span
            data-slot="badge"
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 text-primary"
            style={{ paddingInline: "var(--badge-px)", paddingBlock: "var(--badge-py)" }}
          >
            Badge spacing
          </span>
        </div>
      </div>
    );
  }

  if (variant === "base-tokens") {
    return (
      <div className={cn(previewShell("space-y-2 p-2"), className)}>
        <PreviewBaggageHeader />
        <div className="grid min-w-0 gap-2">
          <PreviewSpecimen
            title="Typography specimens"
            note="Directly mapped to `app-text-*` utility classes."
          >
            <div className="space-y-1.5">
              <p className="app-text-micro text-muted-foreground">Micro helper text</p>
              <p className="app-text-caption text-muted-foreground">Caption / metadata</p>
              <p className="app-text-label text-muted-foreground">Field Label</p>
              <p className="app-text-body text-foreground">Body copy used in cards and forms.</p>
              <p className="app-text-action text-foreground">Action label</p>
              <p className="app-text-mono text-foreground">PNR: AB12CD</p>
            </div>
          </PreviewSpecimen>
          <PreviewUserControls />
        </div>
        <PreviewSpecimen title="Currency table tokens" note="From currency-convert production table">
          <PreviewCurrencyTable />
        </PreviewSpecimen>
      </div>
    );
  }

  if (variant === "weights") {
    return (
      <div className={cn(previewShell("p-2 space-y-2"), className)}>
        <div className="space-y-2">
          <span className="block text-muted-foreground" style={{ fontWeight: "var(--weight-label)" }}>
            Label weight — form labels &amp; filter captions
          </span>
          <span className="block text-foreground" style={{ fontWeight: "var(--weight-body)" }}>
            Body weight — paragraph and table cell text
          </span>
          <span className="block text-foreground" style={{ fontWeight: "var(--weight-action)" }}>
            Action weight — button label text
          </span>
          <span className="block text-foreground" style={{ fontWeight: "var(--weight-heading)" }}>
            Heading weight — section &amp; card headings
          </span>
          <span
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 text-primary"
            style={{ fontWeight: "var(--weight-badge)", paddingInline: "var(--badge-px)", paddingBlock: "var(--badge-py)" }}
          >
            Badge weight
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border/40">
          <table className="w-full text-start">
            <thead>
              <tr
                className="border-b border-border/40 bg-muted/40 text-muted-foreground uppercase tracking-wide"
                style={{ fontWeight: "var(--weight-table-head)", fontSize: "var(--table-head-text)" }}
              >
                <th data-slot="table-head" className="text-start">
                  Column
                </th>
                <th data-slot="table-head" className="text-start">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-slot="table-cell">Cell text</td>
                <td data-slot="table-cell" className="text-muted-foreground">
                  weight token
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (variant === "loading") {
    return (
      <div className={cn(previewShell("flex flex-col items-center justify-center gap-6 p-8"), className)}>
        <LoadingSpinner size="md" label="Loading preview" />
        <LoadingSpinner size="lg" label="Large spinner" />
        <p className="app-text-caption text-muted-foreground">
          Scale multiplier: <code className="app-text-micro">var(--loading-spinner-scale)</code>
        </p>
      </div>
    );
  }

  if (variant === "decorative") {
    return (
      <div className={cn(previewShell("p-2 space-y-2"), className)}>
        <PreviewSpecimen
          title="Baggage page hero"
          note="From baggage-header-card — orbs, accent bar, and hero icon pad tokens."
        >
          <PreviewBaggageHeader />
        </PreviewSpecimen>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-w-0 max-w-full overflow-hidden space-y-2 rounded-xl border border-border/60 bg-card p-4 font-[family-name:var(--app-font-family)] shadow-inner",
        className,
      )}
    >
      <p className="app-text-body" dir="ltr">
        Latin quick brown fox — 0123456789
      </p>
      <p className="app-text-body" dir="rtl">
        نمونه متن فارسی / العربية ١٢٣
      </p>
    </div>
  );
}
