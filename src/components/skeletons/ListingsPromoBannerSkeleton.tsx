"use client";

import React from "react";

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-md bg-[hsl(var(--muted))] ${className}`}
  >
    {/* animated shimmer */}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

export function ListingsPromoBannerSkeleton() {
  return (
    <section aria-hidden className="w-full">
      <div className="container-padded">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* same gradient bg as real banner */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--secondary))] via-[hsl(var(--accent))/0.12] to-[hsl(var(--secondary))/0.9]" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.04)] to-transparent" />
          <div className="absolute -left-8 top-0 h-full w-40 rotate-12 opacity-8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

          <div className="relative">
            <div className="px-4 py-8 md:px-8 md:py-14">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <Shimmer className="h-9 w-64 md:w-80" />
                  <Shimmer className="mt-3 h-5 w-full max-w-xl" />
                </div>

                <div className="flex items-center gap-4">
                  <Shimmer className="h-11 w-48 rounded-2xl" />
                  <Shimmer className="hidden md:inline-flex h-9 w-28 rounded-2xl" />
                  <Shimmer className="hidden md:flex w-20 h-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
