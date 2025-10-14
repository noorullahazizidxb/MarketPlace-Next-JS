"use client";
import React from "react";
import { useRouter } from "next/navigation";
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

type Props = { blog: any; onOpen?: (blog: any) => void };

export default function BlogCard({ blog, onOpen }: Props) {
  const router = useRouter();
  const likeMut = useApiMutation("post", `/blogs/${blog.id}/likes`);
  const shareMut = useApiMutation("post", `/blogs/${blog.id}/shares`);
  const [shareOpen, setShareOpen] = React.useState(false);

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
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-shadow duration-200">
      {/* Top: media clickable */}
      <button
        type="button"
        aria-label="Open blog"
        onClick={() => onOpen?.(blog)}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))/0.35]"
      >
        <ImageSlider
          images={images}
          aspect="16/9"
          heightClass="h-52 md:h-64 lg:h-72"
        />
      </button>
      {/* Bottom: content and actions */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--foreground))/75]">
          <div className="size-8 rounded-full overflow-hidden bg-[hsl(var(--muted))]/10 grid place-items-center text-[hsl(var(--foreground))]">
            {blog.author?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blog.author.photo}
                alt={blog.author?.fullName || "avatar"}
                className="w-8 h-8 object-cover"
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
          {blog.createdAt && <span aria-hidden>·</span>}
          {blog.createdAt && (
            <time dateTime={blog.createdAt}>
              {new Date(blog.createdAt).toLocaleDateString()}
            </time>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-tight text-[hsl(var(--foreground))] line-clamp-2">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="mt-1 text-sm text-[hsl(var(--foreground))/80] line-clamp-2">
            {blog.excerpt}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-sm">
          <button
            onClick={onLike}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.6] backdrop-blur text-[hsl(var(--foreground))/85]"
            aria-label="Like"
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
              <h3 className="text-lg font-semibold mb-3">Share</h3>
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
                  <Facebook className="size-4" /> Facebook
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
                  <Instagram className="size-4" /> Instagram
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
                  <MessageSquareShare className="size-4" /> WhatsApp
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
            aria-label="Comments"
          >
            <MessageCircle className="size-4" /> {commentCount || 0}
          </button>
        </div>
      </div>
    </article>
  );
}
