"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function ListingsSkeleton() {
  return (
    <div className="app-shell-page space-y-[var(--space-section)]" data-app-page="listings">
      <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card p-5 sm:p-7">
        <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-10 w-4/5 max-w-xl rounded-2xl" />
            <Skeleton className="h-5 w-full max-w-lg rounded-xl" />
            <Skeleton className="h-11 w-full max-w-md rounded-2xl" />
          </div>
          <Skeleton className="h-52 w-full rounded-[1.35rem] sm:h-64" />
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border/60 bg-card/75 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 overflow-hidden">
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-20 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-28 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          <Skeleton className="ml-auto h-9 w-9 shrink-0 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-gap)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 app-density-grid-gap">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[1.35rem] border border-border/60 bg-card shadow-sm"
          >
            <div className="relative aspect-[3/2]">
              <Skeleton className="absolute inset-0 rounded-none" />
              <Skeleton className="absolute left-3 top-3 h-6 w-16 rounded-full" />
              <Skeleton className="absolute bottom-3 right-3 h-7 w-20 rounded-xl" />
            </div>
            <div className="space-y-3 p-[var(--space-card)]">
              <Skeleton className="h-5 w-4/5 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full rounded-xl" />
                <Skeleton className="h-3.5 w-2/3 rounded-xl" />
              </div>
              <Skeleton className="h-4 w-2/5 rounded-xl" />
              <div className="flex items-center gap-2 border-t border-border/50 pt-3">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="size-10 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
