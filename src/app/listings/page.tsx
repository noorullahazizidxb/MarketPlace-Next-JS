"use client";

import {
  Suspense,
  useMemo,
  Fragment,
  useRef,
  useState,
  useEffect,
  useTransition,
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
import { OrbField } from "@/components/ui/atoms/ambient-canvas";
import { LayoutGrid, RefreshCw, SearchX, SlidersHorizontal } from "lucide-react";

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
    <div className="app-shell-page space-y-[var(--space-section)]" data-app-page="listings">
      <div className="rounded-[1.5rem] border border-border bg-card p-[var(--space-card)]">
        <h2 className="heading-xl">{t("listings")}</h2>
        <p className="mt-2 app-text-body text-muted-foreground">{t("loading")}</p>
      </div>
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
      if (window.scrollY > 0 || el.scrollTop > 0) return;
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
  // Keep the first render deterministic for SSR; sync to the viewport after mount.
  const [numCols, setNumCols] = useState(1);
  useEffect(() => {
    const onResize = () => setNumCols(computeNumCols());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const pageSize = 12;
  // Always fetch the list from backend; apply client-side filters so FiltersBar works without round trips.
  const { data, isLoading, error, refetch } = useApiGet<Listing[] | Listing>(
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
    void refetch();
  });

  const activeFilters = [
    type ? `${t("typeLabel")}: ${type}` : null,
    categoryId ? t("categoryLabel") : null,
    searchText ? `“${searchText}”` : null,
  ].filter(Boolean);

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
    <div className="relative space-y-[var(--space-section)] app-shell-page" ref={ptrRef} data-app-page="listings">
      <OrbField intensity={0.18} className="fixed inset-0 -z-10" />
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
            <div className="app-text-micro tracking-wide font-medium text-foreground/60">
              {distance > 75 ? t("releaseToRefresh") : t("pullToRefresh")}
            </div>
            <div className="mt-1 h-1 w-28 rounded-full bg-gradient-to-r from-primary/40 via-primary/40 to-info/40" />
          </div>
        );
      })()}
      <section
        id="listings"
        ref={listingsAnchorRef}
        className="app-shell-card overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl"
        aria-labelledby="listings-heading"
      >
        <div className="border-b border-border/60 p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 app-text-caption font-semibold uppercase tracking-[0.12em] text-primary">
                <LayoutGrid className="size-3.5" /> Marketplace catalog
              </div>
              <h2 id="listings-heading" className="app-text-heading font-semibold tracking-tight">
                {t("listings")}
              </h2>
              <p className="mt-1 app-text-body text-muted-foreground" aria-live="polite">
                {isLoading
                  ? t("loading")
                  : `${total} ${total === 1 ? "listing" : "listings"}${activeFilters.length ? " match your filters" : " available"}`}
              </p>
            </div>
            {activeFilters.length > 0 && (
              <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:justify-end">
                <SlidersHorizontal className="size-3.5 shrink-0 text-muted-foreground" />
                {activeFilters.map((filter) => (
                  <span
                    key={filter}
                    className="shrink-0 rounded-full border border-primary/15 bg-primary/8 px-2.5 py-1 app-text-caption font-medium text-primary"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            )}
          </div>
          <FiltersBar />
        </div>

        <div className="p-3 sm:p-4 lg:p-5">
        {error && (
          <div className="mb-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-destructive">Unable to load listings</p>
              <p className="mt-1 app-text-caption text-muted-foreground">
                {String((error as any).message || error)}
              </p>
            </div>
            <Button variant="secondary" size="sm" LeftIcon={RefreshCw} onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        )}
        {/* Grid is always rendered — skeletons occupy the same space as cards
            while data loads so there is no layout shift when content arrives. */}
        <div className="grid grid-cols-1 items-stretch gap-[var(--space-gap)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 app-density-grid-gap">
          {isLoading
            ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[1.35rem] border border-border/60 bg-card"
              >
                <div className="relative aspect-[3/2]">
                  <Skeleton className="absolute inset-0 rounded-none" />
                  <Skeleton className="absolute left-3 top-3 h-6 w-16 rounded-full" />
                  <Skeleton className="absolute bottom-3 right-3 h-7 w-20 rounded-xl" />
                </div>
                <div className="space-y-3 p-[var(--space-card)]">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center gap-2 border-t border-border/50 pt-3">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <Skeleton className="size-10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))
            : (
              !error && (
                items.length === 0
                  ? (
                    <div className="col-span-full grid min-h-72 place-items-center rounded-[1.35rem] border border-dashed border-border bg-muted/15 p-6 text-center">
                      <div>
                        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                          <SearchX className="size-5" />
                        </span>
                        <h3 className="mt-4 app-text-heading-sm font-semibold">
                          {t("noListingsFound")}
                        </h3>
                        <p className="mx-auto mt-2 max-w-md app-text-body text-muted-foreground">
                          Try a broader search or clear one of the active filters.
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-4"
                          onClick={() => router.push(pathname)}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </div>
                  )
                  : (
                    <>
                      {pageItems.map((item, idx) => (
                        <Fragment key={item.id}>
                          <ListingCard
                            listing={item}
                            cleanImageOverlayOnEngage
                            priority={current === 1 && idx < Math.min(2, numCols)}
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
      </section>
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
      const listingsRoot = document.getElementById("listings");
      if (listingsRoot) {
        listingsRoot.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
    <div className={`mt-4 flex items-center justify-center gap-[var(--space-gap)] transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
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
                <span className="px-2 app-text-caption opacity-60">…</span>
              )}
              <Tooltip content={`${t("page" as any) || "Page"} ${p}`} side="top">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => set(p)}
                  className={
                    p === page
                      ? "px-3 min-h-[var(--ctrl-h-sm)] h-[var(--ctrl-h-sm)] rounded-xl bg-primary border border-primary/35 text-primary-foreground"
                      : "px-3 min-h-[var(--ctrl-h-sm)] h-[var(--ctrl-h-sm)] rounded-xl bg-accent border border-border text-accent-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary"
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
