import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";

/** Mirrors the listing detail layout so content swaps in without layout shift. */
export function ListingDetailSkeleton() {
  return (
    <div className="space-y-[var(--space-section)]" aria-busy="true">
      <div className="space-y-3">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-9 w-3/4 max-w-xl" />
      </div>
      <div className="grid grid-cols-1 gap-[var(--space-section)] lg:grid-cols-3">
        <div className="space-y-[var(--space-gap)] lg:col-span-2">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          <div className="space-y-3 rounded-2xl border border-border/60 p-[var(--space-card)]">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-32 rounded-xl" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="space-y-[var(--space-gap)]">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
