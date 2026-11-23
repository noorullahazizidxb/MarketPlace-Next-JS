"use client";

import React, { useRef, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { useApiGet } from "@/lib/api-hooks";
import { StoryViewer } from "@/components/stories/StoryViewer";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip } from "@/components/ui/molecules/tooltip";
import {
  resolveStoryCoverSrc,
  STORY_BUBBLE,
} from "@/components/stories/story-media";
import type { Story } from "@/types/social";

export default function StoriesBar() {
  const { t } = useLanguage();
  const { data: stories, isLoading } = useApiGet<Story[]>(
    ["stories"],
    "/stories",
  );
  const scroller = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };
  const onPrev = () => setActive((i) => Math.max(0, i - 1));
  const onNext = () =>
    setActive((i) => Math.min((stories?.length || 1) - 1, i + 1));

  const scrollBy = (delta: number) => {
    scroller.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative min-w-0">
      {/* Edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-linear-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-linear-to-l from-background to-transparent"
      />

      <div
        ref={scroller}
        className="overflow-x-auto no-scrollbar"
        aria-label={t("storiesAriaLabel")}
      >
        <div className="flex items-start gap-3 px-1 py-1">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={STORY_BUBBLE.widthClass}>
                <div
                  className={`${STORY_BUBBLE.sizeClass} animate-pulse rounded-full bg-[color-mix(in oklab, var(--foreground) 8%, transparent)]`}
                />
                <div className="mx-auto mt-2 h-3 w-3/4 rounded bg-[color-mix(in oklab, var(--foreground) 8%, transparent)]" />
              </div>
            ))}
          {!isLoading &&
            stories?.map((s, i) => (
              <button
                key={s.id ?? i}
                type="button"
                className={`group ${STORY_BUBBLE.widthClass} focus:outline-none hover:bg-transparent`}
                aria-label={s.title || "Story"}
                onClick={() => openAt(i)}
              >
                <div
                  className={`relative ${STORY_BUBBLE.sizeClass} rounded-full bg-gradient-to-br from-[color-mix(in oklab, var(--primary) 70%, transparent)] via-[color-mix(in oklab, var(--secondary) 70%, transparent)] to-[color-mix(in oklab, var(--accent) 70%, transparent)] p-[2px] transition-transform duration-200 group-hover:scale-105`}
                >
                  <div className="relative size-full overflow-hidden rounded-full bg-[var(--background)] ring-2 ring-[var(--background)]">
                    <Image
                      src={resolveStoryCoverSrc(s)}
                      alt={s.title || "Story"}
                      fill
                      className="object-cover"
                      sizes={STORY_BUBBLE.sizes}
                    />
                  </div>
                </div>
                <div className="app-text-caption mt-1.5 line-clamp-1 text-center opacity-80 group-hover:opacity-100">
                  {s.title}
                </div>
              </button>
            ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[2]">
        <div className="flex h-full items-center justify-between px-0.5">
          <Tooltip
            content={t("storiesScrollLeft" as any) || "Scroll left"}
            side="right"
          >
            <button
              type="button"
              className="pointer-events-auto glass grid size-8 place-items-center rounded-full"
              aria-label={t("storiesScrollLeft")}
              onClick={() => scrollBy(-220)}
            >
              <ChevronLeft className="size-4" />
            </button>
          </Tooltip>
          <Tooltip
            content={t("storiesScrollRight" as any) || "Scroll right"}
            side="left"
          >
            <button
              type="button"
              className="pointer-events-auto glass grid size-8 place-items-center rounded-full"
              aria-label={t("storiesScrollRight")}
              onClick={() => scrollBy(220)}
            >
              <ChevronRight className="size-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      <StoryViewer
        open={open}
        story={stories?.[active] || null}
        onClose={() => setOpen(false)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
