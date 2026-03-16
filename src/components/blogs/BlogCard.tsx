"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Heart,
  Share2,
  MessageCircle,
  Facebook,
  Instagram,
  MessageSquareShare,
} from "lucide-react";
import { useApiMutation } from "@/lib/api-hooks";
import { ImageSlider } from "@/components/ui/image-slider";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getSocket } from "@/lib/socket";
import { asset } from "@/lib/assets";
import Image from "next/image";
import { useAuth } from "@/lib/use-auth";

function deferCountSync(callback?: () => void) {
  if (!callback) return;
  queueMicrotask(callback);
}

function getCounts(b: any) {
  const likes = b?.counts?.likes ?? b?.likes ?? b?.likeCount ?? 0;
  const shares = b?.counts?.shares ?? b?.shares ?? b?.shareCount ?? 0;
  const comments =
    b?.counts?.comments ??
    b?.commentsCount ??
    (Array.isArray(b?.comments) ? b.comments.length : 0) ??
    0;
  return { likes, shares, comments };
}

type Props = {
  blog: any;
  onOpen?: (blog: any) => void;
  variant?: "default" | "overlay";
  imageHeightClass?: string;
  countOverride?: { likes?: number; shares?: number; comments?: number };
  onCountsChange?: (
    blogId: string,
    patch: { likes?: number; shares?: number; comments?: number }
  ) => void;
};

export default function BlogCard({
  blog,
  onOpen,
  variant = "default",
  imageHeightClass,
  countOverride,
  onCountsChange,
}: Props) {
  const router = useRouter();
  const likeMut = useApiMutation("post", `/blogs/${blog.id}/likes`);
  const shareMut = useApiMutation("post", `/blogs/${blog.id}/shares`);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [isImageEngaged, setIsImageEngaged] = React.useState(false);
  const [localCounts, setLocalCounts] = React.useState(() => getCounts(blog));
  const { t } = useLanguage();
  const { user } = useAuth();
  const canInteract = Boolean(user);

  React.useEffect(() => {
    setLocalCounts({ ...getCounts(blog), ...(countOverride || {}) });
  }, [blog, countOverride]);

  React.useEffect(() => {
    const sock = getSocket();
    if (!sock || !blog?.id) return;

    const handleLike = (payload: { blogId: string; likes?: number }) => {
      if (String(payload.blogId) !== String(blog.id)) return;
      if (typeof payload.likes === "number") {
        setLocalCounts((prev) => ({ ...prev, likes: payload.likes }));
        deferCountSync(() =>
          onCountsChange?.(String(blog.id), { likes: payload.likes })
        );
      }
    };

    const handleShare = (payload: { blogId: string; shares?: number }) => {
      if (String(payload.blogId) !== String(blog.id)) return;
      if (typeof payload.shares === "number") {
        setLocalCounts((prev) => ({ ...prev, shares: payload.shares }));
        deferCountSync(() =>
          onCountsChange?.(String(blog.id), { shares: payload.shares })
        );
      }
    };

    const handleComment = (payload: { blogId: string }) => {
      if (String(payload.blogId) !== String(blog.id)) return;
      let nextComments = 0;
      setLocalCounts((prev) => {
        nextComments = (prev.comments ?? 0) + 1;
        return { ...prev, comments: nextComments };
      });
      deferCountSync(() =>
        onCountsChange?.(String(blog.id), { comments: nextComments })
      );
    };

    sock.on("newLike", handleLike);
    sock.on("newShare", handleShare);
    sock.on("newComment", handleComment);

    return () => {
      try {
        sock.off("newLike", handleLike as any);
        sock.off("newShare", handleShare as any);
        sock.off("newComment", handleComment as any);
      } catch { }
    };
  }, [blog?.id, onCountsChange]);

  const onLike = async () => {
    if (!canInteract) return;
    const optimisticLikes = (localCounts.likes ?? 0) + 1;
    setLocalCounts((prev) => ({ ...prev, likes: optimisticLikes }));
    deferCountSync(() =>
      onCountsChange?.(String(blog.id), { likes: optimisticLikes })
    );
    try {
      await likeMut.mutateAsync({});
    } catch {
      setLocalCounts((prev) => ({ ...prev, likes: Math.max(0, optimisticLikes - 1) }));
      deferCountSync(() =>
        onCountsChange?.(String(blog.id), {
          likes: Math.max(0, optimisticLikes - 1),
        })
      );
      // ignore; consider toast handled by api-hooks
    }
  };
  const doShare = async () => {
    if (!canInteract) return;
    const optimisticShares = (localCounts.shares ?? 0) + 1;
    setLocalCounts((prev) => ({ ...prev, shares: optimisticShares }));
    deferCountSync(() =>
      onCountsChange?.(String(blog.id), { shares: optimisticShares })
    );
    try {
      await shareMut.mutateAsync({});
    } catch {
      setLocalCounts((prev) => ({ ...prev, shares: Math.max(0, optimisticShares - 1) }));
      deferCountSync(() =>
        onCountsChange?.(String(blog.id), {
          shares: Math.max(0, optimisticShares - 1),
        })
      );
      // ignore
    }
  };

  const images = Array.isArray(blog.images)
    ? blog.images.map((u: any) => ({
      url: typeof u === "string" ? u : u?.url,
      alt: blog.title,
    }))
    : blog.image
      ? [{ url: blog.image, alt: blog.title }]
      : [];
  const likeCount = localCounts.likes ?? 0;
  const shareCount = localCounts.shares ?? 0;
  const commentCount = localCounts.comments ?? 0;
  const authorId = blog?.author?.id || blog?.authorId || blog?.userId;
  const sliderHeight = imageHeightClass || "h-52 md:h-64 lg:h-72";

  const onMediaActivate = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-slider-control="true"]')) {
      return;
    }
    onOpen?.(blog);
  };

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-shadow duration-200">
      {/* Top: media clickable */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t("openBlog")}
        onClick={onMediaActivate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onMediaActivate(event);
          }
        }}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))/0.35]"
        onMouseEnter={() => setIsImageEngaged(true)}
        onMouseLeave={() => setIsImageEngaged(false)}
        onFocus={() => setIsImageEngaged(true)}
        onBlur={(event) => {
          const next = event.relatedTarget as Node | null;
          if (!next || !event.currentTarget.contains(next)) {
            setIsImageEngaged(false);
          }
        }}
      >
        <div
          className="relative"
          onMouseEnter={() => setIsImageEngaged(true)}
          onMouseLeave={() => setIsImageEngaged(false)}
          onFocus={() => setIsImageEngaged(true)}
          onBlur={(event) => {
            const next = event.relatedTarget as Node | null;
            if (!next || !event.currentTarget.contains(next)) {
              setIsImageEngaged(false);
            }
          }}
        >
          <ImageSlider
            images={images}
            aspect="16/9"
            heightClass={sliderHeight}
            autoPlay
            forceEngaged={isImageEngaged}
            intervalMs={2200}
          />
        </div>
      </div>

      {/* Overlay variant: move all info and actions on top of the image */}
      {variant === "overlay" ? (
        <>
          {/* gradient and text overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Clickable title/description button that sits above the gradient but below the action controls */}
            <div className="absolute left-3 bottom-3 z-[50] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
              <button
                type="button"
                onClick={() => onOpen?.(blog)}
                aria-label={t("openBlog")}
                className="pointer-events-auto inline-block mb-10 text-left text-white bg-black/30 backdrop-blur-md rounded-lg px-3 py-2 hover:bg-[hsl(var(--accent)/0.18)] hover:scale-105 transform-gpu transition-all duration-200"
              >
                <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="mt-1 text-sm opacity-90 line-clamp-2">
                    {blog.excerpt}
                  </p>
                )}
              </button>
            </div>
          </div>
          {/* author/meta and actions overlay with interactive controls */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="flex flex-col justify-between h-full">
              {/* top-left author/meta */}
              <div className="p-3 sm:p-4 pointer-events-auto">
                <div className="inline-flex items-center gap-2 text-[11px] text-white/90 bg-black/20 backdrop-blur rounded-full px-2 py-1 pointer-events-auto">
                  <Link
                    href={authorId ? `/profile/${authorId}` : "#"}
                    onClick={(e) => {
                      if (!authorId) e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="inline-flex items-center gap-2 hover:opacity-90"
                  >
                    <div className="size-6 rounded-full overflow-hidden bg-white/20 grid place-items-center text-white">
                      {blog.author?.photo ? (
                        <Image
                          src={asset(blog.author.photo)}
                          alt={blog.author?.fullName || "avatar"}
                          className="w-6 h-6 object-cover"
                          width={24} // Adding width property
                          height={24} // Adding height property
                        />
                      ) : (
                        <div className="text-[10px] font-semibold">
                          {String(
                            blog.author?.fullName || blog.author?.name || "?"
                          )
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-medium max-w-[12ch] truncate">
                      {blog.author?.fullName || blog.author?.name || "Unknown"}
                    </span>
                  </Link>
                  {blog.createdAt && <span aria-hidden>·</span>}
                  {blog.createdAt && (
                    <time dateTime={blog.createdAt}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </time>
                  )}
                </div>
              </div>
              {/* bottom-left actions */}
              <div className="p-3 sm:p-4 pointer-events-auto">
                <div className="flex items-center gap-3 text-sm pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike();
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/30 bg-black/30 backdrop-blur text-white"
                    aria-label={t("like")}
                    disabled={!canInteract || likeMut.isPending}
                    title={!canInteract ? t("signInToInteract") : undefined}
                  >
                    <Heart className="size-4" /> {likeCount || 0}
                  </button>
                  <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                    <DialogTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/30 bg-black/30 backdrop-blur text-white"
                        aria-label="Share"
                        disabled={!canInteract || shareMut.isPending}
                        title={!canInteract ? t("signInToInteract") : undefined}
                      >
                        <Share2 className="size-4" /> {shareCount || 0}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-[min(92vw,420px)]">
                      <DialogTitle className="mb-3 text-lg font-semibold">
                        {t("share")}
                      </DialogTitle>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            doShare();
                            setShareOpen(false);
                            // optional: window.open to share intent
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/20"
                          disabled={shareMut.isPending}
                        >
                          <Facebook className="size-4" /> {t("facebook")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            doShare();
                            setShareOpen(false);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/20"
                          disabled={shareMut.isPending}
                        >
                          <Instagram className="size-4" /> {t("instagram")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            doShare();
                            setShareOpen(false);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/20"
                          disabled={shareMut.isPending}
                        >
                          <MessageSquareShare className="size-4" />{" "}
                          {t("whatsapp")}
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen ? onOpen(blog) : router.push(`/blogs/${blog.id}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/30 bg-black/30 backdrop-blur text-white"
                    aria-label={t("commentsLabel")}
                  >
                    <MessageCircle className="size-4" /> {commentCount || 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Default variant: original bottom content
        <div className="p-4">
          <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--foreground))/75]">
            <Link
              href={authorId ? `/profile/${authorId}` : "#"}
              onClick={(e) => {
                if (!authorId) e.preventDefault();
              }}
              className="inline-flex items-center gap-2 hover:opacity-90"
            >
              <div className="size-8 rounded-full overflow-hidden bg-[hsl(var(--muted))]/10 grid place-items-center text-[hsl(var(--foreground))]">
                {blog.author?.photo ? (
                  <Image
                    src={asset(blog.author.photo)}
                    alt={blog.author?.fullName || "avatar"}
                    className="w-8 h-8 object-cover"
                    width={32} // Adding width property
                    height={32} // Adding height property
                  />
                ) : (
                  <div className="text-xs font-semibold">
                    {String(blog.author?.fullName || blog.author?.name || "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-medium">
                {blog.author?.fullName || blog.author?.name || "Unknown"}
              </span>
            </Link>
            {blog.createdAt && <span aria-hidden>·</span>}
            {blog.createdAt && (
              <time dateTime={blog.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </time>
            )}
          </div>
          {variant === "default" && (
            <>
              <h3 className="mt-2 text-lg font-semibold leading-tight text-[hsl(var(--foreground))] line-clamp-2">
                {blog.title}
              </h3>
              {blog.excerpt && (
                <p className="mt-1 text-sm text-[hsl(var(--foreground))/80] line-clamp-2">
                  {blog.excerpt}
                </p>
              )}
            </>
          )}
          <div className="mt-3 flex items-center gap-3 text-sm">
            <button
              onClick={onLike}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.6] backdrop-blur text-[hsl(var(--foreground))/85]"
              aria-label={t("like")}
              disabled={!canInteract || likeMut.isPending}
              title={!canInteract ? t("signInToInteract") : undefined}
            >
              <Heart className="size-4" /> {likeCount || 0}
            </button>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setShareOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.6] backdrop-blur text-[hsl(var(--foreground))/85]"
                  aria-label="Share"
                  disabled={!canInteract || shareMut.isPending}
                  title={!canInteract ? t("signInToInteract") : undefined}
                >
                  <Share2 className="size-4" /> {shareCount || 0}
                </button>
              </DialogTrigger>
              <DialogContent className="w-[min(92vw,420px)]">
                <DialogTitle className="mb-3 text-lg font-semibold">{t("share")}</DialogTitle>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      doShare();
                      setShareOpen(false);
                      // optional: window.open to share intent
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/20"
                    disabled={shareMut.isPending}
                  >
                    <Facebook className="size-4" /> {t("facebook")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      doShare();
                      setShareOpen(false);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/20"
                    disabled={shareMut.isPending}
                  >
                    <Instagram className="size-4" /> {t("instagram")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      doShare();
                      setShareOpen(false);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/20"
                    disabled={shareMut.isPending}
                  >
                    <MessageSquareShare className="size-4" /> {t("whatsapp")}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
            <button
              type="button"
              onClick={() =>
                onOpen ? onOpen(blog) : router.push(`/blogs/${blog.id}`)
              }
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.6] backdrop-blur text-[hsl(var(--foreground))/85]"
              aria-label={t("commentsLabel")}
            >
              <MessageCircle className="size-4" /> {commentCount || 0}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
