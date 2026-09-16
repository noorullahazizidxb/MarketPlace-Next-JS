"use client";
import React from "react";
import { Story } from "../../types/social";
import ImageCarousel from "./ImageCarousel";
import { User } from "lucide-react";

export default function StoryCard({ story }: { story: Story }) {
  return (
    <article className="card overflow-hidden p-0">
      <div className="flex items-start gap-3 p-4 pb-0">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--primary)]/10">
          <User className="size-5 text-[var(--primary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">{story.title}</h3>
            <span className="app-text-caption subtle">{story.author?.name}</span>
          </div>
          <p className="app-text-body mt-2 text-[var(--foreground)]/80">
            {story.description}
          </p>
        </div>
      </div>
      {Array.isArray(story.images) && story.images.length > 0 && (
        <div className="mt-3 w-full">
          <ImageCarousel images={story.images} />
        </div>
      )}
    </article>
  );
}
