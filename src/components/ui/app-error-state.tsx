"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function AppErrorState({
  title = "We could not load this experience",
  description = "The page encountered an unexpected problem. Your data is safe—try again or return to Marketplace.",
  onRetry,
}: AppErrorStateProps) {
  return (
    <main className="app-state-shell" data-app-page="error-state">
      <section
        className="app-state-card app-premium-surface"
        role="alert"
        aria-labelledby="app-error-title"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive">
          <AlertTriangle className="app-icon-lg" aria-hidden />
        </span>
        <p className="mt-[var(--space-gap)] app-text-label uppercase app-tracking-caps text-destructive">
          Something went wrong
        </p>
        <h1 id="app-error-title" className="mt-2 app-text-h1">
          {title}
        </h1>
        <p className="mx-auto mt-[var(--space-gap)] max-w-xl app-text-body text-muted-foreground">
          {description}
        </p>
        <div className="mt-[var(--space-section)] flex flex-col justify-center gap-[var(--space-gap)] sm:flex-row">
          {onRetry ? (
            <Button type="button" onClick={onRetry}>
              <RotateCcw className="app-icon-xs" aria-hidden />
              Try again
            </Button>
          ) : null}
          <Button asChild variant={onRetry ? "outline" : "default"}>
            <Link href="/listings">
              <Home className="app-icon-xs" aria-hidden />
              Return to Marketplace
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
