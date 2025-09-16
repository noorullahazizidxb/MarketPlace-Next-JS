"use client";

import { Suspense, useMemo } from "react";
import { useApiGet } from "@/lib/api-hooks";
import { ListingCard, type Listing } from "@/components/listing-card";
import { FiltersBar } from "@/components/filters-bar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
  const router = useRouter();
  const pathname = usePathname();
  const id = search.get("id") || undefined;
  const type = search.get("type") || undefined;
  const categoryId = search.get("categoryId") || undefined;
  const searchText = search.get("search") || undefined;
  const page = parseInt(search.get("page") || "1", 10);
  const pageSize = 12;
  // Always fetch the list from backend; apply client-side filters so FiltersBar works without round trips.
  const { data, isLoading, error } = useApiGet<Listing[] | Listing>(
    ["listings", "all"],
    "/listings",
    undefined
  );
  const allItems: Listing[] = useMemo(
    () => (Array.isArray(data) ? data : data ? [data] : []),
    [data]
  );

  const items: Listing[] = useMemo(() => {
    if (id) {
      const found = allItems.find((it) => String(it.id) === String(id));
      return found ? [found] : [];
    }
    return allItems.filter((it) => {
      if (type && type.length > 0 && it.listingType !== type) return false;
      if (categoryId && categoryId.length > 0) {
        const itemCat =
          (it as any).categoryId ?? (it as any).category?.id ?? undefined;
        if (!itemCat || String(itemCat) !== String(categoryId)) return false;
      }
      if (searchText && searchText.length > 0) {
        const hay = `${it.title ?? ""} ${it.description ?? ""}`.toLowerCase();
        if (!hay.includes(searchText.toLowerCase())) return false;
      }
      return true;
    });
  }, [allItems, id, type, categoryId, searchText]);
  const total = items.length; // backend not paginated; client-side paginate available items
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const pageItems = useMemo(
    () => items.slice((current - 1) * pageSize, current * pageSize),
    [items, current]
  );
  return (
    <div className="space-y-4">
      <h2 className="heading-xl">Listings</h2>
      <div className="card p-4 space-y-3">
        <FiltersBar />
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden"
              >
                <div className="animate-pulse">
                  <div className="h-40 bg-white/10" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-white/10 rounded" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pageItems.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
              <Pagination page={current} pageCount={pageCount} />
            </>
          ))}
      </div>
    </div>
  );
}

function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const set = (p: number) => {
    const params = new URLSearchParams(search.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    const el = document.querySelector("h2.heading-xl");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const pages = Array.from({ length: pageCount }).map((_, i) => i + 1);
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={() => page > 1 && set(page - 1)}
        className="px-3 h-9 rounded-xl glass hover:ring-1 ring-white/20 disabled:opacity-50"
        disabled={page <= 1}
      >
        Prev
      </button>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <motion.button
            key={p}
            whileTap={{ scale: 0.98 }}
            onClick={() => set(p)}
            className={
              p === page
                ? "px-3 h-9 rounded-xl bg-primary/20 border border-primary/40"
                : "px-3 h-9 rounded-xl glass border border-white/10 hover:bg-white/10"
            }
          >
            {p}
          </motion.button>
        ))}
      </div>
      <button
        onClick={() => page < pageCount && set(page + 1)}
        className="px-3 h-9 rounded-xl glass hover:ring-1 ring-white/20 disabled:opacity-50"
        disabled={page >= pageCount}
      >
        Next
      </button>
    </div>
  );
}
