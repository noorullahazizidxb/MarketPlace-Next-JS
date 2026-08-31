"use client";

/**
 * Stories bar variants — V2 (Cards) and V3 (Strip).
 * V1 (Bubble) is the original StoriesBar.tsx.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Eye } from "lucide-react";
import { useApiGet } from "@/lib/api-hooks";
import { asset, DEFAULT_LISTING_IMAGE } from "@/lib/assets";
import { StoryViewer } from "@/components/stories/StoryViewer";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/cn";

function resolveImage(s: any): string {
  const raw =
    Array.isArray(s.images) && s.images.length > 0
      ? typeof s.images[0] === "string"
        ? s.images[0]
        : s.images[0]?.url
      : undefined;
  return asset(raw || DEFAULT_LISTING_IMAGE) || DEFAULT_LISTING_IMAGE;
}

// ── V2: Wide Cards ────────────────────────────────────────────────────────────
// Each story is a vertical card with a preview image, title and a "Watch" CTA.

export function StoriesBarCards({ className }: { className?: string }) {
  const { t } = useLanguage();
  const { data: stories, isLoading } = useApiGet<any[]>(
    ["stories"],
    "/stories",
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };
  const onPrev = () => setActive((i) => Math.max(0, i - 1));
  const onNext = () =>
    setActive((i) => Math.min((stories?.length ?? 1) - 1, i + 1));

  return (
    <section className={cn("space-y-2", className)}>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-32 shrink-0 space-y-1.5">
              <div className="h-44 w-full rounded-2xl bg-muted animate-pulse" />
              <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
            </div>
          ))}
        {stories?.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => openAt(i)}
            className="group relative w-32 shrink-0 overflow-hidden rounded-2xl focus:outline-none"
          >
            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden rounded-2xl">
              <Image
                src={resolveImage(s)}
                alt={s.title}
                fill
                className="object-cover transition-transform duration-400 group-hover:scale-105"
                sizes="128px"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

              {/* Play indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="grid size-10 place-items-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/40">
                  <Play className="size-4 text-white fill-white" />
                </span>
              </div>

              {/* Title */}
              <p className="absolute bottom-2 inset-x-2 text-white app-text-caption font-medium line-clamp-2 text-left leading-snug">
                {s.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      <StoryViewer
        open={open}
        story={stories?.[active] ?? null}
        onClose={() => setOpen(false)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </section>
  );
}

// ── V3: Strip ─────────────────────────────────────────────────────────────────
// Full-width horizontal strips — cinematic, editorial.

export function StoriesBarStrip({ className }: { className?: string }) {
  const { t } = useLanguage();
  const { data: stories, isLoading } = useApiGet<any[]>(
    ["stories"],
    "/stories",
  );
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };
  const onPrev = () => setActive((i) => Math.max(0, i - 1));
  const onNext = () =>
    setActive((i) => Math.min((stories?.length ?? 1) - 1, i + 1));

  return (
    <section className={cn("relative", className)}>
      {/* Scroll hint arrows */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() =>
          scroller.current?.scrollBy({ left: -280, behavior: "smooth" })
        }
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-background/80 backdrop-blur shadow-soft ring-1 ring-border/40"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() =>
          scroller.current?.scrollBy({ left: 280, behavior: "smooth" })
        }
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-background/80 backdrop-blur shadow-soft ring-1 ring-border/40"
      >
        <ChevronRight className="size-4" />
      </button>

      <div
        ref={scroller}
        className="flex gap-2 overflow-x-auto no-scrollbar px-10"
      >
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 w-56 shrink-0 rounded-xl bg-muted animate-pulse"
            />
          ))}
        {stories?.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => openAt(i)}
            className="group relative h-20 w-56 shrink-0 overflow-hidden rounded-xl focus:outline-none"
          >
            <Image
              src={resolveImage(s)}
              alt={s.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="224px"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center gap-2.5 px-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full ring-2 ring-white/40 bg-white/10 backdrop-blur-sm">
                <Eye className="size-3.5 text-white" />
              </span>
              <p className="text-white app-text-label font-medium line-clamp-2 text-left leading-snug">
                {s.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      <StoryViewer
        open={open}
        story={stories?.[active] ?? null}
        onClose={() => setOpen(false)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </section>
  );
}
