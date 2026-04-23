"use client";

import { cn } from "@/lib/cn";

type Props = {
  rows?: number;
  className?: string;
};

/**
 * Lightweight skeleton for component-level Suspense boundaries.
 * Use this as the fallback when lazy-loading individual components.
 */
export function ComponentLoading({ rows = 3, className }: Props) {
  return (
    <div
      className={cn("space-y-3 animate-pulse p-4", className)}
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-md bg-[hsl(var(--muted))]"
          style={{ width: `${70 + ((i * 17) % 30)}%` }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default ComponentLoading;
