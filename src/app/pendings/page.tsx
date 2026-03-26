"use client";
import { useState, useMemo } from "react";
import { usePendingListings } from "@/lib/use-pending-listings";
import { usePendingBlogs } from "@/lib/use-pending-blogs";
import { useApiMutation } from "@/lib/api-hooks";
import { ApprovalCard } from "@/components/ui/approval-card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { asset } from "@/lib/assets";
import Image from "next/image";
import { ImageSpinner } from "@/components/ui/spinner";
import Link from "next/link";

type Tab = "listings" | "blogs";

function PendingBlogCard({
  blog,
  onApproved,
  onRejected,
}: {
  blog: any;
  onApproved: (id: string) => void;
  onRejected: (id: string) => void;
}) {
  const { t } = useLanguage();
  const approve = useApiMutation("post", `/blogs/${blog.id}/approve`);
  const reject = useApiMutation("post", `/blogs/${blog.id}/reject`);

  const cover = blog?.images?.[0]
    ? asset(typeof blog.images[0] === "string" ? blog.images[0] : blog.images[0]?.url)
    : blog?.image
      ? asset(blog.image)
      : null;

  const authorName =
    blog?.author?.fullName || blog?.author?.name || blog?.author?.email || "—";
  const authorPhoto = blog?.author?.photo ? asset(blog.author.photo) : null;
  const authorId = blog?.author?.id || blog?.authorId || blog?.userId;
  const createdAt = blog?.createdAt ? new Date(blog.createdAt) : null;

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({});
      onApproved(String(blog.id));
    } catch { }
  };

  const handleReject = async () => {
    try {
      await reject.mutateAsync({});
      onRejected(String(blog.id));
    } catch { }
  };

  const [coverLoaded, setCoverLoaded] = useState(false);

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden flex flex-col">
      {cover && (
        <div className="relative h-44 w-full bg-[hsl(var(--muted))]">
          {!coverLoaded && <ImageSpinner />}
          <Image
            src={cover}
            alt={blog.title || "blog"}
            fill
            className={`object-cover transition-opacity duration-300 ${coverLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setCoverLoaded(true)}
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-base line-clamp-2">{blog.title}</h3>
        {blog.content && (
          <p className="text-sm subtle line-clamp-3 whitespace-pre-line">{blog.content}</p>
        )}

        <div className="flex items-center gap-2 mt-auto text-xs subtle">
          {authorPhoto ? (
            <Image
              src={authorPhoto}
              alt={authorName}
              width={24}
              height={24}
              className="rounded-full object-cover size-6"
            />
          ) : (
            <span className="size-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-[10px] font-bold uppercase">
              {authorName[0]}
            </span>
          )}
          <Link
            href={authorId ? `/profile/${authorId}` : "#"}
            className="hover:underline font-medium"
            onClick={(e) => { if (!authorId) e.preventDefault(); }}
          >
            {authorName}
          </Link>
          {createdAt && (
            <span className="ml-auto">
              {createdAt.toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1"
            variant="accent"
            size="sm"
            onClick={handleApprove}
            disabled={approve.isPending || reject.isPending}
          >
            {approve.isPending ? "…" : t("pendingsBlogApprove")}
          </Button>
          <Button
            className="flex-1"
            variant="secondary"
            size="sm"
            onClick={handleReject}
            disabled={approve.isPending || reject.isPending}
          >
            {reject.isPending ? "…" : t("pendingsBlogReject")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PendingsPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>("listings");

  // ── Listings tab state ──────────────────────────────────────────────
  const { listings, loading: listingsLoading, error: listingsError, refresh: refreshListings, connected: listingsConnected } =
    usePendingListings();
  const emitAllListings = useApiMutation("post", "/listings/for-approval/emit-all");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | "all">("all");

  const filteredListings = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return listings.filter((l: any) => {
      const byQ =
        !ql ||
        [l.title, l.description, l.user?.name, l.user?.email]
          .filter(Boolean)
          .some((s) => String(s).toLowerCase().includes(ql));
      const byCat = category === "all" || l.category?.name === category;
      return byQ && byCat;
    });
  }, [listings, q, category]);

  // ── Blogs tab state ─────────────────────────────────────────────────
  const { blogs, loading: blogsLoading, error: blogsError, refresh: refreshBlogs, connected: blogsConnected } =
    usePendingBlogs();
  const [localBlogs, setLocalBlogs] = useState<any[] | null>(null);
  const emitAllBlogs = useApiMutation("post", "/blogs/pending/emit-all");

  const displayBlogs = localBlogs ?? blogs;

  const handleBlogApproved = (id: string) => {
    setLocalBlogs((prev) => (prev ?? blogs).filter((b: any) => String(b.id) !== id));
  };
  const handleBlogRejected = (id: string) => {
    setLocalBlogs((prev) => (prev ?? blogs).filter((b: any) => String(b.id) !== id));
  };

  const { t } = useLanguage();

  const tabClass = (tab: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-xl transition-colors ${activeTab === tab
      ? "bg-[hsl(var(--accent))] text-white"
      : "bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/70"
    }`;

  return (
    <div className="min-h-screen p-6">
      <div className="glass rounded-2xl p-6 border border-[hsl(var(--border))] w-full max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">{t("pendingsHeading")}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs subtle mr-3">
              {(activeTab === "listings" ? listingsConnected : blogsConnected)
                ? t("pendingsSocketConnected")
                : t("pendingsSocketDisconnected")}
            </span>
            {activeTab === "listings" ? (
              <>
                <Button onClick={refreshListings} className="mr-2">
                  {t("pendingsRefresh")}
                </Button>
                <Button
                  onClick={() => emitAllListings.mutate({})}
                  disabled={emitAllListings.isPending}
                  title={t("pendingsEmitAllTitle")}
                >
                  {t("pendingsEmitAll")}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={refreshBlogs} className="mr-2">
                  {t("pendingsRefresh")}
                </Button>
                <Button
                  onClick={() => emitAllBlogs.mutate({})}
                  disabled={emitAllBlogs.isPending}
                  title={t("pendingsBlogsEmitAllTitle")}
                >
                  {t("pendingsBlogsEmitAll")}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2">
          <button className={tabClass("listings")} onClick={() => setActiveTab("listings")}>
            {t("pendingsTabListings")}
          </button>
          <button className={tabClass("blogs")} onClick={() => setActiveTab("blogs")}>
            {t("pendingsTabBlogs")}
          </button>
        </div>

        {/* ── Listings tab ── */}
        {activeTab === "listings" && (
          <>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("pendingsSearchPlaceholder")}
                className="h-10 rounded-xl px-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
              />
              <select
                aria-label={t("pendingsFilterAllCategories")}
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="h-10 rounded-xl px-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))]"
              >
                <option value="all">{t("pendingsFilterAllCategories")}</option>
                {Array.from(
                  new Set(
                    listings.map((l: any) => l.category?.name).filter(Boolean)
                  )
                ).map((c: any) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              {listingsLoading && (
                <div className="subtle">{t("pendingsLoading")}</div>
              )}
              {listingsError && (
                <div className="text-red-400">{t("pendingsLoadFailed")}</div>
              )}
              {!listingsLoading && filteredListings.length === 0 && (
                <div className="subtle">{t("pendingsEmpty")}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
                {filteredListings.map((l: any) => (
                  <ApprovalCard
                    key={l.id}
                    listing={l}
                    onApproved={() => refreshListings()}
                    onRejected={() => refreshListings()}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Blogs tab ── */}
        {activeTab === "blogs" && (
          <div className="mt-6">
            {blogsLoading && (
              <div className="subtle">{t("pendingsBlogsLoading")}</div>
            )}
            {blogsError && (
              <div className="text-red-400">{t("pendingsBlogsLoadFailed")}</div>
            )}
            {!blogsLoading && displayBlogs.length === 0 && (
              <div className="subtle">{t("pendingsBlogsEmpty")}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayBlogs.map((b: any) => (
                <PendingBlogCard
                  key={b.id}
                  blog={b}
                  onApproved={handleBlogApproved}
                  onRejected={handleBlogRejected}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

