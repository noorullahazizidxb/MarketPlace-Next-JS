"use client";

import { cn } from "@/lib/cn";

type AmbientCanvasProps = {
  className?: string;
  /** Visual intensity 0–1 (default 0.35) */
  intensity?: number;
  variant?: "orbs" | "ribbons" | "grid";
};

/**
 * Low-opacity decorative canvas for auth / landing / appearance surfaces.
 * pointer-events-none; respects prefers-reduced-motion via CSS.
 */
export function AmbientCanvas({
  className,
  intensity = 0.35,
  variant = "orbs",
}: AmbientCanvasProps) {
  const opacity = Math.min(1, Math.max(0, intensity));

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{ opacity }}
    >
      {variant === "grid" && <div className="bg-grid-overlay absolute inset-0" />}
      {(variant === "orbs" || variant === "ribbons") && (
        <>
          <div className="bg-aurora-one absolute -left-[10%] top-[8%] size-[min(22rem,50vw)] rounded-full blur-3xl animate-drift-a" />
          <div className="bg-aurora-two absolute -right-[8%] bottom-[6%] size-[min(18rem,45vw)] rounded-full blur-3xl animate-drift-b" />
        </>
      )}
      {variant === "ribbons" && (
        <div className="bg-conic-primary-secondary absolute inset-[-20%] opacity-50 animate-spin-slow" />
      )}
    </div>
  );
}

export function OrbField({
  className,
  intensity = 0.3,
}: Omit<AmbientCanvasProps, "variant">) {
  return (
    <AmbientCanvas className={className} intensity={intensity} variant="orbs" />
  );
}

export function RibbonGrid({
  className,
  intensity = 0.28,
}: Omit<AmbientCanvasProps, "variant">) {
  return (
    <AmbientCanvas
      className={className}
      intensity={intensity}
      variant="ribbons"
    />
  );
}
