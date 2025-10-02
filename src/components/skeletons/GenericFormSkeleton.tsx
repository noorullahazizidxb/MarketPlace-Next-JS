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
    <div className="max-w-xl mx-auto py-12 px-4 space-y-8">
      <Skeleton className={`h-8 ${titleWidth}`} />
      <div className="space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
