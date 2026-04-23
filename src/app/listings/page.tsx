"use client";

import {
  Suspense,
  useMemo,
  Fragment,
  useRef,
  useState,
  useEffect,
  useTransition,
  memo,
} from "react";
import dynamic from "next/dynamic";
import { useApiGet } from "@/lib/api-hooks";
import { ListingCard, type Listing } from "@/components/ui/listing-card";
import { FiltersBar } from "@/components/ui/filters-bar";
import { HomeHero } from "@/components/listings/HomeHero";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AdPlaceholder } from "@/components/ads/home-page-ad-placeholder";
import { useLanguage } from "@/components/providers/language-provider";
import { useSocialRealtime } from "@/lib/use-social-realtime";
import StoriesBar from "@/components/stories/StoriesBar";
import ListingsPromoBanner from "@/components/ui/listings-promo-banner";
import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
import { Tooltip } from "@/components/ui/tooltip";
import { ComponentLoading } from "@/components/ui/component-loading";

// Lazy-load below-fold / heavy components to keep initial bundle small
const HiddenListingsSlider = dynamic(
  () => import("@/components/listings/HiddenListingsSlider").then((m) => m.HiddenListingsSlider),
  { ssr: false, loading: () => <ComponentLoading rows={2} className="h-24" /> }
);

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
  useSocialRealtime(true);
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = search.get("id") || undefined;
  const type = search.get("type") || undefined;
  const categoryId = search.get("categoryId") || undefined;
  const searchText = search.get("search") || undefined;
  const page = parseInt(search.get("page") || "1", 10);

  // ── Viewport-aware columns (mirrors Tailwind grid breakpoints) ──────────
  const computeNumCols = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1536) return 5;
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };
  // Initialize from window immediately (not 1) to avoid layout shift on desktop
  const [numCols, setNumCols] = useState(() => computeNumCols());
  useEffect(() => {
    setNumCols(computeNumCols());
    const onResize = () => setNumCols(computeNumCols());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pageSize = numCols * 4; // 4 complete rows per page
  // Always fetch the list from backend; apply client-side filters so FiltersBar works without round trips.
  const { data, isLoading, error } = useApiGet<Listing[] | Listing>(
    ["listings", "all"],
    "/listings",
    undefined,
  );
  const allItems: Listing[] = useMemo(
    () => (Array.isArray(data) ? data : data ? [data] : []),
    [data],
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
    [items, current, pageSize],
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

  // Scroll to listings anchor when navigated from search (router pushes include #listings)
  const listingsAnchorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash === "#listings") {
        // give time for content to render
        setTimeout(() => {
          const el =
            listingsAnchorRef.current || document.getElementById("listings");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
      }
    } catch { }
  }, [allItems, id, searchText]);

  return (
    <div className="space-y-6" ref={ptrRef}>
      {/* Hero */}
      <HomeHero />
      {/* Stories bar */}
      <StoriesBar />
      {/* Hidden listings slider */}
      <HiddenListingsSlider items={allItems} />
      {/* Promo banner placed in listings page (before global Partners section) */}
      <ListingsPromoBanner />
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
            className={`sticky top-0 z-10 flex flex-col items-center justify-end overflow-hidden ${heightClass} ${pulling ? "" : "transition-[height] duration-300 ease-in-out"
              }`}
          >
            <div className="text-[10px] tracking-wide font-medium text-foreground/60">
              {distance > 75 ? t("releaseToRefresh") : t("pullToRefresh")}
            </div>
            <div className="mt-1 h-1 w-28 rounded-full bg-gradient-to-r from-primary/40 via-fuchsia-500/40 to-cyan-400/40" />
          </div>
        );
      })()}
      <div id="listings" ref={listingsAnchorRef} className="card p-4 space-y-3">
        <FiltersBar />
        {error && (
          <p className="text-red-500">
            {String((error as any).message || error)}
          </p>
        )}
        {/* Grid is always rendered — skeletons occupy the same space as cards
            while data loads so there is no layout shift when content arrives. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden bg-[hsl(var(--card))]"
              >
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-6 w-16 rounded-xl" />
                    <Skeleton className="h-6 w-20 rounded-xl" />
                  </div>
                </div>
              </div>
            ))
            : (
              !error && (
                items.length === 0
                  ? (
                    <p className="col-span-full">{t("noListingsFound")}</p>
                  )
                  : (
                    <>
                      {pageItems.map((item, idx) => (
                        <Fragment key={item.id}>
                          <ListingCard
                            listing={item}
                            cleanImageOverlayOnEngage
                          />
                          {/* Insert an ad after finishing each row (every 5 cards to match widest grid) */}
                          {((idx + 1) % numCols === 0 ||
                            (idx === pageItems.length - 1 &&
                              (idx + 1) % numCols !== 0)) && (
                              <div
                                key={`ad-${item.id}-${idx}`}
                                className="col-span-full"
                              >
                                <AdPlaceholder index={Math.floor(idx / numCols)} />
                              </div>
                            )}
                        </Fragment>
                      ))}
                    </>
                  )
              )
            )
          }
        </div>
        {!isLoading && !error && items.length > 0 && (
          <Pagination page={current} pageCount={pageCount} />
        )}
      </div>
    </div>
  );
}

// StoriesBar extracted to reusable component

// (AdPlaceholder moved to shared component)

function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const { t } = useLanguage();
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const set = (p: number) => {
    startTransition(() => {
      const params = new URLSearchParams(search.toString());
      params.set("page", String(p));
      router.push(`${pathname}?${params.toString()}`);
      const el = document.querySelector("h2.heading-xl");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const generateVisible = (cur: number, total: number) => {
    if (total <= 5) return Array.from({ length: total }).map((_, i) => i + 1);
    if (cur <= 3) return [1, 2, 3, 4, total];
    if (cur >= total - 2) return [1, total - 3, total - 2, total - 1, total];
    return [1, cur - 1, cur, cur + 1, total];
  };
  const visible = generateVisible(page, pageCount);

  return (
    <div className={`mt-4 flex items-center justify-center gap-2 transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <Tooltip content={t("prev")} side="top">
        <Button
          variant="accent"
          size="sm"
          onClick={() => page > 1 && set(page - 1)}
          disabled={page <= 1 || isPending}
        >
          {t("prev")}
        </Button>
      </Tooltip>
      <div className="flex items-center gap-1">
        {visible.map((p, idx) => {
          const prev = visible[idx - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <Fragment key={p}>
              {showEllipsis && (
                <span className="px-2 text-sm opacity-60">…</span>
              )}
              <Tooltip content={`${t("page" as any) || "Page"} ${p}`} side="top">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => set(p)}
                  className={
                    p === page
                      ? "px-3 h-9 rounded-xl bg-[hsl(var(--primary))] border border-[hsl(var(--primary))/0.35] text-[hsl(var(--primary-foreground))]"
                      : "px-3 h-9 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-[hsl(var(--accent-foreground))] hover:[background-color:hsl(var(--btn-accent-hover-bg,var(--primary)))] hover:[color:hsl(var(--btn-accent-hover-fg,var(--accent-foreground)))] focus:[background-color:hsl(var(--btn-accent-hover-bg,var(--primary)))]"
                  }
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </motion.button>
              </Tooltip>
            </Fragment>
          );
        })}
      </div>
      <Tooltip content={t("next")} side="top">
        <Button
          variant="accent"
          size="sm"
          onClick={() => page < pageCount && set(page + 1)}
          disabled={page >= pageCount || isPending}
        >
          {t("next")}
        </Button>
      </Tooltip>
    </div>
  );
}
