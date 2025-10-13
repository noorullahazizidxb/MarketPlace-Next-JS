"use client";
import React from "react";
import { useApiGet } from "@/lib/api-hooks";
import StoryCard from "@/components/stories/StoryCard";
import { useSocialRealtime } from "@/lib/use-social-realtime";

export default function StoriesPage() {
  useSocialRealtime(true);
  const { data: stories, isLoading } = useApiGet(["stories"], "/stories");

  return (
    <div className="space-y-4">
      <h1 className="heading-xl">Stories</h1>
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-[hsl(var(--muted))]/10 animate-pulse"
            />
          ))}
        </div>
      )}
      <div className="grid gap-3">
        {stories?.map((s: any) => (
          <StoryCard key={s.id} story={s} />
        ))}
        {!isLoading && (!stories || stories.length === 0) && (
          <div className="card p-6">No stories yet.</div>
        )}
      </div>
    </div>
  );
}
