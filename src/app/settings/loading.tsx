import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <Skeleton className="h-8 w-52" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
        <div className="md:col-span-2 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 border rounded-2xl space-y-3">
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
