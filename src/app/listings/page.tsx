"use client";

import { Suspense } from "react";
import { useApiGet } from "@/lib/api-hooks";
import { ListingCard, type Listing } from "@/components/listing-card";
import { FiltersBar } from "@/components/filters-bar";
import { useSearchParams } from "next/navigation";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <h2 className="heading-xl">Listings</h2>
          <div className="card p-4">Loading…</div>
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}

function ListingsContent() {
  const search = useSearchParams();
  const type = search.get("type") || undefined;
  const categoryId = search.get("categoryId") || undefined;
  const { data, isLoading, error } = useApiGet<Listing[] | Listing>(
    ["listings", type, categoryId],
    "/listings",
    { listingType: type, categoryId }
  );
  const items: Listing[] = Array.isArray(data) ? data : data ? [data] : [];
  return (
    <div className="space-y-4">
      <h2 className="heading-xl">Listings</h2>
      <div className="card p-4 space-y-3">
        <FiltersBar />
        {isLoading && <p>Loading…</p>}
        {error && (
          <p className="text-red-500">
            {String((error as any).message || error)}
          </p>
        )}
        {!isLoading &&
          !error &&
          (items.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.slice(0, 12).map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
