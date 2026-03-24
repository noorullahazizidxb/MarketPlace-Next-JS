"use client";
import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
import { cn } from "@/lib/cn";

export interface BlogCardSkeletonProps {
  imageHeightClass?: string;
}

/**
 * Skeleton placeholder that mirrors the visual footprint of BlogCard.
 * Show this in place of a real BlogCard while data is being fetched.
 */
export function BlogCardSkeleton({
  imageHeightClass,
}: BlogCardSkeletonProps) {
  const imgHeight = imageHeightClass ?? "h-52 md:h-64 lg:h-72";

  return (
    <article
      aria-hidden="true"
      className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      {/* Image area */}
      <div className={cn("w-full bg-[hsl(var(--muted))]/40", imgHeight)}>
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Text content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Body lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Author row */}
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-7 w-16 rounded-xl" />
        </div>
      </div>
    </article>
  );
}
