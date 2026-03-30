"use client";

import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function ListingsPromoBannerSkeleton() {
  return (
    <section aria-hidden className="w-full">
      <div className="container-padded">
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))]/80 backdrop-blur-xl shadow-2xl">
          {/* ambient gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--secondary))]/20 via-[hsl(var(--accent))]/10 to-transparent pointer-events-none" />
          <div className="relative px-6 py-10 md:px-10 md:py-16">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              {/* text block */}
              <div className="flex-1 min-w-0 text-center md:text-left space-y-3">
                <Skeleton className="h-10 w-64 md:w-80 rounded-2xl mx-auto md:mx-0" />
                <Skeleton className="h-5 w-full max-w-sm rounded-xl mx-auto md:mx-0" />
              </div>
              {/* cta block */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-48 rounded-2xl" />
                <Skeleton className="hidden md:block h-10 w-28 rounded-2xl" />
                <Skeleton className="hidden md:block w-20 h-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
