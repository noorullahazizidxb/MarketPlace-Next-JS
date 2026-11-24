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
import { categoryWithDescendants } from "@/lib/category-tree";
import { useApiGet } from "@/lib/api-hooks";
import type { Listing } from "@/components/ui/organisms/listing-card";
import { ListingCardSelector } from "@/components/ui/organisms/listing-card-selector";
import { FiltersBar } from "@/components/ui/organisms/filters-bar";
import { HomeHero } from "@/components/listings/HomeHero";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/molecules/button";
import { AdPlaceholder } from "@/components/ads/home-page-ad-placeholder";
import { useLanguage } from "@/components/providers/language-provider";
import { useSocialRealtime } from "@/lib/use-social-realtime";
import { StoriesBarSelector } from "@/components/stories/stories-bar-selector";
import ListingsPromoBanner from "@/components/ui/organisms/listings-promo-banner";
import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
import { Tooltip } from "@/components/ui/molecules/tooltip";
import { ComponentLoading } from "@/components/ui/molecules/component-loading";
import { OrbField } from "@/components/ui/atoms/ambient-canvas";
import {
  LISTING_GRID_CLASS,
  listingGridNumCols,
} from "@/lib/listing-grid";
import {
  CloudOff,
  RefreshCw,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { Reveal } from "@/components/ui/atoms/reveal";
import { duration, ease, spring, swap, tapPress } from "@/lib/motion";
import type { TranslationKey } from "@/lib/i18n";

function resultsLabelKey(total: number, filtered: boolean): TranslationKey {
  if (filtered) return total === 1 ? "listingsMatchingOne" : "listingsMatchingMany";
  return total === 1 ? "listingsAvailableOne" : "listingsAvailableMany";
}

// Lazy-load below-fold / heavy components to keep initial bundle small
const HiddenListingsSlider = dynamic(
  () =>
    import("@/components/listings/HiddenListingsSlider").then(
      (m) => m.HiddenListingsSlider,
    ),
  { ssr: false, loading: () => <ComponentLoading rows={2} className="h-24" /> },
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
    <div
      className="app-shell-page space-y-[var(--space-section)]"
      data-app-page="listings"
    >
      <div className="rounded-[1.5rem] border border-border bg-card p-[var(--space-card)]">
        <h2 className="heading-xl">{t("listings")}</h2>
        <p className="mt-2 app-text-body text-muted-foreground">
          {t("loading")}
        </p>
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

  // ── Viewport-aware columns (mirrors LISTING_GRID_CLASS) ──────────
  const [numCols, setNumCols] = useState(1);
  useEffect(() => {
    const sync = () => setNumCols(listingGridNumCols(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  const isMobileViewport = numCols === 1;
  // Mobile: 9 listings (3 groups of 3). Larger: three full rows.
  const pageSize = isMobileViewport ? 9 : Math.max(numCols, 1) * 3;
  // Always fetch the list from backend; apply client-side filters so FiltersBar works without round trips.
  const { data, isLoading, error, refetch } = useApiGet<Listing[] | Listing>(
    ["listings", "all"],
    "/listings",
    undefined,
  );
  // Categories (shared cache with FiltersBar / navbar) so a parent category also matches its sub-categories.
  const { data: categoriesData } = useApiGet<any>(["categories"], "/categories");
  const categoryIds = useMemo(() => {
    if (!categoryId) return null;
    const list = Array.isArray(categoriesData) ? categoriesData : [];
    return categoryWithDescendants(list, categoryId);
  }, [categoriesData, categoryId]);
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
        if (!itemCat || !categoryIds?.has(String(itemCat))) return false;
      }
      if (searchText && searchText.length > 0) {
        const hay = `${it.title ?? ""} ${it.description ?? ""}`.toLowerCase();
        if (!hay.includes(searchText.toLowerCase())) return false;
      }
      return true;
    });
  }, [allItems, id, type, categoryId, categoryIds, searchText]);
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
    type ? `${t("typeLabel")} ${type}` : null,
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
    } catch {}
  }, [allItems, id, searchText]);

  return (
    <div
      className="relative space-y-[var(--space-section)] app-shell-page"
      ref={ptrRef}
      data-app-page="listings"
    >
      <OrbField intensity={0.18} className="fixed inset-0 -z-10" />
      {/* Hero */}
      <HomeHero />
      {/* Stories bar */}
      <StoriesBarSelector />
      {/* Hidden listings slider */}
      <HiddenListingsSlider items={allItems} />
      {/* Promo banner placed in listings page (before global Partners section) */}
      <ListingsPromoBanner />
      <motion.div
        aria-hidden={!pulling}
        initial={false}
        animate={{ height: pulling ? distance : 0 }}
        transition={pulling ? { duration: 0 } : { duration: duration.base, ease: ease.out }}
        className="sticky top-0 z-10 flex flex-col items-center justify-end overflow-hidden"
      >
        <motion.span animate={{ rotate: distance * 3 }} transition={{ duration: 0 }}>
          <RefreshCw className="size-4 text-primary" aria-hidden />
        </motion.span>
        <div className="mt-1 app-text-micro tracking-wide font-medium text-muted-foreground">
          {distance > 75 ? t("releaseToRefresh") : t("pullToRefresh")}
        </div>
      </motion.div>
      <section
        id="listings"
        ref={listingsAnchorRef}
        className="app-shell-card overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl"
        aria-labelledby="listings-heading"
      >
        <div className="border-b border-border/60 p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="listings-heading"
                className="app-text-heading font-semibold tracking-tight"
              >
                {t("listings")}
              </h2>
              <p
                className="mt-1 app-text-body text-muted-foreground"
                aria-live="polite"
              >
                {isLoading ? t("loading") : `${total} ${t(resultsLabelKey(total, activeFilters.length > 0))}`}
              </p>
            </div>
            {activeFilters.length > 0 && (
              <div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:justify-end">
                <SlidersHorizontal className="size-3.5 shrink-0 text-muted-foreground" />
                <AnimatePresence initial={false} mode="popLayout">
                  {activeFilters.map((filter) => (
                    <motion.span
                      key={filter}
                      layout
                      variants={swap}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="shrink-0 rounded-full border border-primary/15 bg-primary/8 px-2.5 py-1 app-text-caption font-medium text-primary"
                    >
                      {filter}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          <FiltersBar />
        </div>

        <div className="p-3 sm:p-4 lg:p-5">
          {error && (
            <div
              role="alert"
              className="mb-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">
                <CloudOff className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
                <div>
                  <p className="font-semibold text-destructive">
                    {t("listingsLoadError")}
                  </p>
                  <p className="mt-1 app-text-caption text-muted-foreground">
                    {error.message}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                LeftIcon={RefreshCw}
                onClick={() => void refetch()}
              >
                {t("tryAgain")}
              </Button>
            </div>
          )}
          {/* Grid is always rendered — skeletons occupy the same space as cards
            while data loads so there is no layout shift when content arrives. */}
          <div className={LISTING_GRID_CLASS}>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm"
                  >
                    <div className="relative aspect-[3/2]">
                      <Skeleton className="absolute inset-0 rounded-none" />
                      <Skeleton className="absolute left-1.5 top-1.5 h-5 w-14 rounded-full" />
                      <Skeleton className="absolute bottom-1.5 right-1.5 h-5 w-14 rounded-md" />
                    </div>
                    <div className="space-y-1.5 p-2 sm:p-2.5">
                      <Skeleton className="h-4 w-4/5 rounded-lg" />
                      <Skeleton className="h-3 w-full rounded-lg" />
                      <Skeleton className="h-3 w-2/5 rounded-lg" />
                      <div className="flex items-center gap-1 border-t border-border/50 pt-2">
                        <Skeleton className="h-7 flex-1 rounded-md" />
                        <Skeleton className="size-7 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))
              : !error &&
                (items.length === 0 ? (
                  <Reveal className="col-span-full grid min-h-72 place-items-center rounded-[1.35rem] border border-dashed border-border bg-muted/15 p-6 text-center">
                    <div>
                      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <SearchX className="size-5" aria-hidden />
                      </span>
                      <h3 className="mt-4 app-text-heading-sm font-semibold">
                        {t("noListingsFound")}
                      </h3>
                      <p className="mx-auto mt-2 max-w-md app-text-body text-muted-foreground">
                        {t("broaderSearchHint")}
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        LeftIcon={RotateCcw}
                        className="mt-4"
                        onClick={() => router.push(pathname)}
                      >
                        {t("clearFilters")}
                      </Button>
                    </div>
                  </Reveal>
                ) : (
                  <>
                    {pageItems.map((item, idx) => {
                      // Mobile: ads after 3rd & 6th only (not after last 3).
                      // md+: ads after first two complete grid rows.
                      // 3rd ad lives after Partners in app-shell.
                      const adIndex = isMobileViewport
                        ? idx === 2
                          ? 0
                          : idx === 5
                            ? 1
                            : null
                        : (idx + 1) % numCols === 0 &&
                            Math.floor(idx / numCols) < 2
                          ? Math.floor(idx / numCols)
                          : null;
                      return (
                        <Fragment key={item.id}>
                          <ListingCardSelector
                            listing={item}
                            cleanImageOverlayOnEngage
                            priority={
                              current === 1 && idx < Math.min(2, numCols)
                            }
                          />
                          {adIndex != null ? (
                            <AdPlaceholder
                              key={`ad-slot-${adIndex}`}
                              index={adIndex}
                              className="col-span-full"
                            />
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </>
                ))}
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
    <nav
      aria-label={t("pagination")}
      className={`mt-4 flex items-center justify-center gap-[var(--space-gap)] transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
    >
      <Tooltip content={t("prev")} side="top">
        <Button
          variant="accent"
          size="sm"
          className="min-h-10"
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
              <Tooltip
                content={`${t("page")} ${p}`}
                side="top"
              >
                <motion.button
                  type="button"
                  whileTap={tapPress}
                  onClick={() => set(p)}
                  className={
                    p === page
                      ? "relative isolate min-w-10 px-3 min-h-10 rounded-xl border border-primary/35 font-semibold text-primary-foreground tabular-nums"
                      : "relative isolate min-w-10 px-3 min-h-10 rounded-xl border border-border bg-accent text-accent-foreground tabular-nums transition-colors hover:border-primary/40 hover:text-primary"
                  }
                  aria-current={p === page ? "page" : undefined}
                >
                  {p === page && (
                    <motion.span
                      layoutId="listings-page-indicator"
                      transition={spring.indicator}
                      className="absolute inset-0 -z-10 rounded-[inherit] bg-primary"
                      aria-hidden
                    />
                  )}
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
          className="min-h-10"
          onClick={() => page < pageCount && set(page + 1)}
          disabled={page >= pageCount || isPending}
        >
          {t("next")}
        </Button>
      </Tooltip>
    </nav>
  );
}
