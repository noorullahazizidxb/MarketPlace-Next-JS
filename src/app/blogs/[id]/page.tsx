"use client";
import React, { useState, useCallback, useOptimistic, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageSlider } from "@/components/ui/image-slider";
import { PageSpinner, ImageSpinner } from "@/components/ui/spinner";
import CommentsInline from "@/components/blogs/CommentsInline";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  Clock,
  Timer,
  UserCircle2,
  Pencil,
  Trash2,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(value: string | Date | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(value: string | Date | undefined): number | null {
  if (!value) return null;
  const diff = new Date(value).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Author card ─────────────────────────────────────────────────────────────

function AuthorCard({
  author,
  createdAt,
  expiresAt,
  isOwner,
}: {
  author: any;
  createdAt?: string;
  expiresAt?: string;
  isOwner?: boolean;
}) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const days = daysUntil(expiresAt);
  const isExpiringSoon = days !== null && days <= 7 && days > 0;
  const authorName = author?.fullName || author?.name || author?.email || "Author";
  const authorId = author?.id;
  const photoUrl = author?.photo ? asset(author.photo) : null;

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <Link
        href={authorId ? `/profile/${authorId}` : "#"}
        onClick={(e) => !authorId && e.preventDefault()}
        className="flex items-center gap-3 group"
        aria-label={`View profile of ${authorName}`}
      >
        <div className="relative size-11 rounded-full overflow-hidden ring-2 ring-[hsl(var(--border))] group-hover:ring-[hsl(var(--primary))]/50 transition-all flex-shrink-0 bg-[hsl(var(--muted))]/20">
          {photoUrl ? (
            <>
              {!avatarLoaded && <ImageSpinner className="rounded-full" />}
              <Image
                src={photoUrl}
                alt={authorName}
                fill
                className="object-cover"
                onLoad={() => setAvatarLoaded(true)}
              />
            </>
          ) : (
            <div className="size-full grid place-items-center bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/20">
              <UserCircle2 className="size-6 text-[hsl(var(--muted-foreground))]" />
            </div>
          )}
        </div>
        <div>
          <span className="text-sm font-semibold group-hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-1">
            {authorName}
            {isOwner && <BadgeCheck className="size-3.5 text-[hsl(var(--primary))]" />}
          </span>
          {createdAt && (
            <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Calendar className="size-3" />
              {formatDate(createdAt)}
            </span>
          )}
        </div>
      </Link>

      {/* Expiry badge (visible only to owner if expiring soon) */}
      {isOwner && expiresAt && (
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            isExpiringSoon
              ? "border-amber-400/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : days !== null && days <= 0
                ? "border-red-400/40 bg-red-500/10 text-red-600 dark:text-red-400"
                : "border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-[hsl(var(--muted-foreground))]"
          )}
        >
          {days !== null && days <= 0 ? (
            <AlertTriangle className="size-3" />
          ) : (
            <Timer className="size-3" />
          )}
          {days !== null && days <= 0
            ? "Expired"
            : isExpiringSoon
              ? `Expires in ${days}d`
              : `Active until ${formatDate(expiresAt)}`}
        </div>
      )}
    </div>
  );
}

// ─── Social actions bar ──────────────────────────────────────────────────────

function SocialBar({
  blogId,
  initialLikes,
  initialShares,
  initialLikedBy,
  commentCount,
}: {
  blogId: string;
  initialLikes: number;
  initialShares: number;
  initialLikedBy: string[];
  commentCount: number;
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const likeMutation = useApiMutation("post", `/blogs/${blogId}/likes`);
  const shareMutation = useApiMutation("post", `/blogs/${blogId}/shares`);

  const [likeCount, setLikeCount] = useState(initialLikes ?? 0);
  const [shareCount, setShareCount] = useState(initialShares ?? 0);
  const [liked, setLiked] = useState(() =>
    !!user && Array.isArray(initialLikedBy) && initialLikedBy.includes(String(user.id))
  );
  const [justShared, setJustShared] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => c + (wasLiked ? -1 : 1));
    try {
      await likeMutation.mutateAsync({});
    } catch {
      // revert
      setLiked(wasLiked);
      setLikeCount((c) => c + (wasLiked ? 1 : -1));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch { }
    setJustShared(true);
    setShareCount((c) => c + 1);
    setTimeout(() => setJustShared(false), 2000);
    try {
      await shareMutation.mutateAsync({});
    } catch { }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Like */}
      <button
        type="button"
        onClick={handleLike}
        disabled={!user || likeMutation.isPending}
        aria-pressed={liked}
        aria-label={liked ? "Unlike this post" : "Like this post"}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
          "hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          liked
            ? "border-rose-400/50 bg-rose-500/10 text-rose-500 dark:text-rose-400"
            : "border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-[hsl(var(--muted-foreground))] hover:border-rose-400/40 hover:text-rose-400"
        )}
      >
        <Heart
          className={cn(
            "size-4 transition-all duration-200",
            liked && "fill-current scale-110",
            likeMutation.isPending && "animate-pulse"
          )}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={likeCount}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="tabular-nums"
          >
            {likeCount}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Share / Copy link */}
      <button
        type="button"
        onClick={handleShare}
        disabled={shareMutation.isPending}
        aria-label="Copy link and share"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
          "hover:scale-105 active:scale-95 disabled:opacity-50",
          justShared
            ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/40 hover:text-[hsl(var(--primary))]"
        )}
      >
        <Share2 className={cn("size-4", justShared && "scale-110")} />
        <span>{justShared ? "Copied!" : shareCount}</span>
      </button>

      {/* Comment count (visual only) */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 px-4 py-2 text-sm text-[hsl(var(--muted-foreground))]">
        <MessageCircle className="size-4" />
        <span className="tabular-nums">{commentCount}</span>
      </div>

      {!user && (
        <Link
          href="/sign-in"
          className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors underline-offset-2 hover:underline ml-1"
        >
          Sign in to like
        </Link>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, roles } = useAuth();
  const { t } = useLanguage();

  const { data: blog, isLoading, mutate } = useApiGet(["blogs", id], `/blogs/${id}`);

  const isAuthor =
    !!user && (blog?.author?.id === user?.id || blog?.userId === user?.id || blog?.authorId === user?.id);
  const isAdmin = (roles || []).includes("ADMIN");
  const canDelete = isAuthor || isAdmin;

  const del = useApiMutation("delete", `/blogs/${id}`);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(() =>
    blog?.comments?.length ?? blog?.counts?.comments ?? 0
  );

  // Sync comment count from initial data
  React.useEffect(() => {
    const count = blog?.comments?.length ?? blog?.counts?.comments ?? 0;
    setCommentCount(count);
  }, [blog?.id, blog?.comments?.length, blog?.counts?.comments]);

  const onEdit = () => {
    if (!blog) return;
    const params = new URLSearchParams();
    params.set("id", String(blog.id));
    if (blog.title) params.set("title", blog.title);
    if (blog.content) params.set("content", blog.content);
    router.push(`/blogs/create?${params.toString()}`);
  };

  const onDelete = async () => {
    try {
      await del.mutateAsync({} as any);
    } catch { }
    try {
      const { getSocket } = await import("@/lib/socket");
      getSocket()?.emit?.("blogDeleted", { id });
    } catch { }
    setConfirmOpen(false);
    router.push("/blogs");
  };

  const handleCommentCountChange = useCallback(
    (nextCount: number) => {
      setCommentCount(nextCount);
      if (!blog?.id) return;
      mutate(
        (prev: any) =>
          prev
            ? { ...prev, counts: { ...(prev.counts || {}), comments: nextCount } }
            : prev,
        false
      );
    },
    [blog?.id, mutate]
  );

  const images = Array.isArray(blog?.images)
    ? blog.images.map((u: any) => ({
      url: typeof u === "string" ? u : u?.url,
      alt: blog?.title,
    }))
    : blog?.image
      ? [{ url: blog.image, alt: blog?.title }]
      : [];

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <PageSpinner label={t("loading") as string || "Loading post…"} />
      </div>
    );
  }

  // ── Not found state ────────────────────────────────────────────────────────
  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 p-6">
        <div className="size-16 rounded-2xl bg-[hsl(var(--muted))]/20 grid place-items-center">
          <AlertTriangle className="size-8 text-[hsl(var(--muted-foreground))]/50" />
        </div>
        <div>
          <p className="text-lg font-semibold text-center">{t("blogNotFound") || "Post not found"}</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mt-1">
            This post may have been removed or never existed.
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push("/blogs")}>
          <ArrowLeft className="size-4 mr-2" />
          {t("back") || "Back to Blog"}
        </Button>
      </div>
    );
  }

  const likedBy: string[] = Array.isArray(blog?.likedBy) ? blog.likedBy : [];
  const likeCount: number = blog?.likes ?? 0;
  const shareCount: number = blog?.shares ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto px-4 py-8 space-y-8"
    >
      {/* ── Back navigation ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors group"
        aria-label={t("back") || "Back"}
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        {t("back") || "Back"}
      </button>

      {/* ── Hero image slider ────────────────────────────────────────── */}
      {images.length > 0 && (
        <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] ring-1 ring-[hsl(var(--border))]/30">
          <ImageSlider images={images} aspect="16/9" />
        </div>
      )}

      {/* ── Title + admin/author toolbar ────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug text-[hsl(var(--foreground))]">
            {blog.title}
          </h1>
          {(isAuthor || isAdmin) && (
            <div className="flex items-center gap-1.5 shrink-0 mt-1">
              {isAuthor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="gap-1.5 px-3"
                  aria-label="Edit post"
                >
                  <Pencil className="size-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 px-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => setConfirmOpen(true)}
                  loading={del.isPending}
                  aria-label="Delete post"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Author + date + expiry */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 backdrop-blur-sm p-4">
          <AuthorCard
            author={blog.author}
            createdAt={blog.createdAt}
            expiresAt={blog.expiresAt}
            isOwner={isAuthor}
          />
        </div>

        {/* Social actions */}
        <SocialBar
          blogId={String(blog.id)}
          initialLikes={likeCount}
          initialShares={shareCount}
          initialLikedBy={likedBy}
          commentCount={commentCount}
        />
      </div>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[hsl(var(--border))]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[hsl(var(--background))] px-4 text-xs text-[hsl(var(--muted-foreground))]">
            Article
          </span>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      {blog.content && (
        <div className="prose prose-sm max-w-none">
          {blog.content.split("\n\n").map((para: string, i: number) => (
            <p
              key={i}
              className="text-[hsl(var(--foreground))]/85 leading-relaxed text-[0.9375rem] mb-4 last:mb-0"
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[hsl(var(--border))]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[hsl(var(--background))] px-4 text-xs text-[hsl(var(--muted-foreground))]">
            <MessageCircle className="size-3 inline mr-1" />
            Comments
          </span>
        </div>
      </div>

      {/* ── Comments section ─────────────────────────────────────────── */}
      <CommentsInline
        blogId={String(blog.id)}
        comments={blog.comments}
        onCommentCountChange={handleCommentCountChange}
      />

      {/* ── Bottom social repeat ─────────────────────────────────────── */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 p-4 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Found this helpful? Share it with others.
        </p>
        <SocialBar
          blogId={String(blog.id)}
          initialLikes={likeCount}
          initialShares={shareCount}
          initialLikedBy={likedBy}
          commentCount={commentCount}
        />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("blogDeleteConfirmTitle")}
        description={t("blogDeleteConfirmBody")}
        confirmLabel={t("delete")}
        tone="danger"
        onConfirm={onDelete}
      />
    </motion.div>
  );
}
