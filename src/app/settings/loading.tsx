import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-[var(--space-section)]">
      <Skeleton className="h-8 w-52" />
      <div className="grid md:grid-cols-3 gap-[var(--space-section)]">
        <div className="space-y-[var(--space-gap)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
        <div className="md:col-span-2 space-y-[var(--space-section)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-[var(--space-card)] border rounded-2xl space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
