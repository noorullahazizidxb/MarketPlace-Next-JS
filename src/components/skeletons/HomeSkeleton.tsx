"use client";
import React from "react";
import { Skeleton, Block } from "./SkeletonPrimitives";

export function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero/banner */}
      <div className="container-padded mt-8">
        <div className="rounded-2xl border p-6 bg-[hsl(var(--card))/0.6] backdrop-blur">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 mt-3" />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-16 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="container-padded mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-3">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
