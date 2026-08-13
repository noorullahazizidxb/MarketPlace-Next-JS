"use client";
import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
import { cn } from "@/lib/cn";

export interface BlogCardSkeletonProps {
  imageHeightClass?: string;
  variant?: "default" | "overlay";
}

/**
 * Skeleton placeholder that mirrors the visual footprint of BlogCard.
 * Show this in place of a real BlogCard while data is being fetched.
 */
export function BlogCardSkeleton({
  imageHeightClass,
  variant = "default",
}: BlogCardSkeletonProps) {
  const imgHeight =
    imageHeightClass ??
    (variant === "overlay" ? "h-[22rem] sm:h-[26rem]" : "h-52 sm:h-56 lg:h-60");

  if (variant === "overlay") {
    return (
      <article
        aria-hidden="true"
        className="relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-card"
      >
        <Skeleton className={cn("w-full rounded-none", imgHeight)} />
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
          <div className="flex justify-between gap-3">
            <Skeleton className="h-6 w-28 rounded-full" />
            <div className="flex gap-1.5">
              <Skeleton className="h-9 w-14 rounded-xl" />
              <Skeleton className="h-9 w-14 rounded-xl" />
            </div>
          </div>
          <div className="max-w-2xl space-y-3">
            <Skeleton className="h-8 w-4/5 rounded-xl" />
            <Skeleton className="h-5 w-full rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-hidden="true"
      className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-border/60 bg-card"
    >
      {/* Image area */}
      <div className={cn("relative w-full bg-muted/40", imgHeight)}>
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="absolute left-3 top-3 h-6 w-24 rounded-full" />
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col space-y-3 p-[var(--space-card)]">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-14" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-auto flex items-center gap-2 border-t border-border/50 pt-3">
          <Skeleton className="h-9 w-14 rounded-xl" />
          <Skeleton className="h-9 w-14 rounded-xl" />
          <Skeleton className="h-9 w-14 rounded-xl" />
          <Skeleton className="ml-auto size-9 rounded-xl" />
        </div>
      </div>
    </article>
  );
}
