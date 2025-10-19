"use client";
import React, { useMemo, useState } from "react";
import { useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";
import { useLanguage } from "@/components/providers/language-provider";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/use-auth";
import { getSocket } from "@/lib/socket";
import Link from "next/link";
import { asset } from "@/lib/assets";
import Image from "next/image";

export default function CommentsInline({
  blogId,
  comments,
}: {
  blogId: string;
  comments?: any[];
}) {
  const [value, setValue] = useState("");
  const [localComments, setLocalComments] = useState<any[]>(
    () => comments || []
  );
  // Keep local comments in sync when prop updates with new data
  React.useEffect(() => {
    if (Array.isArray(comments)) {
      const norm = comments.map((raw: any) => {
        const authorRaw = raw?.author || raw?.user || {};
        const authorId = raw?.authorId || raw?.userId || authorRaw?.id;
        const fullName =
          authorRaw?.fullName ||
          authorRaw?.name ||
          raw?.authorName ||
          raw?.userName ||
          raw?.name ||
          "";
        const photo =
          authorRaw?.photo ||
          authorRaw?.avatar ||
          raw?.authorPhoto ||
          raw?.userPhoto ||
          null;
        const author = {
          id: authorId ? String(authorId) : undefined,
          fullName,
          photo,
        };
        return { ...raw, author };
      });
      setLocalComments(norm);
    }
  }, [comments]);
  const post = useApiMutation("post", `/blogs/${blogId}/comments`);
  const { t } = useLanguage();

  const { user } = useAuth();

  // Realtime: directly listen for newComment to update local state (idempotent)
  React.useEffect(() => {
    const sock = getSocket();
    if (!sock) return;
    const handler = (p: any) => {
      if (!p?.blogId || String(p.blogId) !== String(blogId)) return;
      setLocalComments((prev) => {
        const exists = (prev || [])
          .slice(0, 10)
          .some(
            (c: any) =>
              String(c.id) === String(p.comment?.id) ||
              (c.body === p.comment?.body && c.authorId === p.comment?.authorId)
          );
        if (exists) return prev;
        return [p.comment, ...(prev || [])];
      });
    };
    sock.on("newComment", handler);
    return () => {
      try {
        sock.off("newComment", handler as any);
      } catch {}
    };
  }, [blogId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    const body = value.trim();
    try {
      await post.mutateAsync({ body });
      // Clear input on success; rely on websocket event to update UI
      setValue("");
    } catch {}
  };

  return (
    <div className="mt-3">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          className="flex-1 h-10 rounded-xl bg-[hsl(var(--input))]/20 border-[hsl(var(--border))]/60"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("messagePlaceholder") as string}
          aria-label={t("message")}
        />
        <button className="btn" type="submit" disabled={post.isPending}>
          {t("post")}
        </button>
      </form>
      <div className="mt-2 space-y-2">
        {localComments?.map((c: any) => (
          <div
            key={c.id}
            className="px-3 py-2 rounded-xl bg-[hsl(var(--muted))]/10 flex items-start gap-3"
          >
            <Link
              href={c.author?.id ? `/profile/${c.author.id}` : "#"}
              onClick={(e) => {
                if (!c.author?.id) e.preventDefault();
              }}
              className="size-8 rounded-full overflow-hidden bg-[hsl(var(--muted))]/10 flex-shrink-0 hover:opacity-90"
            >
              {c.author?.photo ? (
                <Image
                  src={asset(c.author.photo)}
                  alt={c.author?.fullName || "avatar"}
                  className="w-8 h-8 object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-8 h-8 grid place-items-center text-[hsl(var(--foreground))] text-xs font-semibold">
                  {String(c.author?.fullName || c.author?.name || "?")
                    .slice(0, 1)
                    .toUpperCase()}
                </div>
              )}
            </Link>
            <div className="flex-1">
              <Link
                href={c.author?.id ? `/profile/${c.author.id}` : "#"}
                onClick={(e) => {
                  if (!c.author?.id) e.preventDefault();
                }}
                className="text-xs font-semibold hover:underline"
              >
                {c.author?.fullName || c.author?.name || t("anonymous")}
              </Link>
              <div className="text-sm leading-relaxed">{c.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
