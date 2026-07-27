"use client";
import { useState, useMemo } from "react";
import { usePendingListings } from "@/lib/use-pending-listings";
import { usePendingBlogs } from "@/lib/use-pending-blogs";
import { useApiMutation } from "@/lib/api-hooks";
import { ApprovalCard } from "@/components/ui/approval-card";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { SelectField } from "@/components/ui/atoms/shadcn/SelectField";
import { Badge } from "@/components/ui/atoms/shadcn/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/atoms/shadcn/tabs";
import { useLanguage } from "@/components/providers/language-provider";
import { asset } from "@/lib/assets";
import Image from "next/image";
import { ImageSpinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Search } from "lucide-react";

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
    ? asset(
        typeof blog.images[0] === "string"
          ? blog.images[0]
          : blog.images[0]?.url,
      )
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
    } catch {}
  };

  const handleReject = async () => {
    try {
      await reject.mutateAsync({});
      onRejected(String(blog.id));
    } catch {}
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
          <p className="text-sm subtle line-clamp-3 whitespace-pre-line">
            {blog.content}
          </p>
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
            onClick={(e) => {
              if (!authorId) e.preventDefault();
            }}
          >
            {authorName}
          </Link>
          {createdAt && (
            <span className="ml-auto">{createdAt.toLocaleDateString()}</span>
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

  const {
    listings,
    loading: listingsLoading,
    error: listingsError,
    refresh: refreshListings,
    connected: listingsConnected,
  } = usePendingListings();
  const emitAllListings = useApiMutation(
    "post",
    "/listings/for-approval/emit-all",
  );
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const filteredListings = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return listings.filter((l: any) => {
      const byQ =
        !ql ||
        [l.title, l.description, l.user?.name, l.user?.email]
          .filter(Boolean)
          .some((s) => String(s).toLowerCase().includes(ql));
      const byCat = !category || l.category?.name === category;
      return byQ && byCat;
    });
  }, [listings, q, category]);

  const {
    blogs,
    loading: blogsLoading,
    error: blogsError,
    refresh: refreshBlogs,
    connected: blogsConnected,
  } = usePendingBlogs();
  const [localBlogs, setLocalBlogs] = useState<any[] | null>(null);
  const emitAllBlogs = useApiMutation("post", "/blogs/pending/emit-all");

  const displayBlogs = localBlogs ?? blogs;

  const handleBlogApproved = (id: string) => {
    setLocalBlogs((prev) =>
      (prev ?? blogs).filter((b: any) => String(b.id) !== id),
    );
  };
  const handleBlogRejected = (id: string) => {
    setLocalBlogs((prev) =>
      (prev ?? blogs).filter((b: any) => String(b.id) !== id),
    );
  };

  const { t } = useLanguage();

  const categoryOptions = Array.from(
    new Set(listings.map((l: any) => l.category?.name).filter(Boolean)),
  ).map((c: any) => ({ value: c, label: c }));

  return (
    <div className="min-h-screen p-6">
      <div className="glass rounded-2xl p-6 border border-[hsl(var(--border))] w-full max-w-8xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">{t("pendingsHeading")}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={
                (activeTab === "listings"
                  ? listingsConnected
                  : blogsConnected)
                  ? "success"
                  : "warning"
              }
              className="normal-case tracking-normal"
            >
              {(activeTab === "listings" ? listingsConnected : blogsConnected)
                ? t("pendingsSocketConnected")
                : t("pendingsSocketDisconnected")}
            </Badge>
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

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Tab)}
          className="mt-5"
        >
          <TabsList>
            <TabsTrigger value="listings">
              {t("pendingsTabListings")}
            </TabsTrigger>
            <TabsTrigger value="blogs">{t("pendingsTabBlogs")}</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <TextInputField
                label={t("pendingsSearchPlaceholder")}
                value={q}
                onChange={setQ}
                icon={<Search className="size-4" />}
              />
              <div className="min-w-[12rem]">
                <SelectField
                  label={t("pendingsFilterAllCategories")}
                  aria-label={t("pendingsFilterAllCategories")}
                  value={category}
                  onChange={setCategory}
                  options={categoryOptions}
                  placeholder={t("pendingsFilterAllCategories")}
                />
              </div>
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
          </TabsContent>

          <TabsContent value="blogs">
            <div className="mt-6">
              {blogsLoading && (
                <div className="subtle">{t("pendingsBlogsLoading")}</div>
              )}
              {blogsError && (
                <div className="text-red-400">
                  {t("pendingsBlogsLoadFailed")}
                </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
