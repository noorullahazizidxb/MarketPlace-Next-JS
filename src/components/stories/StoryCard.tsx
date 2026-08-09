"use client";
import React from "react";
import { Story } from "../../types/social";
import ImageCarousel from "./ImageCarousel";
import { User } from "lucide-react";

export default function StoryCard({ story }: { story: Story }) {
  return (
    <article className="card p-4">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full bg-[var(--primary)]/10 grid place-items-center">
          <User className="size-5 text-[var(--primary)]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">{story.title}</h3>
            <span className="app-text-caption subtle">{story.author?.name}</span>
          </div>
          <p className="app-text-body text-[var(--foreground)]/80 mt-2">
            {story.description}
          </p>
          {Array.isArray(story.images) && story.images.length > 0 && (
            <div className="mt-3">
              <ImageCarousel images={story.images} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
