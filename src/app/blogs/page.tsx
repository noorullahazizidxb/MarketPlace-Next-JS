"use client";
import React from "react";
import { useApiGet } from "@/lib/api-hooks";
import BlogCard from "@/components/blogs/BlogCard";

export default function BlogsPage() {
  const { data: blogs, isLoading } = useApiGet(["blogs"], "/blogs");
  return (
    <div className="space-y-4">
      <h1 className="heading-xl">Blogs</h1>
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-[hsl(var(--muted))]/10 animate-pulse"
            />
          ))}
        </div>
      )}
      <div className="grid gap-3">
        {blogs?.map((b: any) => (
          <BlogCard key={b.id} blog={b} />
        ))}
        {!isLoading && (!blogs || blogs.length === 0) && (
          <div className="card p-6">No blogs yet.</div>
        )}
      </div>
    </div>
  );
}
