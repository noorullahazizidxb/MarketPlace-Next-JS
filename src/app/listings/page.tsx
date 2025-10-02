"use client";

import {
  Suspense,
  useMemo,
  Fragment,
  useRef,
  useState,
  useEffect,
} from "react";
import { useApiGet } from "@/lib/api-hooks";
import { ListingCard, type Listing } from "@/components/listing-card";
import { FiltersBar } from "@/components/filters-bar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AdPlaceholder } from "@/components/ads/home-page-ad-placeholder";
import { useLanguage } from "@/components/language-provider";

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsFallback />}>
      <ListingsContent />
    </Suspense>
  );
}

function ListingsFallback() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h2 className="heading-xl">{t("listings")}</h2>
      <div className="card p-4">{t("loading")}</div>
    </div>
  );
}

// Simple pull-to-refresh wrapper: detects vertical pull at top and triggers a soft reload (revisit route)
function usePullToRefresh(onRefresh: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const [pulling, setPulling] = useState(false);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop > 0) return;
      startY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0) {
        e.preventDefault();
        setPulling(true);
        setDistance(Math.min(120, dy * 0.6));
      }
    };
    const end = () => {
      if (pulling && distance > 60) onRefresh();
      setPulling(false);
      setDistance(0);
      startY.current = null;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, [pulling, distance, onRefresh]);
  return { ref, pulling, distance };
}

function ListingsContent() {
  const { t } = useLanguage();
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
  const {
    ref: ptrRef,
    pulling,
    distance,
  } = usePullToRefresh(() => {
    // Soft reload: just refresh the route (Next.js navigation) or window reload fallback
    try {
      router.refresh?.();
    } catch {
      window.location.reload();
    }
  });

  return (
    <div className="space-y-4" ref={ptrRef}>
      {(() => {
        // Map dynamic distance to a discrete height class to avoid inline style lint issue
        const h = pulling ? Math.round(distance / 10) * 10 : 0; // nearest 10
        const heightClass =
          h >= 110
            ? "h-[110px]"
            : h >= 100
            ? "h-[100px]"
            : h >= 90
            ? "h-[90px]"
            : h >= 80
            ? "h-[80px]"
            : h >= 70
            ? "h-[70px]"
            : h >= 60
            ? "h-[60px]"
            : h >= 50
            ? "h-[50px]"
            : h >= 40
            ? "h-[40px]"
            : h >= 30
            ? "h-[30px]"
            : h >= 20
            ? "h-[20px]"
            : h >= 10
            ? "h-[10px]"
            : "h-0";
        return (
          <div
            className={`sticky top-0 z-10 flex flex-col items-center justify-end overflow-hidden ${heightClass} ${
              pulling ? "" : "transition-[height] duration-300 ease-in-out"
            }`}
          >
            <div className="text-[10px] tracking-wide font-medium text-foreground/60">
              {distance > 75 ? t("releaseToRefresh") : t("pullToRefresh")}
            </div>
            <div className="mt-1 h-1 w-28 rounded-full bg-gradient-to-r from-primary/40 via-fuchsia-500/40 to-cyan-400/40" />
          </div>
        );
      })()}
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
            <p>{t("noListingsFound")}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pageItems.map((item, idx) => (
                  <Fragment key={item.id}>
                    <ListingCard key={item.id} listing={item} />
                    {/* Insert an ad after finishing each row */}
                    {((idx + 1) % 4 === 0 ||
                      (idx === pageItems.length - 1 &&
                        (idx + 1) % 4 !== 0)) && (
                      <div
                        key={`ad-${item.id}-${idx}`}
                        className="col-span-full"
                      >
                        <AdPlaceholder index={Math.floor(idx / 4)} />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
              <Pagination page={current} pageCount={pageCount} />
            </>
          ))}
      </div>
    </div>
  );
}

// (AdPlaceholder moved to shared component)

function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const { t } = useLanguage();
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
  const generateVisible = (cur: number, total: number) => {
    if (total <= 5) return Array.from({ length: total }).map((_, i) => i + 1);
    if (cur <= 3) return [1, 2, 3, 4, total];
    if (cur >= total - 2) return [1, total - 3, total - 2, total - 1, total];
    return [1, cur - 1, cur, cur + 1, total];
  };
  const visible = generateVisible(page, pageCount);

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={() => page > 1 && set(page - 1)}
        className="px-3 h-9 rounded-xl glass hover:ring-1 ring-white/20 disabled:opacity-50"
        disabled={page <= 1}
      >
        {t("prev")}
      </button>
      <div className="flex items-center gap-1">
        {visible.map((p, idx) => {
          const prev = visible[idx - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <Fragment key={p}>
              {showEllipsis && (
                <span className="px-2 text-sm opacity-60">…</span>
              )}
              <motion.button
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
            </Fragment>
          );
        })}
      </div>
      <button
        onClick={() => page < pageCount && set(page + 1)}
        className="px-3 h-9 rounded-xl glass hover:ring-1 ring-white/20 disabled:opacity-50"
        disabled={page >= pageCount}
      >
        {t("next")}
      </button>
    </div>
  );
}
