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
  default: "text-[var(--foreground)]/70",
  primary: "text-[var(--primary)]",
  accent: "text-[var(--accent)]",
  muted: "text-[var(--muted-foreground)]",
};

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

export function Spinner({ size = "md", variant = "default", label, className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label ?? "Loading"} className={cn("inline-flex flex-col items-center gap-1.5", className)}>
      <LoaderIcon className={cn("animate-spin", iconSizeMap[size], variantColorMap[variant])} />
      {label && <span className="app-text-caption text-muted-foreground">{label}</span>}
    </span>
  );
}

export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-50 w-full items-center justify-center">
      <Spinner size="lg" variant="accent" label={label} />
    </div>
  );
}

export function ImageSpinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("absolute inset-0 flex items-center justify-center bg-(--muted)/40 backdrop-blur-[2px] z-10 transition-opacity", className)}
    >
      <LoaderIcon className="animate-spin size-6 text-muted-foreground" />
    </span>
  );
}
