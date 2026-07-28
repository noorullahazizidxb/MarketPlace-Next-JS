"use client";

/**
 * Branded FOUC gate fallback — uses SSR-injected theme tokens (never unstyled default).
 */
export function ThemeBootFallback() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground"
      role="status"
      aria-live="polite"
      aria-label="Loading theme"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <div className="bg-aurora-one absolute -left-24 top-10 size-[18rem] rounded-full blur-3xl animate-drift-a" />
        <div className="bg-aurora-two absolute -right-16 bottom-8 size-[16rem] rounded-full blur-3xl animate-drift-b" />
      </div>
      <div className="relative flex flex-col items-center gap-[var(--space-gap)] app-shell-page">
        <div
          className="size-[var(--ctrl-h)] rounded-full border-2 border-border border-t-primary animate-spin"
          style={{ animationDuration: "0.9s" }}
          aria-hidden
        />
        <p className="app-text-body text-muted-foreground">Preparing workspace…</p>
      </div>
    </div>
  );
}
