"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageSlider } from "@/components/ui/organisms/image-slider";
import { asset } from "@/lib/assets";
import type { Story } from "../../types/social";
import { Portal } from "@/components/ui/atoms/portal";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { Tooltip } from "@/components/ui/molecules/tooltip";

type Img = string | { url?: string | null } | null | undefined;

export function StoryViewer({
  open,
  story,
  onClose,
  onPrev,
  onNext,
}: {
  open: boolean;
  story: (Story & { images?: Img[] }) | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const { t, isRtl } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") isRtl ? onNext?.() : onPrev?.();
      if (e.key === "ArrowRight") isRtl ? onPrev?.() : onNext?.();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext, isRtl]);

  const slides = (story?.images || []).map((u: Img) => ({
    url: typeof u === "string" ? u : u?.url ?? undefined,
    alt: story?.title || "Story media",
  }));

  const authorId = story?.user?.id || story?.author?.id;

  return (
    <Portal>
      <AnimatePresence>
        {open && story && (
          <motion.div
            className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-foreground/70 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={story.title}
              className="relative z-[61] flex h-[min(780px,90vh)] w-[min(420px,92vw)] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              {/* Full-bleed media stage */}
              <div className="relative min-h-0 flex-1 bg-[var(--muted)]">
                {story.videoUrl ? (
                  <video
                    src={asset(story.videoUrl)}
                    controls
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <ImageSlider
                    images={slides}
                    heightClass="h-full min-h-0"
                    className="!absolute inset-0 size-full"
                    sizes="(max-width: 640px) 92vw, 420px"
                  />
                )}

                {/* Overlay header */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/70 via-black/35 to-transparent p-3 pt-4">
                  <div className="pointer-events-auto flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Link
                        href={authorId ? `/profile/${authorId}` : "#"}
                        onClick={(e) => {
                          if (!authorId) e.preventDefault();
                        }}
                        className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-white/15 text-white ring-1 ring-white/30"
                      >
                        <Image
                          src={asset(story.user?.photo)}
                          alt="author"
                          className="size-7 rounded-full object-cover"
                          width={28}
                          height={28}
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={authorId ? `/profile/${authorId}` : "#"}
                          onClick={(e) => {
                            if (!authorId) e.preventDefault();
                          }}
                          className="line-clamp-1 font-medium text-white hover:underline"
                        >
                          {story.title}
                        </Link>
                        {story.createdAt && (
                          <div className="app-text-caption text-white/70">
                            {new Date(story.createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <Tooltip content={t("storyClose")} side="bottom">
                      <button
                        className="grid size-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm ring-1 ring-white/20 hover:bg-black/50"
                        aria-label={t("storyClose")}
                        onClick={onClose}
                      >
                        <X className="size-5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Description overlay (bottom) */}
                {story.description && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-4 pb-5">
                    <p className="pointer-events-auto app-text-body whitespace-pre-line text-white/90 line-clamp-4">
                      {story.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Story navigation (prev/next story) */}
              <div className="pointer-events-none absolute inset-y-0 left-2 right-2 z-40">
                <div className="flex h-full items-center justify-between">
                  <Tooltip content={t("storyPrev")} side={isRtl ? "left" : "right"}>
                    <button
                      className="pointer-events-auto glass size-10 grid place-items-center rounded-full"
                      aria-label={t("storyPrev")}
                      onClick={onPrev}
                    >
                      {isRtl ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                  </Tooltip>
                  <Tooltip content={t("storyNext")} side={isRtl ? "right" : "left"}>
                    <button
                      className="pointer-events-auto glass size-10 grid place-items-center rounded-full"
                      aria-label={t("storyNext")}
                      onClick={onNext}
                    >
                      {isRtl ? <ChevronLeft /> : <ChevronRight />}
                    </button>
                  </Tooltip>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
