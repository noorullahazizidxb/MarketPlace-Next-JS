"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function ProfileSkeleton() {
  return (
    <div className="relative min-h-screen pb-24">
      <div className="h-40 sm:h-56 relative">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      </div>
      <div className="relative px-6 -mt-16 max-w-6xl mx-auto flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-36 h-36 rounded-2xl" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
