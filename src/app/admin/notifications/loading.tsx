import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
export default function Loading() {
  return (
    <div className="container-padded py-10 space-y-[var(--space-section)]">
      <Skeleton className="h-8 w-56" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-[var(--space-card)] border rounded-2xl space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}
