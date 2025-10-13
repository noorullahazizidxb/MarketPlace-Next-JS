"use client";
import React from "react";
import { Heart, Share2 } from "lucide-react";
import { useApiMutation } from "@/lib/api-hooks";

export default function BlogCard({ blog }: any) {
  const likeMut = useApiMutation("post", `/blogs/${blog.id}/likes`);
  const shareMut = useApiMutation("post", `/blogs/${blog.id}/shares`);

  const onLike = async () => {
    // optimistic local UI update via SWR is handled by socket hook; here we just fire
    try {
      await likeMut.mutateAsync({});
    } catch {}
  };
  const onShare = async () => {
    try {
      await shareMut.mutateAsync({});
    } catch {}
  };

  return (
    <article className="card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold">{blog.title}</h3>
          <p className="text-sm text-[hsl(var(--foreground))]/80 mt-2">
            {blog.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={onLike}
              aria-label="Like"
              className="inline-flex items-center gap-2"
            >
              <Heart className="size-4" /> {blog.counts?.likes || 0}
            </button>
            <button
              onClick={onShare}
              aria-label="Share"
              className="inline-flex items-center gap-2"
            >
              <Share2 className="size-4" /> {blog.counts?.shares || 0}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
