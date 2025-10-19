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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getSocket } from "@/lib/socket";
import { asset } from "@/lib/assets";
import Image from "next/image";

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
};

export default function BlogCard({
  blog,
  onOpen,
  variant = "default",
  imageHeightClass,
}: Props) {
  const router = useRouter();
  const likeMut = useApiMutation("post", `/blogs/${blog.id}/likes`);
  const shareMut = useApiMutation("post", `/blogs/${blog.id}/shares`);
  const [shareOpen, setShareOpen] = React.useState(false);
  const { t } = useLanguage();

  const onLike = async () => {
    try {
      await likeMut.mutateAsync({});
      // No local increments; websocket event from the server will update counts
    } catch {
      // ignore; consider toast handled by api-hooks
    }
  };
  const doShare = async () => {
    try {
      await shareMut.mutateAsync({});
      // No local increments; websocket event from the server will update counts
    } catch {
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
  const counts = getCounts(blog);
  const likeCount = counts.likes ?? 0;
  const shareCount = counts.shares ?? 0;
  const commentCount = counts.comments ?? 0;
  const authorId = blog?.author?.id || blog?.authorId || blog?.userId;
  const sliderHeight = imageHeightClass || "h-52 md:h-64 lg:h-72";
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-shadow duration-200">
      {/* Top: media clickable */}
      <button
        type="button"
        aria-label={t("openBlog")}
        onClick={() => onOpen?.(blog)}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))/0.35]"
      >
        <div className="relative">
          <ImageSlider
            images={images}
            aspect="16/9"
            heightClass={sliderHeight}
          />
        </div>
      </button>

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
          <div className="absolute inset-0 z-30">
            <div className="flex flex-col justify-between h-full">
              {/* top-left author/meta */}
              <div className="p-3 sm:p-4">
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
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-3 text-sm pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike();
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/30 bg-black/30 backdrop-blur text-white"
                    aria-label={t("like")}
                    disabled={likeMut.isPending}
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
                        disabled={shareMut.isPending}
                      >
                        <Share2 className="size-4" /> {shareCount || 0}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-[min(92vw,420px)]">
                      <h3 className="text-lg font-semibold mb-3">
                        {t("share")}
                      </h3>
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
              disabled={likeMut.isPending}
            >
              <Heart className="size-4" /> {likeCount || 0}
            </button>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setShareOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.6] backdrop-blur text-[hsl(var(--foreground))/85]"
                  aria-label="Share"
                  disabled={shareMut.isPending}
                >
                  <Share2 className="size-4" /> {shareCount || 0}
                </button>
              </DialogTrigger>
              <DialogContent className="w-[min(92vw,420px)]">
                <h3 className="text-lg font-semibold mb-3">{t("share")}</h3>
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
