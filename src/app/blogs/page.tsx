"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SearchX,
  Sparkles,
} from "lucide-react";
import BlogCard, { type Blog } from "@/components/blogs/BlogCard";
import { BlogCardSkeleton } from "@/components/blogs/BlogCardSkeleton";
import { BlogHero } from "@/components/blogs/BlogHero";
import { HiddenListingsSlider } from "@/components/listings/HiddenListingsSlider";
import { RelatedListingsSlider } from "@/components/listings/RelatedListingsSlider";
import StoriesBar from "@/components/stories/StoriesBar";
import { Button } from "@/components/ui/button";
import ListingsPromoBanner from "@/components/ui/listings-promo-banner";
import { Tooltip } from "@/components/ui/tooltip";
import { useLanguage } from "@/components/providers/language-provider";
import { useApiGet } from "@/lib/api-hooks";
import { config as appConfig } from "@/lib/config";
import { filterBlogsByQuery } from "@/lib/search-utils";
import { useAuth } from "@/lib/use-auth";

type CountPatch = { likes?: number; shares?: number; comments?: number };

function getResponsivePageSize() {
  if (typeof window === "undefined") return 12;
  if (window.innerWidth >= 1536) return 14;
  if (window.innerWidth >= 1280) return 12;
  if (window.innerWidth >= 768) return 10;
  return 8;
}

function visiblePages(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page > 0 && page <= total).sort((a, b) => a - b);
}

export default function BlogsPage() {
  const [query, setQuery] = React.useState("");
  const [submittedQuery, setSubmittedQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(12);
  const [countOverrides, setCountOverrides] = React.useState<Record<string, CountPatch>>({});
  const elasticSearchEnabled = appConfig.elasticSearchEnabled;
  const effectiveQuery = elasticSearchEnabled ? submittedQuery.trim() : query.trim();
  const deferredQuery = React.useDeferredValue(effectiveQuery);
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const {
    data: blogData,
    isLoading,
    error,
    refetch,
  } = useApiGet<Blog[] | Blog>(
    ["blogs", deferredQuery, elasticSearchEnabled ? "elastic" : "local"],
    "/blogs",
    elasticSearchEnabled && deferredQuery ? { q: deferredQuery } : undefined,
  );
  const { data: listingData } = useApiGet(["listings", "all"], "/listings");
  const blogs = React.useMemo(
    () => (Array.isArray(blogData) ? blogData : blogData ? [blogData] : []),
    [blogData],
  );
  const listings = React.useMemo(
    () => (Array.isArray(listingData) ? listingData : listingData ? [listingData] : []),
    [listingData],
  );

  const filtered = React.useMemo(() => {
    if (elasticSearchEnabled) return blogs;
    return filterBlogsByQuery(blogs, submittedQuery || query) as Blog[];
  }, [blogs, elasticSearchEnabled, query, submittedQuery]);

  const suggestions = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    const titles = Array.from(
      new Set(blogs.map((blog) => blog.title.trim()).filter(Boolean)),
    );
    return titles
      .filter((title) => !term || title.toLowerCase().includes(term))
      .slice(0, 5);
  }, [blogs, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedBlogs = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered, pageSize]);
  const featuredBlogs = pagedBlogs.slice(0, Math.min(2, pagedBlogs.length));
  const latestBlogs = pagedBlogs.slice(featuredBlogs.length);

  React.useEffect(() => {
    const updatePageSize = () => setPageSize(getResponsivePageSize());
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  React.useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, pageSize]);

  const updateBlogCounts = React.useCallback((blogId: string, patch: CountPatch) => {
    setCountOverrides((previous) => ({
      ...previous,
      [blogId]: { ...previous[blogId], ...patch },
    }));
  }, []);

  const openBlog = React.useCallback(
    (blog: Blog) => router.push(`/blogs/${blog.id}`),
    [router],
  );

  const runSearch = React.useCallback(() => {
    setSubmittedQuery(query.trim());
    setCurrentPage(1);
  }, [query]);

  return (
    <div className="app-shell-page space-y-[var(--space-section)]" data-app-page="blogs">
      <BlogHero
        value={query}
        onChange={setQuery}
        onSubmit={runSearch}
        suggestions={suggestions}
        canCreate
        onCreate={() => router.push(user ? "/blogs/create" : "/sign-in")}
        resultCount={filtered.length}
      />

      <StoriesBar />

      {listings.length > 0 && <HiddenListingsSlider items={listings} />}

      <ListingsPromoBanner />

      <section
        className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl"
        aria-labelledby="stories-heading"
      >
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5 lg:p-6">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 app-text-caption font-semibold uppercase tracking-[0.12em] text-primary">
              <BookOpen className="size-3.5" /> Ideas and field notes
            </div>
            <h2 id="stories-heading" className="app-text-heading font-semibold tracking-tight">
              Latest stories
            </h2>
            <p className="mt-1 app-text-body text-muted-foreground" aria-live="polite">
              {isLoading
                ? t("loading")
                : `${filtered.length} ${filtered.length === 1 ? "story" : "stories"}${query.trim() ? ` matching “${query.trim()}”` : " from the community"}`}
            </p>
          </div>
          {!isLoading && filtered.length > 0 && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 app-text-caption font-semibold text-primary">
              <Sparkles className="size-3.5" /> Fresh perspectives
            </span>
          )}
        </div>

        <div className="space-y-5 p-3 sm:p-4 lg:p-5">
          {error && (
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-destructive">Unable to load stories</p>
                <p className="mt-1 app-text-caption text-muted-foreground">
                  {String((error as Error).message || error)}
                </p>
              </div>
              <Button variant="secondary" size="sm" LeftIcon={RefreshCw} onClick={() => void refetch()}>
                Try again
              </Button>
            </div>
          )}

          {isLoading ? (
            <>
              <div className="grid gap-[var(--space-gap)] lg:grid-cols-2">
                <BlogCardSkeleton variant="overlay" />
                <BlogCardSkeleton variant="overlay" />
              </div>
              <div className="grid items-stretch gap-[var(--space-gap)] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </div>
            </>
          ) : !error && filtered.length === 0 ? (
            <div className="grid min-h-72 place-items-center rounded-[1.35rem] border border-dashed border-border bg-muted/15 p-6 text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                  <SearchX className="size-5" />
                </span>
                <h3 className="mt-4 app-text-heading-sm font-semibold">
                  {query.trim() ? t("noResults") || "No results" : t("noBlogsYet")}
                </h3>
                <p className="mx-auto mt-2 max-w-md app-text-body text-muted-foreground">
                  {query.trim()
                    ? "Try a shorter phrase or explore the latest community stories."
                    : "New stories will appear here as the community publishes them."}
                </p>
                {query.trim() && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setQuery("");
                      setSubmittedQuery("");
                    }}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {featuredBlogs.length > 0 && (
                <div className={`grid gap-[var(--space-gap)] ${featuredBlogs.length > 1 ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                  {featuredBlogs.map((blog, index) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      variant="overlay"
                      onOpen={openBlog}
                      countOverride={countOverrides[String(blog.id)]}
                      onCountsChange={updateBlogCounts}
                      isPriority={currentPage === 1 && index === 0}
                    />
                  ))}
                </div>
              )}

              {latestBlogs.length > 0 && (
                <div className="grid items-stretch gap-[var(--space-gap)] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {latestBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onOpen={openBlog}
                      countOverride={countOverrides[String(blog.id)]}
                      onCountsChange={updateBlogCounts}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 app-text-caption text-muted-foreground">
                Stories per page
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="min-h-10 rounded-xl border border-border bg-background px-3 app-text-label font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                >
                  {[8, 10, 12, 14, 16].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </label>

              <nav className="flex items-center gap-1.5" aria-label="Blog pagination">
                <Tooltip content={t("prev") || "Previous"} side="top">
                  <button
                    type="button"
                    aria-label={t("prev") || "Previous"}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="grid size-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:border-primary/30 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                </Tooltip>

                {visiblePages(currentPage, totalPages).map((pageNumber, index, pages) => {
                  const previous = pages[index - 1];
                  return (
                    <React.Fragment key={pageNumber}>
                      {previous != null && pageNumber - previous > 1 && (
                        <span className="px-1 text-muted-foreground">…</span>
                      )}
                      <button
                        type="button"
                        aria-current={pageNumber === currentPage ? "page" : undefined}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`min-h-10 min-w-10 rounded-xl border px-2 app-text-label font-semibold transition-colors ${
                          pageNumber === currentPage
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-primary/30 hover:bg-primary/5"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </React.Fragment>
                  );
                })}

                <Tooltip content={t("next") || "Next"} side="top">
                  <button
                    type="button"
                    aria-label={t("next") || "Next"}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </Tooltip>
              </nav>
            </div>
          )}
        </div>
      </section>

      {listings.length > 0 && (
        <RelatedListingsSlider
          currentId={0}
          title="Marketplace picks for curious readers"
        />
      )}
    </div>
  );
}
