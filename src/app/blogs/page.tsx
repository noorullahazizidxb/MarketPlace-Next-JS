"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useApiGet } from "@/lib/api-hooks";
import BlogCard from "@/components/blogs/BlogCard";
import { BlogCardSkeleton } from "@/components/blogs/BlogCardSkeleton";
import { useAuth } from "@/lib/use-auth";
import BlogViewer from "@/components/blogs/BlogViewer";
import { useLanguage } from "@/components/providers/language-provider";
import { BlogHero } from "@/components/blogs/BlogHero";
import StoriesBar from "@/components/stories/StoriesBar";
import { HiddenListingsSlider } from "@/components/listings/HiddenListingsSlider";
import ListingsPromoBanner from "@/components/ui/listings-promo-banner";
import { RelatedListingsSlider } from "@/components/listings/RelatedListingsSlider";
import { config as appConfig } from "@/lib/config";
import { filterBlogsByQuery } from "@/lib/search-utils";

// Pre-defined skeleton rows that mirror the complex 2 / 3 / wide layout pattern.
const SKELETON_ROWS = [
  {
    type: "two" as const, skeletons: [
      { id: "sk1", imageHeightClass: "h-64 md:h-80 lg:h-96" },
      { id: "sk2", imageHeightClass: "h-64 md:h-80 lg:h-96" },
    ]
  },
  {
    type: "three" as const, skeletons: [
      { id: "sk3", imageHeightClass: undefined },
      { id: "sk4", imageHeightClass: undefined },
      { id: "sk5", imageHeightClass: undefined },
    ]
  },
  {
    type: "wide" as const, skeletons: [
      { id: "sk6", imageHeightClass: "h-72 md:h-[22rem] lg:h-[26rem]" },
      { id: "sk7", imageHeightClass: undefined },
    ]
  },
];

export default function BlogsPage() {
  const [q, setQ] = React.useState("");
  const [submittedQuery, setSubmittedQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(9);
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
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<any | null>(null);
  const onOpen = (blog: any) => {
    setActive(blog);
    setOpen(true);
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
          // ----- Skeleton grid (same structure as real content) -----
          SKELETON_ROWS.map((row) => {
            if (row.type === "two") {
              return (
                <div key={row.type} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {row.skeletons.map((sk) => (
                    <BlogCardSkeleton key={sk.id} imageHeightClass={sk.imageHeightClass} />
                  ))}
                </div>
              );
            }
            if (row.type === "three") {
              return (
                <div key={row.type} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {row.skeletons.map((sk) => (
                    <BlogCardSkeleton key={sk.id} imageHeightClass={sk.imageHeightClass} />
                  ))}
                </div>
              );
            }
            // wide
            return (
              <div key={row.type} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {row.skeletons.map((sk, j) => (
                  <div key={sk.id} className={j === 0 ? "sm:col-span-2" : "sm:col-span-1"}>
                    <BlogCardSkeleton imageHeightClass={sk.imageHeightClass} />
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          // ----- Real content grid -----
          (() => {
            const rows: { type: "two" | "three" | "wide"; items: any[] }[] = [];
            const list = pagedBlogs || [];
            let i = 0;
            let patternIdx = 0; // 0 -> two, 1 -> three, 2 -> wide
            while (i < list.length) {
              const type =
                patternIdx === 0 ? "two" : patternIdx === 1 ? "three" : "wide";
              const take = type === "two" ? 2 : type === "three" ? 3 : 2;
              rows.push({ type: type as any, items: list.slice(i, i + take) });
              i += take;
              patternIdx = (patternIdx + 1) % 3;
            }
            return rows.map((row, idx) => {
              if (row.type === "two") {
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {row.items.map((b: any) => (
                      <BlogCard
                        key={b.id}
                        blog={b}
                        onOpen={onOpen}
                        variant="overlay"
                        imageHeightClass="h-64 md:h-80 lg:h-96"
                        countOverride={countOverrides[String(b.id)]}
                        onCountsChange={updateBlogCounts}
                      />
                    ))}
                  </div>
                );
              }
              if (row.type === "three") {
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {row.items.map((b: any) => (
                      <BlogCard
                        key={b.id}
                        blog={b}
                        onOpen={onOpen}
                        countOverride={countOverrides[String(b.id)]}
                        onCountsChange={updateBlogCounts}
                      />
                    ))}
                  </div>
                );
              }
              // wide
              return (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {row.items.map((b: any, j: number) => (
                    <div
                      key={b.id}
                      className={j === 0 ? "sm:col-span-2" : "sm:col-span-1"}
                    >
                      <BlogCard
                        blog={b}
                        onOpen={onOpen}
                        variant={j === 0 ? "overlay" : "default"}
                        imageHeightClass={
                          j === 0 ? "h-72 md:h-[22rem] lg:h-[26rem]" : undefined
                        }
                        countOverride={countOverrides[String(b.id)]}
                        onCountsChange={updateBlogCounts}
                      />
                    </div>
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
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="h-10 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 pr-8 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))/0.35]"
                  aria-label="Blog page size"
                >
                  {[6, 9, 12, 18].map((size) => (
                    <option key={size} value={size}>
                      {size} {t("perPage") || "per page"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-10 rounded-xl border border-[hsl(var(--border))] px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[hsl(var(--muted))]"
              >
                {t("prev") || "Previous"}
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const active = currentPage === pageNumber;
                return (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-medium transition-colors ${active
                      ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))/0.2] text-[hsl(var(--accent))]"
                      : "border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

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
            </div>
          </div>
        )}
      </div>
      {/* Related listings slider (placed before the partners section in layout) */}
      {Array.isArray(listingsData) && listingsData.length > 0 && (
        <RelatedListingsSlider currentId={0} />
      )}

      <BlogViewer
        open={open}
        blog={
          active
            ? {
              ...active,
              counts: {
                ...(active.counts || {}),
                ...(countOverrides[String(active.id)] || {}),
              },
            }
            : active
        }
        onClose={() => setOpen(false)}
        onCountsChange={updateBlogCounts}
      />
    </div>
  );
}
