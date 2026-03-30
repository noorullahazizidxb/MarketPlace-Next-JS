"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function ListingsSkeleton() {
  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full ml-auto" />
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[1.5rem] border border-[hsl(var(--border))]/40 overflow-hidden bg-[hsl(var(--card))]/80 backdrop-blur-xl shadow-sm"
          >
            <Skeleton className="h-44 w-full rounded-none" />
            <div className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-3/4 rounded-xl" />
                <Skeleton className="h-5 w-10 rounded-xl shrink-0" />
              </div>
              <Skeleton className="h-3.5 w-2/3 rounded-xl" />
              <Skeleton className="h-3.5 w-1/2 rounded-xl" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
