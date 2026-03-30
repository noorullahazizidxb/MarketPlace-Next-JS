"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 pb-20">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))]/80 backdrop-blur-xl p-6 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/10 via-transparent to-[hsl(var(--accent))]/10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl shrink-0" />
          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-48 rounded-2xl" />
              <Skeleton className="h-10 w-28 rounded-2xl" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64 rounded-xl" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[1.5rem] border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))]/60 backdrop-blur-xl p-5 flex items-center gap-4"
          >
            <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-24 rounded-xl" />
              <Skeleton className="h-7 w-16 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Listings grid */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[1.5rem] border border-[hsl(var(--border))]/40 overflow-hidden bg-[hsl(var(--card))]/80"
            >
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-4 space-y-2.5">
                <Skeleton className="h-5 w-3/4 rounded-xl" />
                <Skeleton className="h-3.5 w-1/2 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
