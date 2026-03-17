"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function AdminUsersSkeleton() {
  return (
    <div className="container-padded py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="rounded-2xl border p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-xl" />
          ))}
        </div>
        <div className="h-96 rounded-xl border flex items-center justify-center">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
