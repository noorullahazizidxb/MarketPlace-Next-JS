"use client";

import { cn } from "../../lib/cn";

interface LoadingSpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  inline?: boolean;
  label?: string;
  center?: boolean;
  /** Override the spinner track colour (defaults to primary) */
  color?: string;
}

/** Pixel size per named size */
const SIZE_PX = { xs: 14, sm: 20, md: 28, lg: 40 } as const;

/**
 * LoadingSpinner — SVG-based, accessible, premium.
 *
 * Design:
 *  - SVG circle with a dasharray-based spinning arc — no border hacks
 *  - Outer ping halo for extra visual presence (md / lg only)
 *  - Centre filled dot anchors the eye
 *  - Uses --primary / --muted tokens from globals.css
 *  - Label fades in with `animate-breathe` from globals.css
 */
export function LoadingSpinner({
  className,
  size = "md",
  inline = false,
  label,
  center = false,
  color,
}: LoadingSpinnerProps) {
  const px = SIZE_PX[size];
  const stroke = size === "xs" || size === "sm" ? 1.8 : 2.4;
  const r = (px - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const showPing = size === "md" || size === "lg";

  return (
    <div
      className={cn(
        inline ? "inline-flex" : "flex",
        center && "min-h-[400px] w-full items-center justify-center",
        !center && "items-center",
        label ? "gap-2.5" : "",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
      style={{ transform: "scale(var(--loading-spinner-scale, 1))",
        transformOrigin: "center center" }}
    >
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{ width: px, height: px }}
      >
        {/* Outer ping halo — subtle, only on larger sizes */}
        {showPing && (
          <span
            className="absolute inset-0 rounded-full opacity-20 animate-ping"
            style={{ background: color ?? "var(--primary)" }}
          />
        )}

        {/* SVG arc spinner */}
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          fill="none"
          className="animate-spin"
          style={{ animationDuration: "0.8s", animationTimingFunction: "linear" }}
          aria-hidden="true"
        >
          {/* Track circle */}
          <circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            stroke={color ?? "var(--primary)"}
            strokeWidth={stroke}
            strokeOpacity={0.18}
          />
          {/* Spinning arc — 75% of circumference */}
          <circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            stroke={color ?? "var(--primary)"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
            strokeDashoffset={0}
          />
        </svg>

        {/* Centre dot */}
        <span
          className="absolute rounded-full"
          style={{ width: Math.max(3, px * 0.18),
            height: Math.max(3, px * 0.18),
            background: color ?? "var(--primary)" }}
        />
      </span>

      {label && (
        <span
          className="animate-breathe app-text-body text-muted-foreground"
        >
          {label}
        </span>
      )}
    </div>
  );
}