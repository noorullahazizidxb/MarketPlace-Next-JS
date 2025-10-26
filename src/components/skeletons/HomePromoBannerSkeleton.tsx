"use client";

import React from "react";

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-md bg-[hsl(var(--muted))] ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

export function HomePromoBannerSkeleton() {
  return (
    <section aria-hidden className="w-full">
      <div className="container-padded">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-[hsl(var(--accent))] bg-gradient-to-tr from-[hsl(var(--accent))] to-[hsl(var(--primary))/0.1]" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent)]" />
          <div className="absolute -left-20 -bottom-12 w-64 h-32 rounded-xl opacity-10 rotate-12 bg-[linear-gradient(90deg,rgba(255,255,255,0.06),transparent)]" />

          <div className="relative">
            <div className="px-4 py-8 md:px-8 md:py-14">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <Shimmer className="h-9 w-64 md:w-80" />
                  <Shimmer className="mt-3 h-5 w-full max-w-xl" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Shimmer className="h-11 w-48 rounded-2xl" />
                    <Shimmer className="hidden sm:inline-flex h-9 w-32 rounded-2xl" />
                  </div>
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
