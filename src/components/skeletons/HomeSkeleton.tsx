"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";
import { LISTING_GRID_CLASS } from "@/lib/listing-grid";

export function HomeSkeleton() {
  return (
    <div className="min-h-screen space-y-8 pb-16">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)]/40 bg-[var(--card)]/60 backdrop-blur-xl p-6 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/8 to-transparent pointer-events-none" />
        <Skeleton className="h-10 w-48 sm:w-64 rounded-2xl" />
        <Skeleton className="h-4 w-72 sm:w-96 mt-4 rounded-xl" />
        <div className="mt-8 flex flex-wrap gap-3">
          <Skeleton className="h-11 w-36 rounded-2xl" />
          <Skeleton className="h-11 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Stories bar */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shrink-0 flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-2.5 w-12 rounded-full" />
          </div>
        ))}
      </div>

      {/* Featured slider */}
      <Skeleton className="h-40 sm:h-52 w-full rounded-2xl" />

      {/* Filter chips */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
        ))}
      </div>

      {/* Cards grid */}
      <div className={LISTING_GRID_CLASS}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-[var(--border)]/40 bg-[var(--card)]/80 backdrop-blur-xl"
          >
            <Skeleton className="aspect-[3/2] w-full rounded-none" />
            <div className="space-y-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-3 w-full rounded-lg" />
              <div className="flex items-center gap-1.5 pt-1">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
