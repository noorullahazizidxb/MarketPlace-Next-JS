"use client";
import React from "react";
import { useLanguage } from "@/components/language-provider";

type Props = { size?: number; label?: string };

export function Loading({ size = 56, label }: Props) {
  const { t } = useLanguage();
  const finalLabel = label ?? t("loading");
  const box =
    size <= 40
      ? "w-10 h-10"
      : size <= 56
      ? "w-14 h-14"
      : size <= 72
      ? "w-18 h-18"
      : "w-24 h-24";
  const coreInset =
    size <= 40
      ? "inset-2"
      : size <= 56
      ? "inset-3"
      : size <= 72
      ? "inset-4"
      : "inset-5";
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
    >
      <div className={`relative ${box}`}>
        {/* Core pulse using accent color */}
        <div
          className="absolute inset-0 rounded-full bg-[hsl(var(--accent))] opacity-20 animate-ping"
          aria-hidden
        />
        <div
          className={`absolute ${coreInset} rounded-full bg-[hsl(var(--accent))] shadow-xl`}
          aria-hidden
        />

        {/* Ring */}
        <div
          className="absolute inset-1 rounded-full border border-[color:oklch(0.7_0.08_260_/0.25)]/50"
          aria-hidden
        />

        {/* Orbiting dots with staggered starting angles */}
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
