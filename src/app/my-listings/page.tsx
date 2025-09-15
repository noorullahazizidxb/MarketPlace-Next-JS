"use client";

import { useMemo } from "react";
import { ListingCard, type Listing } from "@/components/listing-card";
import { useAuthStore } from "@/store/auth.store";

export default function MyListingsPage() {
  const session = useAuthStore((s) => s.session);

  const items: Listing[] = useMemo(() => {
    const u = session?.user ?? {};
    return Array.isArray(u.listings) ? u.listings : [];
  }, [session?.user]);

  if (!session) return <p className="subtle">Loading session…</p>;

  return (
    <div className="space-y-4">
      <h2 className="heading-xl">My listings</h2>
      <div className="card p-4">
        {items.length === 0 ? (
          <p className="subtle">You have no listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
