"use client";

import { TbLuggage } from "react-icons/tb";

/** Simplified specimen from apps/admin/widgets/baggage/ui/baggage-header-card.tsx */
export function PreviewBaggageHeader() {
  return (
    <div className="relative min-w-0 max-w-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 app-density-hero-pad shadow-xl backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 app-hero-accent brand-gradient" />
      <div className="pointer-events-none absolute -top-16 right-8 app-hero-orb-lg rounded-full brand-gradient opacity-15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-4 app-hero-orb-sm rounded-full brand-gradient opacity-10 blur-2xl" />

      <div className="relative flex min-w-0 flex-col app-density-header-row-gap">
        <div className="flex min-w-0 items-center app-density-header-row-gap">
          <div className="shrink-0 rounded-xl border border-primary/30 brand-gradient hover-gradient brand-glow app-density-hero-icon shadow-lg">
            <TbLuggage className="app-icon-md text-brand-foreground" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate app-typo-page-title app-text-heading tracking-tight text-foreground">
              Baggage Rules
            </h1>
            <p className="app-typo-page-subtitle mt-0.5 line-clamp-2 text-muted-foreground">
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
            <p className="app-text-caption uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="app-text-stat tabular-nums text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
