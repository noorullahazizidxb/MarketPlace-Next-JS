"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";

export default function AdminCreateStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const post = useApiMutation("post", "/stories");

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    // For demo: assume images already have accessible URLs (backend should return URLs after upload)
    const urls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      images,
      videoUrl: videoUrl.trim() || undefined,
    };
    // Optimistic insert into /stories feed
    const temp = {
      id: `temp_${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    } as any;
    mutate(["stories"], (prev: any[] = []) => [temp, ...(prev || [])], false);
    try {
      await post.mutateAsync(payload as any);
      // refetch to reconcile temp vs server data
      await mutate(["stories"]);
      router.push("/stories");
    } catch {
      // rollback by removing temp
      mutate(
        ["stories"],
        (prev: any[] = []) => prev.filter((x) => x.id !== temp.id),
        false
      );
    }
  };

  const onReorder = (from: number, to: number) => {
    setImages((prev) => {
      const next = prev.slice();
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      <h1 className="heading-xl">Create Story</h1>
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
          placeholder="Story title"
          aria-label="Story title"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input min-h-[120px]"
          placeholder="Description"
          aria-label="Story description"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Video URL (optional)</label>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="input"
          placeholder="https://..."
          aria-label="Video URL"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="rounded-2xl border border-dashed border-[hsl(var(--border))] p-6 text-sm subtle"
        >
          Drag & drop images here
        </div>
        {images.length > 0 && (
          <ul className="grid grid-cols-3 gap-2">
            {images.map((url, i) => (
              <li key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-xl"
                />
                <div className="absolute inset-0 flex items-end p-1 gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      className="glass px-2 py-1 rounded"
                      onClick={() => onReorder(i, i - 1)}
                    >
                      ↑
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      className="glass px-2 py-1 rounded"
                      onClick={() => onReorder(i, i + 1)}
                    >
                      ↓
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={post.isPending}>
          Publish
        </button>
        <button type="button" className="btn" onClick={() => history.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
