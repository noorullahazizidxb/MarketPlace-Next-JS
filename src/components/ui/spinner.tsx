"use client";
import { cn } from "@/lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "default" | "primary" | "accent" | "muted";

const sizeMap: Record<SpinnerSize, string> = {
  xs: "size-3 border",
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
  xl: "size-12 border-4",
};

const variantMap: Record<SpinnerVariant, string> = {
  default:
    "border-[hsl(var(--foreground))]/20 border-t-[hsl(var(--foreground))]/80",
  primary:
    "border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))]",
  accent:
    "border-[hsl(var(--accent))]/20 border-t-[hsl(var(--accent))]",
  muted:
    "border-[hsl(var(--muted-foreground))]/20 border-t-[hsl(var(--muted-foreground))]",
};

export interface SpinnerProps {
  /** Visual size of the spinner */
  size?: SpinnerSize;
  /** Color variant */
  variant?: SpinnerVariant;
  /** Accessible label shown below the spinner */
  label?: string;
  className?: string;
}

/**
 * Shared spinner / loading indicator.
 *
 * Usage:
 *   <Spinner />
 *   <Spinner size="lg" variant="accent" label="Loading posts…" />
 *   <Spinner size="sm" variant="primary" />
 */
export function Spinner({
  size = "md",
  variant = "default",
  label,
  className,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("inline-flex flex-col items-center gap-2", className)}
    >
      <span
        className={cn(
          "rounded-full animate-spin",
          sizeMap[size],
          variantMap[variant],
        )}
      />
      {label && (
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          {label}
        </span>
      )}
    </span>
  );
}

/**
 * Full-page / full-section centered spinner.
 *
 * Usage:
 *   <PageSpinner />
 *   <PageSpinner label="Fetching listings…" />
 */
export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      <Spinner size="lg" variant="accent" label={label} />
    </div>
  );
}
