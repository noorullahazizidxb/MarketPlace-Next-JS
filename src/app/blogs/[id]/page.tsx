"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";
import { useAuth } from "@/lib/use-auth";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: blog, isLoading } = useApiGet(["blogs", id], `/blogs/${id}`);
  const isAuthor = !!user && blog?.author?.id === user?.id;
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const save = useApiMutation("put", `/blogs/${id}`);
  const addComment = useApiMutation("post", `/blogs/${id}/comments`);

  const onEdit = () => {
    setDraftTitle(blog?.title || "");
    setDraftContent(blog?.content || "");
  };
  const onSave = async () => {
    const payload = { title: draftTitle, content: draftContent } as any;
    mutate(
      ["blogs", id],
      (prev: any) => ({ ...(prev || {}), ...payload }),
      false
    );
    try {
      await save.mutateAsync(payload);
      await mutate(["blogs", id]);
    } catch {}
  };

  const [comment, setComment] = useState("");
  const onPostComment = async () => {
    if (!comment.trim()) return;
    const optimistic = {
      id: `c_${Date.now()}`,
      blogId: id,
      body: comment.trim(),
      author: { id: user?.id, name: user?.name || user?.fullName || "You" },
      createdAt: new Date().toISOString(),
    } as any;
    mutate(
      ["blogs", id],
      (prev: any) => {
        if (!prev) return prev;
        const next = { ...(prev as any) };
        next.comments = Array.isArray(next.comments)
          ? [optimistic, ...next.comments]
          : [optimistic];
        return next;
      },
      false
    );
    setComment("");
    try {
      await addComment.mutateAsync({ body: optimistic.body });
      await mutate(["blogs", id]);
    } catch {}
  };

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!blog) return <div className="p-6">Not found</div>;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        {isAuthor ? (
          <div className="space-y-2">
            <input
              className="input text-xl font-bold"
              value={draftTitle || blog.title}
              onChange={(e) => setDraftTitle(e.target.value)}
              aria-label="Title"
            />
            <textarea
              className="input min-h-[200px]"
              value={draftContent || blog.content}
              onChange={(e) => setDraftContent(e.target.value)}
              aria-label="Content"
            />
            <div className="flex items-center gap-2">
              <button className="btn-primary" onClick={onSave}>
                Save
              </button>
              <button className="btn" onClick={onEdit}>
                Edit
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="heading-xl">{blog.title}</h1>
            <p className="prose prose-invert leading-relaxed">{blog.content}</p>
          </>
        )}
      </header>

      <section className="space-y-3">
        <h3 className="font-semibold">Comments</h3>
        <div className="flex items-center gap-2">
          <input
            className="input flex-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment"
            aria-label="Comment"
          />
          <button className="btn" onClick={onPostComment}>
            Post
          </button>
        </div>
        <div className="space-y-2">
          {blog.comments?.map((c: any) => (
            <div
              key={c.id}
              className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/5"
            >
              <div className="text-sm font-medium">
                {c.author?.name || "Anon"}
              </div>
              <div className="text-sm">{c.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
