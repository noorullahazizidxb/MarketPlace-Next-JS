"use client";

/**
 * Three visual skeleton animation themes.
 * Each exports a Skeleton primitive compatible with the existing API.
 * Import from here when a variant-aware skeleton is needed.
 */

import { cn } from "@/lib/cn";

// ── V1: Shimmer (existing, re-exported for consistency) ───────────────────────
export { Skeleton, Block } from "./SkeletonPrimitives";

// ── V2: Pulse ─────────────────────────────────────────────────────────────────
// Simple opacity pulse — less visually noisy, good for low-motion preferences.

export function SkeletonPulse({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("rounded-xl bg-foreground/6 animate-breathe", className)}
      style={style}
    />
  );
}

export function BlockPulse({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse
          key={i}
          className={cn(
            "h-3 w-full",
            i === 0 && "h-4 w-2/3",
            i === lines - 1 && "w-1/3",
          )}
        />
      ))}
    </div>
  );
}

// ── V3: Wave ──────────────────────────────────────────────────────────────────
// Gradient wave that sweeps the full element — richer visual than shimmer.

export function SkeletonWave({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("rounded-xl overflow-hidden animate-shimmer", className)}
      style={{
        background:
          "linear-gradient(90deg, var(--muted) 0%, color-mix(in oklch, var(--primary) 12%, var(--muted)) 40%, var(--muted) 80%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
    />
  );
}

export function BlockWave({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonWave
          key={i}
          className={cn(
            "h-3 w-full",
            i === 0 && "h-4 w-2/3",
            i === lines - 1 && "w-1/3",
          )}
        />
      ))}
    </div>
  );
}
