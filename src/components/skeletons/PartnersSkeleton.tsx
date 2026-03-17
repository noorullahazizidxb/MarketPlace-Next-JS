"use client";

import React from "react";

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-md bg-[hsl(var(--muted))] ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

export function PartnersSkeleton() {
  return (
    <section aria-hidden className="relative mt-12">
      <div className="container-padded">
        <Shimmer className="h-4 w-36 mb-4" />
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80">
          <div className="flex items-center gap-10 py-6">
            {/* 6 placeholder cards to match the real marquee */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 h-40 w-40 grid place-items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--accent))]/10"
              >
                <Shimmer className="h-14 w-14 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
