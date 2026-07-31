"use client";

import { useState, useCallback } from "react";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Spinner, ImageSpinner } from "@/components/ui/spinner";
import { asset } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  FileText,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Ban,
  Eye,
  EyeOff,
  KeyRound,
  PenLine,
  ShoppingBag,
  CalendarX2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type ContentType = "listings" | "blogs";

type StatusOption =
  | "ALL"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "DRAFT"
  | "EXPIRED"
  | "SOLD"
  | "RENTED"
  | "HIDDEN";

const LISTING_STATUSES: StatusOption[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "DRAFT",
  "SOLD",
  "RENTED",
  "EXPIRED",
  "HIDDEN",
];
const BLOG_STATUSES: StatusOption[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

// ─── Status badge ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  PENDING:
    "bg-warning/15 text-warning border-warning/40 dark:text-warning",
  APPROVED:
    "bg-success/15 text-success border-success/35 dark:text-success",
  REJECTED: "bg-destructive/15 text-destructive border-destructive/40 dark:text-destructive",
  DRAFT: "bg-muted text-muted-foreground border-border dark:text-muted-foreground",
  EXPIRED: "bg-muted text-muted-foreground border-border",
  SOLD: "bg-primary/15 text-primary border-primary/35 dark:text-primary",
  RENTED:
    "bg-primary/15 text-primary border-primary/35 dark:text-primary",
  HIDDEN: "bg-muted text-muted-foreground border-border dark:text-muted-foreground",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="app-icon-xs" />,
  APPROVED: <CheckCircle2 className="app-icon-xs" />,
  REJECTED: <XCircle className="app-icon-xs" />,
  DRAFT: <PenLine className="app-icon-xs" />,
  EXPIRED: <CalendarX2 className="app-icon-xs" />,
  SOLD: <ShoppingBag className="app-icon-xs" />,
  RENTED: <KeyRound className="app-icon-xs" />,
  HIDDEN: <EyeOff className="app-icon-xs" />,
};

const PILL_ICONS: Record<StatusOption, React.ReactNode> = {
  ALL: <LayoutList className="app-icon-xs" />,
  PENDING: <Clock className="app-icon-xs" />,
  APPROVED: <CheckCircle2 className="app-icon-xs" />,
  REJECTED: <XCircle className="app-icon-xs" />,
  DRAFT: <PenLine className="app-icon-xs" />,
  SOLD: <ShoppingBag className="app-icon-xs" />,
  RENTED: <KeyRound className="app-icon-xs" />,
  EXPIRED: <CalendarX2 className="app-icon-xs" />,
  HIDDEN: <EyeOff className="app-icon-xs" />,
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 app-text-micro font-medium ${STATUS_STYLES[status] ?? "bg-[var(--muted)]/20 border-[var(--border)]"
        }`}
    >
      {STATUS_ICONS[status]}
      {status}
    </span>
  );
}

// ─── Status filter pills ─────────────────────────────────────────────────────

function StatusPills({
  statuses,
  active,
  onChange,
}: {
  statuses: StatusOption[];
  active: StatusOption;
  onChange: (s: StatusOption) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 app-text-caption font-medium transition-all ${active === s
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
              : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40 hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
            }`}
        >
          {PILL_ICONS[s]}
          {s}
        </button>
      ))}
    </div>
  );
}

// ─── Individual content cards ─────────────────────────────────────────────────

function ListingRow({
  listing,
  onAction,
}: {
  listing: any;
  onAction: () => void;
}) {
  const approve = useApiMutation("post", `/listings/${listing.id}/approve`);
  const reject = useApiMutation("post", `/listings/${listing.id}/reject`);
  const isPending = approve.isPending || reject.isPending;
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const cover = listing.images?.[0]?.url
    ? asset(listing.images[0].url)
    : null;

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({});
      onAction();
    } catch { }
  };
  const handleReject = async () => {
    try {
      await reject.mutateAsync({});
      onAction();
    } catch { }
  };

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition-all hover:shadow-md hover:border-[var(--primary)]/20">
      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-[var(--muted)]/30">
        {cover ? (
          <>
            {!thumbLoaded && <ImageSpinner className="rounded-lg" />}
            <Image
              src={cover}
              alt={listing.title || "listing"}
              fill
              className="object-cover"
              onLoad={() => setThumbLoaded(true)}
            />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <LayoutList className="app-icon-md text-[var(--muted-foreground)]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium app-text-body truncate max-w-[22ch]">{listing.title}</span>
          <StatusBadge status={listing.status} />
          {listing.category?.name && (
            <span className="app-text-caption rounded-full bg-[var(--muted)]/40 px-2 py-0.5 border border-[var(--border)]">
              {listing.category.name}
            </span>
          )}
        </div>
        <p className="app-text-caption text-[var(--muted-foreground)] line-clamp-1">
          {listing.description || "—"}
        </p>
        <div className="flex items-center gap-3 app-text-micro text-[var(--muted-foreground)]">
          {listing.user?.fullName && <span>{listing.user.fullName}</span>}
          {listing.createdAt && (
            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
          )}
          {listing.price && (
            <span className="font-medium text-[var(--foreground)]">
              {listing.price} {listing.currency}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        <Link href={`/listings/${listing.id}`} target="_blank">
          <Tooltip content="Preview listing" side="top">
            <Button size="sm" variant="ghost" className="gap-1 px-2">
              <Eye className="app-icon-xs" />
            </Button>
          </Tooltip>
        </Link>
        {listing.status !== "APPROVED" && (
          <Button
            size="sm"
            variant="accent"
            className="gap-1 px-2.5"
            onClick={handleApprove}
            loading={approve.isPending}
            disabled={isPending}
          >
            <CheckCircle2 className="app-icon-xs" />
            Approve
          </Button>
        )}
        {listing.status !== "REJECTED" && (
          <Button
            size="sm"
            variant="secondary"
            className="gap-1 px-2.5 text-destructive hover:text-destructive"
            onClick={handleReject}
            loading={reject.isPending}
            disabled={isPending}
          >
            <XCircle className="app-icon-xs" />
            Reject
          </Button>
        )}
      </div>
    </div>
  );
}

function BlogRow({
  blog,
  onAction,
}: {
  blog: any;
  onAction: () => void;
}) {
  const approve = useApiMutation("post", `/blogs/${blog.id}/approve`);
  const reject = useApiMutation("post", `/blogs/${blog.id}/reject`);
  const isPending = approve.isPending || reject.isPending;
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const cover = blog.images?.[0]
    ? asset(typeof blog.images[0] === "string" ? blog.images[0] : blog.images[0]?.url)
    : blog.image
      ? asset(blog.image)
      : null;

  const authorName =
    blog?.author?.fullName || blog?.author?.name || blog?.author?.email || "—";

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({});
      onAction();
    } catch { }
  };
  const handleReject = async () => {
    try {
      await reject.mutateAsync({});
      onAction();
    } catch { }
  };

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition-all hover:shadow-md hover:border-[var(--primary)]/20">
      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-[var(--muted)]/30">
        {cover ? (
          <>
            {!thumbLoaded && <ImageSpinner className="rounded-lg" />}
            <Image
              src={cover}
              alt={blog.title || "blog"}
              fill
              className="object-cover"
              onLoad={() => setThumbLoaded(true)}
            />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <FileText className="app-icon-md text-[var(--muted-foreground)]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium app-text-body truncate max-w-[22ch]">{blog.title}</span>
          <StatusBadge status={blog.status} />
        </div>
        <p className="app-text-caption text-[var(--muted-foreground)] line-clamp-1">
          {blog.content || "—"}
        </p>
        <div className="flex items-center gap-3 app-text-micro text-[var(--muted-foreground)]">
          <span>{authorName}</span>
          {blog.createdAt && (
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          )}
          {blog.expiresAt && (
            <span className="text-warning">
              Expires {new Date(blog.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        <Link href={`/blogs/${blog.id}`} target="_blank">
          <Tooltip content="Preview blog" side="top">
            <Button size="sm" variant="ghost" className="gap-1 px-2">
              <Eye className="app-icon-xs" />
            </Button>
          </Tooltip>
        </Link>
        {blog.status !== "APPROVED" && (
          <Button
            size="sm"
            variant="accent"
            className="gap-1 px-2.5"
            onClick={handleApprove}
            loading={approve.isPending}
            disabled={isPending}
          >
            <CheckCircle2 className="app-icon-xs" />
            Approve
          </Button>
        )}
        {blog.status !== "REJECTED" && (
          <Button
            size="sm"
            variant="secondary"
            className="gap-1 px-2.5 text-destructive hover:text-destructive"
            onClick={handleReject}
            loading={reject.isPending}
            disabled={isPending}
          >
            <XCircle className="app-icon-xs" />
            Reject
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Stat counter card ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm`}
    >
      <div
        className={`size-10 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <div className="app-text-heading font-bold tabular-nums">{value}</div>
        <div className="app-text-caption text-[var(--muted-foreground)]">{label}</div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ManageContentStatusPage() {
  const { roles } = useAuth();
  const { t } = useLanguage();

  const isAdmin = (roles || []).includes("ADMIN");

  const [tab, setTab] = useState<ContentType>("listings");
  const [listingStatus, setListingStatus] = useState<StatusOption>("ALL");
  const [blogStatus, setBlogStatus] = useState<StatusOption>("ALL");
  const [listingQ, setListingQ] = useState("");
  const [blogQ, setBlogQ] = useState("");
  const [listingPage, setListingPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);

  const PAGE_SIZE = 20;

  // ── Listings query ──────────────────────────────────────────────────────────
  const listingParams = new URLSearchParams({
    page: String(listingPage),
    limit: String(PAGE_SIZE),
    ...(listingStatus !== "ALL" ? { status: listingStatus } : {}),
    ...(listingQ.trim() ? { q: listingQ.trim() } : {}),
  });
  const {
    data: listingsData,
    isLoading: listingsLoading,
    mutate: refreshListings,
  } = useApiGet<any[]>(
    isAdmin ? ["admin-listings", listingStatus, listingQ, listingPage] : null,
    `/listings/admin/all?${listingParams}`
  );

  // ── Blogs query ─────────────────────────────────────────────────────────────
  const blogParams = new URLSearchParams({
    page: String(blogPage),
    limit: String(PAGE_SIZE),
    ...(blogStatus !== "ALL" ? { status: blogStatus } : {}),
    ...(blogQ.trim() ? { q: blogQ.trim() } : {}),
  });
  const {
    data: blogsData,
    isLoading: blogsLoading,
    mutate: refreshBlogs,
  } = useApiGet<any[]>(
    isAdmin ? ["admin-blogs", blogStatus, blogQ, blogPage] : null,
    `/blogs/admin/all?${blogParams}`
  );

  const listings: any[] = Array.isArray(listingsData) ? listingsData : [];
  const blogs: any[] = Array.isArray(blogsData) ? blogsData : [];

  const onListingAction = useCallback(() => {
    setTimeout(() => refreshListings(), 400);
  }, [refreshListings]);

  const onBlogAction = useCallback(() => {
    setTimeout(() => refreshBlogs(), 400);
  }, [refreshBlogs]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const listingStats = [
    { label: "Pending", status: "PENDING", icon: <Clock className="app-icon-sm" />, color: "bg-warning/15 text-warning" },
    { label: "Approved", status: "APPROVED", icon: <CheckCircle2 className="app-icon-sm" />, color: "bg-success/15 text-success" },
    { label: "Rejected", status: "REJECTED", icon: <XCircle className="app-icon-sm" />, color: "bg-destructive/15 text-destructive" },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 p-6">
        <XCircle className="size-10 text-destructive opacity-60" />
        <p className="app-text-heading-sm font-semibold">Admin access required</p>
        <p className="app-text-body text-[var(--muted-foreground)]">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6 app-shell-page" data-app-page="admin-manage-content-status">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="app-text-heading font-bold tracking-tight">
            Manage Content Status
          </h1>
          <p className="app-text-body text-[var(--muted-foreground)] mt-0.5">
            Review and moderate listings &amp; blogs across all statuses.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={() => {
            refreshListings();
            refreshBlogs();
          }}
        >
          <RefreshCw className="app-icon-sm" />
          Refresh
        </Button>
      </div>

      {/* ── Quick stat counters (listings only) ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {listingStats.map((s) => {
          const count = listings.filter((l) => l.status === s.status).length;
          return (
            <StatCard
              key={s.status}
              label={`Listings · ${s.label}`}
              value={count}
              icon={s.icon}
              color={s.color}
            />
          );
        })}
      </div>

      {/* ── Tab switcher ─────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-0">
        {(["listings", "blogs"] as ContentType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2.5 app-text-body font-medium border-b-2 transition-colors ${tab === t
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
          >
            {t === "listings" ? (
              <LayoutList className="app-icon-sm" />
            ) : (
              <FileText className="app-icon-sm" />
            )}
            {t === "listings" ? "Listings" : "Blogs"}
            <span className="ml-1 rounded-full bg-[var(--muted)]/50 px-1.5 py-0.5 app-text-micro">
              {t === "listings" ? listings.length : blogs.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Listings tab ─────────────────────────────────────────────── */}
      {tab === "listings" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 app-icon-sm text-[var(--muted-foreground)]" />
              <input
                value={listingQ}
                onChange={(e) => {
                  setListingQ(e.target.value);
                  setListingPage(1);
                }}
                placeholder="Search listings..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 app-text-body outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]/50"
              />
            </div>
            <StatusPills
              statuses={LISTING_STATUSES}
              active={listingStatus}
              onChange={(s) => {
                setListingStatus(s);
                setListingPage(1);
              }}
            />
          </div>

          {/* Content */}
          {listingsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" variant="muted" />
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--muted-foreground)]">
              <LayoutList className="size-10 opacity-30" />
              <p className="app-text-body">No listings found for this filter.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {listings.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  onAction={onListingAction}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {listings.length > 0 && (
            <div className="flex items-center justify-between pt-2">
              <span className="app-text-caption text-[var(--muted-foreground)]">
                Page {listingPage}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={listingPage === 1}
                  onClick={() => setListingPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="app-icon-sm" /> Prev
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={listings.length < PAGE_SIZE}
                  onClick={() => setListingPage((p) => p + 1)}
                  className="gap-1"
                >
                  Next <ChevronRight className="app-icon-sm" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Blogs tab ────────────────────────────────────────────────── */}
      {tab === "blogs" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 app-icon-sm text-[var(--muted-foreground)]" />
              <input
                value={blogQ}
                onChange={(e) => {
                  setBlogQ(e.target.value);
                  setBlogPage(1);
                }}
                placeholder="Search blogs..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 app-text-body outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]/50"
              />
            </div>
            <StatusPills
              statuses={BLOG_STATUSES}
              active={blogStatus}
              onChange={(s) => {
                setBlogStatus(s);
                setBlogPage(1);
              }}
            />
          </div>

          {/* Content */}
          {blogsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" variant="muted" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--muted-foreground)]">
              <FileText className="size-10 opacity-30" />
              <p className="app-text-body">No blogs found for this filter.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {blogs.map((blog) => (
                <BlogRow key={blog.id} blog={blog} onAction={onBlogAction} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {blogs.length > 0 && (
            <div className="flex items-center justify-between pt-2">
              <span className="app-text-caption text-[var(--muted-foreground)]">
                Page {blogPage}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={blogPage === 1}
                  onClick={() => setBlogPage((p) => p - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="app-icon-sm" /> Prev
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={blogs.length < PAGE_SIZE}
                  onClick={() => setBlogPage((p) => p + 1)}
                  className="gap-1"
                >
                  Next <ChevronRight className="app-icon-sm" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
