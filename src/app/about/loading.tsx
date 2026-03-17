import { Skeleton, Block } from "@/components/skeletons/SkeletonPrimitives";
export default function Loading() {
  return (
    <div className="container-padded py-12 space-y-10">
      <Skeleton className="h-10 w-60" />
      <div className="grid gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 border rounded-2xl p-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Block lines={4} />
          </div>
        ))}
      </div>
    </div>
  );
}
