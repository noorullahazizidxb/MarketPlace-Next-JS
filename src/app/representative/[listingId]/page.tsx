"use client";

import { useParams, useRouter } from "next/navigation";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";

export default function RepresentativeSelectPage() {
  const params = useParams<{ listingId: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useApiGet<any>(
    ["listing", params.listingId],
    `/listings/${params.listingId}`
  );

  const choose = useApiMutation("post", `/representatives/choose`);

  if (isLoading) return <div className="card p-6">Loading…</div>;
  if (error)
    return (
      <div className="card p-6 text-red-500">
        {String(error.message || error)}
      </div>
    );

  const reps: any[] = data?.representatives ?? [];

  return (
    <div className="space-y-4">
      <h2 className="heading-xl">Choose a representative</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reps.map((r, idx) => (
          <div
            key={idx}
            className="glass rounded-2xl p-4 border border-white/10"
          >
            <p className="font-medium">Region: {r.representative?.region}</p>
            <p className="subtle text-sm">
              WhatsApp: {r.representative?.whatsappNumber}
            </p>
            <Button
              className="mt-3"
              onClick={async () => {
                await choose.mutateAsync({
                  listingId: params.listingId,
                  representativeId: r.representative?.id,
                });
                router.push(`/listings/${params.listingId}`);
              }}
            >
              Select
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
