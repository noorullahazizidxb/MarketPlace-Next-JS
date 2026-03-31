"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useApiGet } from "@/lib/api-hooks";
import BlogCard from "@/components/blogs/BlogCard";
import { BlogCardSkeleton } from "@/components/blogs/BlogCardSkeleton";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { BlogHero } from "@/components/blogs/BlogHero";
import StoriesBar from "@/components/stories/StoriesBar";
import { HiddenListingsSlider } from "@/components/listings/HiddenListingsSlider";
import ListingsPromoBanner from "@/components/ui/listings-promo-banner";
import { RelatedListingsSlider } from "@/components/listings/RelatedListingsSlider";
import { config as appConfig } from "@/lib/config";
import { filterBlogsByQuery } from "@/lib/search-utils";
import { Tooltip } from "@/components/ui/tooltip";

// Skeleton: uniform 4-col grid
const SKELETON_COUNT = 12;

export default function BlogsPage() {
  const [q, setQ] = React.useState("");
  const [submittedQuery, setSubmittedQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  // Responsive default page size: more blogs on wider screens
  const getResponsivePageSize = () => {
    if (typeof window === "undefined") return 12;
    if (window.innerWidth >= 1536) return 18;  // 2xl
    if (window.innerWidth >= 1280) return 15;  // xl
    if (window.innerWidth >= 1024) return 12;  // lg
    return 9;
  };
  const [pageSize, setPageSize] = React.useState(12); // safe SSR default; updated client-side in effect
  const [countOverrides, setCountOverrides] = React.useState<
    Record<string, { likes?: number; shares?: number; comments?: number }>
  >({});
  const elasticSearchEnabled = appConfig.elasticSearchEnabled;
  const effectiveQuery = elasticSearchEnabled ? submittedQuery.trim() : q.trim();
  const deferredQuery = React.useDeferredValue(effectiveQuery);
  const { data: blogs, isLoading } = useApiGet(
    ["blogs", deferredQuery, elasticSearchEnabled ? "elastic" : "local"],
    "/blogs",
    elasticSearchEnabled && deferredQuery ? { q: deferredQuery } : undefined
  );
  const { data: listingsData } = useApiGet(["listings", "all"], "/listings");
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const onOpen = (blog: any) => {
    router.push(`/blogs/${blog.id}`);
  };
  const filtered = React.useMemo(() => {
    const list = blogs || [];
    if (elasticSearchEnabled) return list;
    return filterBlogsByQuery(list, submittedQuery || q);
  }, [blogs, elasticSearchEnabled, q, submittedQuery]);

  const suggestions = React.useMemo(() => {
    if (!Array.isArray(blogs)) return [];
    const term = q.trim().toLowerCase();
    const pool = blogs
      .map((b: any) => String(b?.title || "").trim())
      .filter(Boolean);
    const unique = Array.from(new Set(pool));
    const filteredTitles = term
      ? unique.filter((title) => title.toLowerCase().includes(term))
      : unique;
    return filteredTitles.slice(0, 5);
  }, [blogs, q]);

  const updateBlogCounts = React.useCallback(
    (
      blogId: string,
      patch: { likes?: number; shares?: number; comments?: number }
    ) => {
      setCountOverrides((prev) => {
        const current = prev[blogId] || {};
        const nextForBlog = {
          ...current,
          ...patch,
        };
        if (
          current.likes === nextForBlog.likes &&
          current.shares === nextForBlog.shares &&
          current.comments === nextForBlog.comments
        ) {
          return prev;
        }
        return {
          ...prev,
          [blogId]: nextForBlog,
        };
      });
    },
    []
  );

  const runSearch = React.useCallback(() => {
    setSubmittedQuery(q.trim());
    setCurrentPage(1);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / pageSize));

  React.useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  // Sync page size to viewport on mount and resize (avoids SSR/hydration mismatch)
  React.useEffect(() => {
    setPageSize(getResponsivePageSize());
    const onResize = () => setPageSize(getResponsivePageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, deferredQuery]);

  const pagedBlogs = React.useMemo(() => {
    const list = filtered || [];
    const start = (currentPage - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <BlogHero
        value={q}
        onChange={setQ}
        onSubmit={runSearch}
        suggestions={suggestions}
        canCreate={true}
        onCreate={() => {
          if (!user) {
            router.push("/sign-in");
            return;
          }
          router.push("/blogs/create");
        }}
        resultCount={filtered?.length ?? 0}
      />
      {/* Reused components from listings page */}
      <StoriesBar />
      {Array.isArray(listingsData) && listingsData.length > 0 && (
        <HiddenListingsSlider items={listingsData as any} />
      )}
      {/* Promotional banners inserted for blogs page */}
      <ListingsPromoBanner />
      {/* Row pattern: 1) two equal, 2) three equal, 3) two with left wide (2/3) + right narrow (1/3) - repeat
          While loading, skeleton placeholders are rendered in the exact same grid structure so
          layout is established immediately and there are no content shifts on data arrival. */}
      <div className="space-y-6">
        {isLoading ? (
          // ----- Skeleton grid (uniform) -----
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <BlogCardSkeleton key={`sk-${i}`} />
            ))}
          </div>
        ) : (
          // ----- Real content: justified grid -----
          // Rows of 2–4 cards. Only the very last row may have 1 card.
          // Cycle: 4 → 3 → 2 for visual variety; if taking N would
          // leave exactly 1 remaining, take N-1 so the next row gets 2.
          (() => {
            const CYCLE = [4, 3, 2];
            const list = pagedBlogs || [];
            const rowSizes: number[] = [];
            let remaining = list.length;
            let ci = 0;

            while (remaining > 4) {
              const want = CYCLE[ci % CYCLE.length];
              if (remaining - want === 1) {
                // Prevent a following single-item row
                rowSizes.push(want - 1);
                remaining -= want - 1;
              } else {
                rowSizes.push(want);
                remaining -= want;
              }
              ci++;
            }
            if (remaining > 0) rowSizes.push(remaining);

            // Build row slices
            let offset = 0;
            const rows = rowSizes.map((size) => {
              const items = list.slice(offset, offset + size);
              offset += size;
              return items;
            });
            return rows.map((items, idx) => {
              const count = items.length;

              // Single card — only possible as last row
              if (count === 1) {
                return (
                  <div key={idx} className="grid grid-cols-1">
                    <BlogCard
                      blog={items[0]}
                      onOpen={onOpen}
                      variant="overlay"
                      imageHeightClass="h-64 md:h-80 lg:h-96"
                      countOverride={countOverrides[String(items[0].id)]}
                      onCountsChange={updateBlogCounts}
                      isPriority={idx === 0}
                    />
                  </div>
                );
              }
              // 2 cards — wider treatment with overlay variant
              if (count === 2) {
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {items.map((b: any) => (
                      <BlogCard
                        key={b.id}
                        blog={b}
                        onOpen={onOpen}
                        variant="overlay"
                        imageHeightClass="h-64 md:h-80 lg:h-96"
                        countOverride={countOverrides[String(b.id)]}
                        onCountsChange={updateBlogCounts}
                        isPriority={idx === 0}
                      />
                    ))}
                  </div>
                );
              }
              // 3 cards
              if (count === 3) {
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((b: any) => (
                      <BlogCard
                        key={b.id}
                        blog={b}
                        onOpen={onOpen}
                        countOverride={countOverrides[String(b.id)]}
                        onCountsChange={updateBlogCounts}
                        isPriority={idx === 0}
                      />
                    ))}
                  </div>
                );
              }
              // 4 cards
              return (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {items.map((b: any) => (
                    <BlogCard
                      key={b.id}
                      blog={b}
                      onOpen={onOpen}
                      countOverride={countOverrides[String(b.id)]}
                      onCountsChange={updateBlogCounts}
                      isPriority={idx === 0}
                    />
                  ))}
                </div>
              );
            });
          })()
        )}
        {!isLoading && (filtered?.length ?? 0) === 0 && (
          <div className="card p-6">
            {q.trim() ? t("noResults") || "No results" : t("noBlogsYet")}
          </div>
        )}

        {!isLoading && (filtered?.length ?? 0) > 0 && (
          <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="subtle">{t("pageSizeLabel") || "Page size"}</span>
              <div className="relative">
                <Tooltip content={t("pageSizeLabel") || "Page size"} side="top">
                  <select
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    className="h-10 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 pr-8 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))/0.35]"
                    aria-label="Blog page size"
                  >
                    {[9, 12, 15, 18, 24].map((size) => (
                      <option key={size} value={size}>
                        {size} {t("perPage") || "per page"}
                      </option>
                    ))}
                  </select>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Tooltip content={t("prev") || "Previous"} side="top">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-10 rounded-xl border border-[hsl(var(--border))] px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[hsl(var(--muted))]"
                >
                  {t("prev") || "Previous"}
                </button>
              </Tooltip>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const active = currentPage === pageNumber;
                return (
                  <Tooltip key={pageNumber} content={`${t("page") || "Page"} ${pageNumber}`} side="top">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-medium transition-colors ${active
                        ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.2] text-[hsl(var(--accent))]"
                        : "border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  </Tooltip>
                );
              })}

              <Tooltip content={t("next") || "Next"} side="top">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-10 rounded-xl border border-[hsl(var(--border))] px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[hsl(var(--muted))]"
                >
                  {t("next") || "Next"}
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
      {/* Related listings slider (placed before the partners section in layout) */}
      {Array.isArray(listingsData) && listingsData.length > 0 && (
        <RelatedListingsSlider currentId={0} />
      )}

    </div>
  );
}
