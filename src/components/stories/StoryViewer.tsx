"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { ImageSlider } from "@/components/ui/image-slider";
import { asset } from "@/lib/assets";
import type { Story } from "../../types/social";
import { Portal } from "@/components/ui/portal";

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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  const slides = (story?.images || []).map((u: Img) => ({
    url: typeof u === "string" ? u : u?.url ?? undefined,
    alt: story?.title || "Story media",
  }));

  return (
    <Portal>
      <AnimatePresence>
        {open && story && (
          <motion.div
            className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={story.title}
              className="relative w-[min(960px,92vw)] max-h-[90vh] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] z-[61]"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-[hsl(var(--primary))]/15 grid place-items-center text-[hsl(var(--primary))]">
                    {story.author?.name?.[0] || "A"}
                  </div>
                  <div>
                    <div className="font-medium line-clamp-1">
                      {story.title}
                    </div>
                    {story.createdAt && (
                      <div className="text-xs subtle">
                        {new Date(story.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="icon-btn"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* media */}
              <div className="p-4 md:p-5">
                {story.videoUrl ? (
                  <div className="relative rounded-xl overflow-hidden pt-[56%]">
                    <video
                      src={asset(story.videoUrl)}
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 to-black/0" />
                  </div>
                ) : (
                  <ImageSlider images={slides} aspect="16/9" />
                )}
                {story.description && (
                  <p className="mt-3 text-sm text-[hsl(var(--foreground))]/85 whitespace-pre-line">
                    {story.description}
                  </p>
                )}
              </div>

              {/* navigation */}
              <div className="absolute inset-y-0 left-2 right-2 pointer-events-none">
                <div className="h-full flex items-center justify-between">
                  <button
                    className="pointer-events-auto glass size-10 grid place-items-center rounded-full"
                    aria-label="Previous story"
                    onClick={onPrev}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    className="pointer-events-auto glass size-10 grid place-items-center rounded-full"
                    aria-label="Next story"
                    onClick={onNext}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
