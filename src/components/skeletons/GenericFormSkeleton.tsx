"use client";
import React from "react";
import { Skeleton } from "./SkeletonPrimitives";

export function GenericFormSkeleton({
  titleWidth = "w-40",
  fields = 6,
}: {
  titleWidth?: string;
  fields?: number;
}) {
  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-8">
      {/* Page title */}
      <div className="space-y-2">
        <Skeleton className={`h-8 ${titleWidth} rounded-2xl`} />
        <Skeleton className="h-4 w-64 rounded-xl" />
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <React.Fragment key={i}>
            <Skeleton className={`h-8 w-8 rounded-full ${i === 0 ? "bg-[hsl(var(--primary))]/20" : ""}`} />
            {i < 2 && <Skeleton className="h-0.5 flex-1 rounded-full" />}
          </React.Fragment>
        ))}
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3.5 w-24 rounded-xl" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        ))}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 flex-1 rounded-2xl" />
          <Skeleton className="h-11 w-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
