import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
export default function Loading() {
  return (
    <div className="container-padded py-10 space-y-[var(--space-section)]">
      <Skeleton className="h-8 w-48" />
      <div className="grid md:grid-cols-3 gap-[var(--space-section)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-[var(--space-card)] border rounded-2xl space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
