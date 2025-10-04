"use client";
import React from "react";

type Props = { size?: number; label?: string };

export function Loading({ size = 56, label }: Props) {
  // Keep this component provider-agnostic to avoid first-load chunk errors
  const finalLabel = label ?? "Loading";
  const box =
    size <= 40
      ? "w-10 h-10"
      : size <= 56
      ? "w-14 h-14"
      : size <= 72
      ? "w-[72px] h-[72px]"
      : "w-24 h-24";
  const innerCoreInset =
    size <= 40
      ? "inset-[6px]"
      : size <= 56
      ? "inset-[8px]"
      : size <= 72
      ? "inset-[10px]"
      : "inset-[12px]";
  const donutInset =
    size <= 40
      ? "inset-[5px]"
      : size <= 56
      ? "inset-[6px]"
      : size <= 72
      ? "inset-[8px]"
      : "inset-[10px]";
  const dotSize =
    size <= 40
      ? "w-1.5 h-1.5"
      : size <= 56
      ? "w-2 h-2"
      : size <= 72
      ? "w-2.5 h-2.5"
      : "w-3 h-3";

  return (
    <div
      className="inline-grid place-items-center"
      role="status"
      aria-label={finalLabel}
      aria-busy="true"
    >
      <div className={`relative ${box}`}>
        {/* Ambient brand glows */}
        <div
          className="absolute -inset-3 rounded-full blur-2xl opacity-40 bg-[radial-gradient(40%_50%_at_30%_20%,hsl(var(--primary)/0.35),transparent_70%)]"
          aria-hidden
        />
        <div
          className="absolute -inset-3 rounded-full blur-2xl opacity-40 bg-[radial-gradient(35%_45%_at_70%_80%,hsl(var(--accent)/0.35),transparent_70%)]"
          aria-hidden
        />

        {/* Track ring */}
        <div
          className="absolute inset-0 rounded-full border border-[hsl(var(--border))]/50"
          aria-hidden
        />

        {/* Gradient arc spinner */}
        <div
          className="absolute inset-0 rounded-full animate-spin [animation-duration:1400ms]"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,oklch(0.83_0.12_260/_0.0)_0deg,oklch(0.83_0.12_260/_0.0)_260deg,hsl(var(--primary))_320deg,hsl(var(--accent))_360deg)]" />
          {/* Donut cutout to create a ring thickness */}
          <div
            className={`absolute ${donutInset} rounded-full bg-[hsl(var(--card))]`}
          />
        </div>

        {/* Core brand pulse */}
        <div
          className={`absolute ${innerCoreInset} grid place-items-center rounded-full bg-[hsl(var(--card))] shadow-[0_8px_24px_-8px_hsl(var(--accent)/0.5)]`}
          aria-hidden
        >
          <div className="size-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
        </div>

        {/* Orbiting dots (signature) */}
        <OrbitDot dotSize={dotSize} className="rotate-0" />
        <OrbitDot dotSize={dotSize} className="rotate-[120deg]" />
        <OrbitDot dotSize={dotSize} className="rotate-[240deg]" />
      </div>
      <span className="sr-only">{finalLabel}...</span>
    </div>
  );
}

function OrbitDot({
  dotSize,
  className = "",
}: {
  dotSize: string;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 animate-spin ${className}`} aria-hidden>
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--accent))] shadow-md ${dotSize}`}
      />
    </div>
  );
}

export default Loading;
