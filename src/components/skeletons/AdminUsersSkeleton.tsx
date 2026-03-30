"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function AdminUsersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-2xl" />
          <Skeleton className="h-4 w-72 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-36 rounded-2xl" />
      </div>

      {/* Filter/search row */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 flex-1 min-w-[180px] max-w-xs rounded-2xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* Table shell */}
      <div className="rounded-[1.5rem] border border-[hsl(var(--border))]/40 overflow-hidden bg-[hsl(var(--card))]/80 backdrop-blur-xl">
        {/* header row */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-[hsl(var(--border))]/40">
          {["10%", "30%", "20%", "15%", "15%", "10%"].map((w, i) => (
            <Skeleton key={i} className={`h-3.5 rounded-xl`} style={{ width: w }} />
          ))}
        </div>
        {/* data rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-[hsl(var(--border))]/20 last:border-0"
          >
            <Skeleton className="w-9 h-9 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1 max-w-[30%] rounded-xl" />
            <Skeleton className="h-4 w-[20%] rounded-xl" />
            <Skeleton className="h-6 w-[15%] rounded-full" />
            <Skeleton className="h-4 w-[15%] rounded-xl" />
            <div className="flex gap-2 ml-auto">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
