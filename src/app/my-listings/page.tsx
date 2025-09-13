"use client";

import { useApiGet } from "@/lib/api-hooks";
import { ListingCard, type Listing } from "@/components/listing-card";

export default function MyListingsPage() {
  const { data, isLoading, error } = useApiGet<Listing[] | Listing>(
    ["my-listings"],
    "/me/listings"
  );
  const items: Listing[] = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <div className="space-y-4">
      <h2 className="heading-xl">My listings</h2>
      <div className="card p-4">
        {isLoading && <p>Loading…</p>}
        {error && (
          <p className="text-red-500">
            {String((error as any).message || error)}
          </p>
        )}
        {!isLoading &&
          !error &&
          (items.length === 0 ? (
            <p className="subtle">You have no listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
