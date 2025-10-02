import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <Skeleton className="h-8 w-64" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl border space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}
