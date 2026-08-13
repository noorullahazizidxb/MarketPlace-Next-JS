"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Clock3,
  Copy,
  Facebook,
  Heart,
  MessageCircle,
  MessageSquareShare,
  Share2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageSlider } from "@/components/ui/image-slider";
import { Tooltip } from "@/components/ui/tooltip";
import { useLanguage } from "@/components/providers/language-provider";
import { useApiMutation } from "@/lib/api-hooks";
import { asset, normalizeAssetImages, type AssetImage } from "@/lib/assets";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/lib/use-auth";

export type Blog = {
  id: string | number;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  createdAt?: string | null;
  image?: string | null;
  coverImage?: string | null;
  images?: Array<AssetImage | string | null> | null;
  category?: { name?: string | null } | string | null;
  tags?: string[] | null;
  readingTime?: number | null;
  authorId?: string | number | null;
  userId?: string | number | null;
  author?: {
    id?: string | number | null;
    fullName?: string | null;
    name?: string | null;
    photo?: string | null;
  } | null;
  counts?: { likes?: number; shares?: number; comments?: number } | null;
  likes?: number;
  likeCount?: number;
  shares?: number;
  shareCount?: number;
  commentsCount?: number;
  comments?: unknown[];
};

type Counts = { likes: number; shares: number; comments: number };

const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type Props = {
  blog: Blog;
  onOpen?: (blog: Blog) => void;
  variant?: "default" | "overlay";
  imageHeightClass?: string;
  isPriority?: boolean;
  countOverride?: Partial<Counts>;
  onCountsChange?: (blogId: string, patch: Partial<Counts>) => void;
};

function getCounts(blog: Blog): Counts {
  return {
    likes: blog.counts?.likes ?? blog.likes ?? blog.likeCount ?? 0,
    shares: blog.counts?.shares ?? blog.shares ?? blog.shareCount ?? 0,
    comments:
      blog.counts?.comments ??
      blog.commentsCount ??
      (Array.isArray(blog.comments) ? blog.comments.length : 0),
  };
}

function deferCountSync(callback?: () => void) {
  if (callback) queueMicrotask(callback);
}

function formatPublishedDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return BLOG_DATE_FORMATTER.format(date);
}

function getReadingTime(blog: Blog) {
  if (typeof blog.readingTime === "number" && blog.readingTime > 0) {
    return Math.round(blog.readingTime);
  }
  const wordCount = String(blog.content || blog.excerpt || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function getCategory(blog: Blog) {
  if (typeof blog.category === "string") return blog.category;
  return blog.category?.name || blog.tags?.[0] || "Marketplace story";
}

function AuthorMeta({ blog, inverse = false }: { blog: Blog; inverse?: boolean }) {
  const authorId = blog.author?.id ?? blog.authorId ?? blog.userId;
  const authorName = blog.author?.fullName || blog.author?.name || "DevMinds contributor";
  const date = formatPublishedDate(blog.createdAt);
  const readingTime = getReadingTime(blog);

  return (
    <div
      className={`flex min-w-0 items-center gap-2.5 app-text-caption ${
        inverse ? "text-overlay-light/85" : "text-muted-foreground"
      }`}
    >
      <Link
        href={authorId ? `/profile/${authorId}` : "#"}
        onClick={(event) => {
          if (!authorId) event.preventDefault();
          event.stopPropagation();
        }}
        className="inline-flex min-w-0 items-center gap-2 font-medium transition-opacity hover:opacity-80"
      >
        <span
          className={`grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border ${
            inverse
              ? "border-overlay-light/25 bg-overlay-light/15 text-overlay-light"
              : "border-border bg-muted text-foreground"
          }`}
        >
          {blog.author?.photo ? (
            <Image
              src={asset(blog.author.photo)}
              alt={authorName}
              width={32}
              height={32}
              className="size-8 object-cover"
            />
          ) : (
            <span className="font-semibold">{authorName.slice(0, 1).toUpperCase()}</span>
          )}
        </span>
        <span className="max-w-[12rem] truncate">{authorName}</span>
      </Link>
      <span aria-hidden className="opacity-50">•</span>
      <span className="inline-flex shrink-0 items-center gap-1">
        <Clock3 className="size-3.5" /> {readingTime} min
      </span>
      {date && (
        <>
          <span aria-hidden className="hidden opacity-50 sm:inline">•</span>
          <time dateTime={blog.createdAt || undefined} className="hidden shrink-0 sm:inline">
            {date}
          </time>
        </>
      )}
    </div>
  );
}

export default function BlogCard({
  blog,
  onOpen,
  variant = "default",
  imageHeightClass,
  isPriority = false,
  countOverride,
  onCountsChange,
}: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const likeMutation = useApiMutation("post", `/blogs/${blog.id}/likes`);
  const shareMutation = useApiMutation("post", `/blogs/${blog.id}/shares`);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [isMediaEngaged, setIsMediaEngaged] = React.useState(false);
  const [localCounts, setLocalCounts] = React.useState<Counts>(() => getCounts(blog));
  const canInteract = Boolean(user);

  React.useEffect(() => {
    setLocalCounts({ ...getCounts(blog), ...(countOverride || {}) });
  }, [blog, countOverride]);

  React.useEffect(() => {
    const socket = getSocket();
    if (!socket || !blog.id) return;

    const update = (field: keyof Counts, payload: { blogId: string; [key: string]: unknown }) => {
      if (String(payload.blogId) !== String(blog.id)) return;
      const value = payload[field];
      if (typeof value !== "number") return;
      setLocalCounts((previous) => ({ ...previous, [field]: value }));
      deferCountSync(() => onCountsChange?.(String(blog.id), { [field]: value }));
    };
    const handleLike = (payload: { blogId: string; likes?: number }) => update("likes", payload);
    const handleShare = (payload: { blogId: string; shares?: number }) => update("shares", payload);
    const handleComment = (payload: { blogId: string; comments?: number }) => {
      if (String(payload.blogId) !== String(blog.id)) return;
      setLocalCounts((previous) => {
        const comments = payload.comments ?? previous.comments + 1;
        deferCountSync(() => onCountsChange?.(String(blog.id), { comments }));
        return { ...previous, comments };
      });
    };

    socket.on("newLike", handleLike);
    socket.on("newShare", handleShare);
    socket.on("newComment", handleComment);
    return () => {
      socket.off("newLike", handleLike);
      socket.off("newShare", handleShare);
      socket.off("newComment", handleComment);
    };
  }, [blog.id, onCountsChange]);

  const syncCount = (field: keyof Counts, value: number) => {
    setLocalCounts((previous) => ({ ...previous, [field]: value }));
    deferCountSync(() => onCountsChange?.(String(blog.id), { [field]: value }));
  };

  const onLike = async () => {
    if (!canInteract || likeMutation.isPending) return;
    const previous = localCounts.likes;
    syncCount("likes", previous + 1);
    try {
      await likeMutation.mutateAsync({});
    } catch {
      syncCount("likes", previous);
    }
  };

  const recordShare = async () => {
    if (!canInteract || shareMutation.isPending) return false;
    const previous = localCounts.shares;
    syncCount("shares", previous + 1);
    try {
      await shareMutation.mutateAsync({});
      return true;
    } catch {
      syncCount("shares", previous);
      return false;
    }
  };

  const shareUrl = () =>
    typeof window === "undefined"
      ? `/blogs/${blog.id}`
      : `${window.location.origin}/blogs/${blog.id}`;

  const shareTo = async (channel: "facebook" | "whatsapp" | "copy") => {
    const recorded = await recordShare();
    if (!recorded) return;
    const url = shareUrl();
    if (channel === "copy") {
      await navigator.clipboard?.writeText(url);
    } else {
      const target =
        channel === "facebook"
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          : `https://wa.me/?text=${encodeURIComponent(`${blog.title} ${url}`)}`;
      window.open(target, "_blank", "noopener,noreferrer");
    }
    setShareOpen(false);
  };

  const images = normalizeAssetImages(
    Array.isArray(blog.images)
      ? blog.images
      : blog.coverImage
        ? [blog.coverImage]
        : blog.image
          ? [blog.image]
          : [],
    blog.title,
  );
  const sliderHeight =
    imageHeightClass ||
    (variant === "overlay" ? "h-[22rem] sm:h-[26rem]" : "h-52 sm:h-56 lg:h-60");
  const category = getCategory(blog);

  const activateMedia = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-slider-control="true"]')) return;
    router.push(`/blogs/${blog.id}`);
  };

  const actionClass = variant === "overlay"
    ? "border-overlay-light/20 bg-overlay-dark/45 text-overlay-light hover:bg-overlay-dark/65"
    : "border-border bg-background/70 text-muted-foreground hover:border-primary/25 hover:bg-primary/5 hover:text-primary";

  const actions = (
    <div className="flex items-center gap-1.5">
      <Tooltip content={canInteract ? t("like") : t("signInToInteract")} side="top">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            void onLike();
          }}
          disabled={!canInteract || likeMutation.isPending}
          aria-label={t("like")}
          className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-2.5 app-text-caption font-semibold backdrop-blur-md transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${actionClass}`}
        >
          <Heart className="size-3.5" /> {localCounts.likes}
        </button>
      </Tooltip>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <Tooltip content={canInteract ? t("share") : t("signInToInteract")} side="top">
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              disabled={!canInteract || shareMutation.isPending}
              aria-label={t("share")}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-2.5 app-text-caption font-semibold backdrop-blur-md transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${actionClass}`}
            >
              <Share2 className="size-3.5" /> {localCounts.shares}
            </button>
          </DialogTrigger>
        </Tooltip>
        <DialogContent className="max-w-sm overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <DialogTitle className="app-text-heading-sm font-semibold">
              {t("share")}
            </DialogTitle>
            <p className="mt-1 app-text-caption text-muted-foreground">
              Share this story with your network.
            </p>
          </div>
          <div className="grid gap-2 p-4">
            <button
              type="button"
              onClick={() => void shareTo("facebook")}
              className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 font-medium transition-colors hover:bg-muted"
            >
              <Facebook className="size-4 text-primary" /> {t("facebook")}
            </button>
            <button
              type="button"
              onClick={() => void shareTo("whatsapp")}
              className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 font-medium transition-colors hover:bg-muted"
            >
              <MessageSquareShare className="size-4 text-success" /> {t("whatsapp")}
            </button>
            <button
              type="button"
              onClick={() => void shareTo("copy")}
              className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 font-medium transition-colors hover:bg-muted"
            >
              <Copy className="size-4 text-muted-foreground" /> Copy link
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Tooltip content={t("commentsLabel")} side="top">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen ? onOpen(blog) : router.push(`/blogs/${blog.id}`);
          }}
          aria-label={t("commentsLabel")}
          className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-2.5 app-text-caption font-semibold backdrop-blur-md transition-colors ${actionClass}`}
        >
          <MessageCircle className="size-3.5" /> {localCounts.comments}
        </button>
      </Tooltip>
    </div>
  );

  if (variant === "overlay") {
    return (
      <article className="group relative h-full min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-token-lg">
        <div
          role="button"
          tabIndex={0}
          aria-label={t("openBlog")}
          onClick={activateMedia}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activateMedia(event);
            }
          }}
          onMouseEnter={() => setIsMediaEngaged(true)}
          onMouseLeave={() => setIsMediaEngaged(false)}
          onFocus={() => setIsMediaEngaged(true)}
          onBlur={() => setIsMediaEngaged(false)}
          className="h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
        >
          <ImageSlider
            images={images}
            heightClass={sliderHeight}
            autoPlay
            forceEngaged={isMediaEngaged}
            intervalMs={3600}
            firstSlideIsPriority={isPriority}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 60vw, 50vw"
            className="h-full transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-overlay-dark/95 via-overlay-dark/35 to-overlay-dark/5" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full border border-overlay-light/20 bg-overlay-dark/45 px-2.5 py-1 app-text-micro font-semibold uppercase tracking-[0.1em] text-overlay-light backdrop-blur-md">
              {category}
            </span>
            <div className="pointer-events-auto">{actions}</div>
          </div>

          <div className="pointer-events-auto max-w-3xl">
            <AuthorMeta blog={blog} inverse />
            <Link href={`/blogs/${blog.id}`} className="mt-3 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-overlay-light/60">
              <h3 className="line-clamp-3 app-text-heading font-semibold leading-tight tracking-tight text-overlay-light sm:app-text-h3">
                {blog.title}
              </h3>
              {blog.excerpt && (
                <p className="mt-2 line-clamp-2 app-text-body leading-relaxed text-overlay-light/78">
                  {blog.excerpt}
                </p>
              )}
              <span className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-overlay-light px-3.5 app-text-label font-semibold text-overlay-dark transition-transform group-hover:translate-x-1">
                {t("openBlog")} <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-border/70 bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-token-lg">
      <div
        role="button"
        tabIndex={0}
        aria-label={t("openBlog")}
        onClick={activateMedia}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activateMedia(event);
          }
        }}
        onMouseEnter={() => setIsMediaEngaged(true)}
        onMouseLeave={() => setIsMediaEngaged(false)}
        onFocus={() => setIsMediaEngaged(true)}
        onBlur={() => setIsMediaEngaged(false)}
        className="relative overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
      >
        <ImageSlider
          images={images}
          heightClass={sliderHeight}
          autoPlay
          forceEngaged={isMediaEngaged}
          intervalMs={4200}
          firstSlideIsPriority={isPriority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          className="transition-transform duration-700 group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-overlay-dark/35 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-overlay-light/20 bg-overlay-dark/55 px-2.5 py-1 app-text-micro font-semibold uppercase tracking-[0.1em] text-overlay-light backdrop-blur-md">
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-[var(--space-card)]">
        <AuthorMeta blog={blog} />
        <Link href={`/blogs/${blog.id}`} className="mt-3 block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          <h3 className="line-clamp-2 app-text-heading-sm font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {blog.title}
          </h3>
        </Link>
        {blog.excerpt && (
          <p className="mt-2 line-clamp-2 app-text-body leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          {actions}
          <Tooltip content={t("openBlog")} side="top">
            <Link
              href={`/blogs/${blog.id}`}
              aria-label={`${t("openBlog")}: ${blog.title}`}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </Tooltip>
        </div>
      </div>
    </article>
  );
}
