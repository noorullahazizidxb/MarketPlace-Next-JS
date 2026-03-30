"use client";

import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function PartnersSkeleton() {
  return (
    <section aria-hidden className="relative mt-12">
      <div className="container-padded">
        {/* section label */}
        <div className="flex items-center gap-3 mb-5">
          <Skeleton className="h-4 w-28 rounded-full" />
          <span className="flex-1 h-px bg-[hsl(var(--border))]/40 rounded-full" />
        </div>
        {/* marquee shell */}
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))]/60 backdrop-blur-xl">
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[hsl(var(--card))]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[hsl(var(--card))]/80 to-transparent z-10 pointer-events-none" />
          <div className="flex items-center gap-8 px-8 py-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 flex items-center justify-center rounded-xl border border-[hsl(var(--border))]/40 bg-[hsl(var(--accent))]/10 w-36 h-20"
              >
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
