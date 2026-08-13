"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  ShieldCheck,
  Star,
  Tag,
} from "lucide-react";
import { ListingCard, type Listing } from "@/components/ui/listing-card";
import { Skeleton } from "@/components/skeletons/SkeletonPrimitives";
import { Tooltip } from "@/components/ui/tooltip";
import { useApiGet } from "@/lib/api-hooks";
import { useEngagedAutoplay } from "@/hooks/use-engaged-autoplay";

type SliderTab = "related" | "top" | "promoted";

function chunk<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function RelatedListingsSkeleton({ title }: { title: string }) {
  return (
    <section className="mt-10 rounded-[1.75rem] border border-border/60 bg-card/75 p-4 sm:p-5 lg:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-7 w-48 rounded-xl" />
          <span className="sr-only">{title}</span>
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-10 rounded-xl" />
          <Skeleton className="size-10 rounded-xl" />
        </div>
      </div>
      <div className="grid gap-[var(--space-gap)] sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[1.35rem] border border-border/60">
            <Skeleton className="aspect-[3/2] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RelatedListingsSlider({
  categoryId,
  currentId,
  limit = 12,
  title = "More worth exploring",
}: {
  categoryId?: string | number | null;
  currentId: string | number;
  limit?: number;
  title?: string;
}) {
  const { data, isLoading, error } = useApiGet<Listing[] | Listing>(
    ["listings", "all"],
    "/listings",
  );

  const all = useMemo(
    () => (Array.isArray(data) ? data : data ? [data] : []),
    [data],
  );

  const buckets = useMemo(() => {
    const candidates = all.filter(
      (listing) => String(listing.id) !== String(currentId),
    );
    const related = categoryId
      ? candidates
          .filter((listing) => {
            const candidateId = listing.categoryId ?? listing.category?.id;
            return candidateId != null && String(candidateId) === String(categoryId);
          })
          .slice(0, limit)
      : [];
    const top = [...candidates]
      .filter((listing) => typeof listing.averageRating === "number")
      .sort((left, right) =>
        (right.averageRating ?? 0) - (left.averageRating ?? 0),
      )
      .slice(0, limit);
    const promoted = candidates
      .filter((listing) => {
        const visibility = String(listing.contactVisibility ?? "").toUpperCase();
        return listing.promoted === true || (visibility && visibility !== "SHOW_SELLER");
      })
      .slice(0, limit);

    return { related, top, promoted };
  }, [all, categoryId, currentId, limit]);

  if (isLoading) return <RelatedListingsSkeleton title={title} />;
  if (error) return null;
  if (!buckets.related.length && !buckets.top.length && !buckets.promoted.length) {
    return null;
  }

  return <RelatedCarousel buckets={buckets} title={title} />;
}

function RelatedCarousel({
  buckets,
  title,
}: {
  buckets: Record<SliderTab, Listing[]>;
  title: string;
}) {
  const firstTab: SliderTab = buckets.related.length
    ? "related"
    : buckets.top.length
      ? "top"
      : "promoted";
  const [activeTab, setActiveTab] = useState<SliderTab>(firstTab);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [pageSize, setPageSize] = useState(1);
  const intervalRef = useRef<number | null>(null);
  const { isEngaged, engagementProps } = useEngagedAutoplay();
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      setPageSize(width >= 1280 ? 4 : width >= 1024 ? 3 : width >= 640 ? 2 : 1);
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const activeItems = buckets[activeTab].length
    ? buckets[activeTab]
    : buckets.related.length
      ? buckets.related
      : buckets.top.length
        ? buckets.top
        : buckets.promoted;
  const pages = useMemo(
    () => chunk(activeItems, pageSize),
    [activeItems, pageSize],
  );
  const safePage = Math.min(page, Math.max(0, pages.length - 1));

  useEffect(() => {
    setPage(0);
  }, [activeTab, pageSize]);

  const next = useCallback(() => {
    setDirection(1);
    setPage((current) => (current + 1) % Math.max(1, pages.length));
  }, [pages.length]);

  const previous = useCallback(() => {
    setDirection(-1);
    setPage(
      (current) =>
        (current - 1 + Math.max(1, pages.length)) % Math.max(1, pages.length),
    );
  }, [pages.length]);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (isEngaged || reducedMotion || pages.length <= 1) return;

    intervalRef.current = window.setInterval(next, 6200);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isEngaged, next, pages.length, reducedMotion]);

  const tabs: Array<{
    id: SliderTab;
    label: string;
    count: number;
    icon: typeof Tag;
  }> = [
    { id: "related", label: "Similar", count: buckets.related.length, icon: Tag },
    { id: "top", label: "Top rated", count: buckets.top.length, icon: Star },
    { id: "promoted", label: "Promoted", count: buckets.promoted.length, icon: ShieldCheck },
  ];

  return (
    <section
      className="relative isolate mt-10 overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur-xl sm:p-5 lg:p-6"
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") previous();
      }}
      {...engagementProps}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_100%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)]" />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 inline-flex items-center gap-1.5 app-text-micro font-semibold uppercase tracking-[0.12em] text-primary">
            <Compass className="size-3.5" /> Continue discovering
          </div>
          <h2 className="app-text-heading font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 app-text-body text-muted-foreground">
            Compare similar, highly rated, and promoted marketplace offers.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-border/60 bg-background/65 p-1 no-scrollbar" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  disabled={tab.count === 0}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 app-text-caption font-semibold transition-colors disabled:pointer-events-none disabled:opacity-35 ${
                    selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="related-listing-tab"
                      className="absolute inset-0 rounded-lg border border-border/60 bg-card shadow-sm"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    <Icon className="size-3.5" /> {tab.label}
                    <span className="rounded-full bg-muted px-1.5 py-0.5 app-text-micro tabular-nums">
                      {tab.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Tooltip content="Previous" side="bottom">
              <button
                type="button"
                aria-label="Previous listings"
                disabled={pages.length <= 1}
                onClick={previous}
                className="grid size-10 place-items-center rounded-xl border border-border bg-background/75 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
            </Tooltip>
            <Tooltip content="Next" side="bottom">
              <button
                type="button"
                aria-label="Next listings"
                disabled={pages.length <= 1}
                onClick={next}
                className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-border/60 bg-background/55 p-3 sm:p-4">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${activeTab}-${safePage}-${pageSize}`}
            initial={{ opacity: 0, x: direction > 0 ? 44 : -44 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -44 : 44 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-stretch gap-[var(--space-gap)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 app-density-grid-gap"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_event, info: PanInfo) => {
              if (info.offset.x < -70 || info.velocity.x < -550) next();
              if (info.offset.x > 70 || info.velocity.x > 550) previous();
            }}
          >
            {(pages[safePage] ?? []).map((listing) => (
              <ListingCard key={listing.id} listing={listing} cleanImageOverlayOnEngage />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="app-text-caption text-muted-foreground">
          {activeItems.length} {activeItems.length === 1 ? "recommendation" : "recommendations"}
        </span>
        <div className="flex items-center gap-1.5">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setDirection(index > safePage ? 1 : -1);
                setPage(index);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === safePage
                  ? "w-6 bg-primary"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
        <button
          type="button"
          onClick={previous}
          disabled={pages.length <= 1}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background/75 app-text-label font-semibold disabled:opacity-40"
        >
          <ChevronLeft className="size-4" /> Previous
        </button>
        <button
          type="button"
          onClick={next}
          disabled={pages.length <= 1}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary app-text-label font-semibold text-primary-foreground disabled:opacity-40"
        >
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

export default RelatedListingsSlider;
