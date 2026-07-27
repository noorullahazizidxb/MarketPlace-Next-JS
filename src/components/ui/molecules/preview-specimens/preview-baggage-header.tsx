"use client";

import { TbLuggage } from "react-icons/tb";

/** Simplified specimen from apps/admin/widgets/baggage/ui/baggage-header-card.tsx */
export function PreviewBaggageHeader() {
  return (
    <div className="relative min-w-0 max-w-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 admin-density-hero-pad shadow-xl backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 admin-hero-accent brand-gradient" />
      <div className="pointer-events-none absolute -top-16 right-8 admin-hero-orb-lg rounded-full brand-gradient opacity-15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-4 admin-hero-orb-sm rounded-full brand-gradient opacity-10 blur-2xl" />

      <div className="relative flex min-w-0 flex-col admin-density-header-row-gap">
        <div className="flex min-w-0 items-center admin-density-header-row-gap">
          <div className="shrink-0 rounded-xl border border-primary/30 brand-gradient hover-gradient brand-glow admin-density-hero-icon shadow-lg">
            <TbLuggage className="admin-icon-md text-brand-foreground" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate admin-typo-page-title admin-text-heading tracking-tight text-foreground">
              Baggage Rules
            </h1>
            <p className="admin-typo-page-subtitle mt-0.5 line-clamp-2 text-muted-foreground">
              Manage airline baggage allowances and fees
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-4 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          ["Total rules", "128"],
          ["Piece-based", "74"],
          ["Weight-based", "54"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-xl border border-border/50 bg-background/70 p-3"
            style={{ padding: "var(--space-card)" }}
          >
            <p className="admin-text-caption uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="admin-text-stat tabular-nums text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
