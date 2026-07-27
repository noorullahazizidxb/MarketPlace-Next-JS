import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

/**
 * Skeleton — loading placeholder.
 *
 * Uses the `.animate-shimmer` keyframe defined in globals.css which produces
 * a sweeping highlight moving left→right — far more premium than a simple
 * opacity pulse and immediately recognisable as a loading state.
 *
 * Falls back gracefully to `animate-pulse` on browsers that don't support the
 * background-position animation (essentially none in 2024, but safe).
 */
function Skeleton({ className, style, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-lg",
        // Shimmer sweep — defined in globals.css @keyframes shimmer
        "animate-shimmer",
        // Tokenized base color for stronger theme responsiveness
        "bg-[var(--skeleton)]",
        className
      )}
      style={{
        // Inline the shimmer gradient so it works even without globals.css loaded
        background: [
          "linear-gradient(",
          "  90deg,",
          "  var(--skeleton) 25%,",
          "  var(--skeleton-shimmer) 50%,",
          "  var(--skeleton) 75%",
          ")",
        ].join(""),
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };