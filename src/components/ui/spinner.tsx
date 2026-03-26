"use client";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "default" | "primary" | "accent" | "muted";

const iconSizeMap: Record<SpinnerSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
  xl: "size-10",
};

const variantColorMap: Record<SpinnerVariant, string> = {
  default: "text-[hsl(var(--foreground))]/70",
  primary: "text-[hsl(var(--primary))]",
  accent: "text-[hsl(var(--accent))]",
  muted: "text-[hsl(var(--muted-foreground))]",
};

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

/**
 * Shared spinner using Lucide's LoaderIcon with animate-spin.
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
      className={cn("inline-flex flex-col items-center gap-1.5", className)}
    >
      <LoaderIcon
        className={cn("animate-spin", iconSizeMap[size], variantColorMap[variant])}
      />
      {label && (
        <span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span>
      )}
    </span>
  );
}

/**
 * Full-page / full-section centered spinner.
 */
export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      <Spinner size="lg" variant="accent" label={label} />
    </div>
  );
}

/**
 * Inline image placeholder shown while a next/Image is loading.
 * Renders as an absolutely-positioned overlay on the parent (position relative).
 */
export function ImageSpinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-[hsl(var(--muted))]/40 backdrop-blur-[2px] z-10 transition-opacity",
        className
      )}
    >
      <LoaderIcon className="animate-spin size-6 text-[hsl(var(--muted-foreground))]" />
    </span>
  );
}

