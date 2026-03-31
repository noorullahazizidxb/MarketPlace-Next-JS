"use client";
import React, { useRef, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { useApiGet } from "@/lib/api-hooks";
import { asset } from "@/lib/assets";
import { StoryViewer } from "@/components/stories/StoryViewer";
import Image from "next/image";
import { Tooltip } from "@/components/ui/tooltip";

export default function StoriesBar() {
  const { t } = useLanguage();
  const { data: stories, isLoading } = useApiGet<any[]>(
    ["stories"],
    "/stories"
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

  return (
    <div className="relative card p-3">
      <div
        ref={scroller}
        className="overflow-x-auto no-scrollbar"
        aria-label={t("storiesAriaLabel")}
      >
        <div className="flex items-center gap-3 w-max">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-20 flex-shrink-0">
                <div className="size-16 rounded-2xl bg-[hsl(var(--foreground))/0.08] animate-pulse" />
                <div className="mt-2 h-3 rounded bg-[hsl(var(--foreground))/0.08]" />
              </div>
            ))}
          {!isLoading &&
            stories?.map((s, i) => (
              <button
                key={s.id}
                className="group w-20 flex-shrink-0 focus:outline-none hover:bg-transparent"
                aria-label={s.title}
                onClick={() => openAt(i)}
              >
                <div className="relative size-16 rounded-2xl p-0.5 bg-gradient-to-br from-[hsl(var(--primary))/0.6] via-[hsl(var(--secondary))/0.6] to-[hsl(var(--accent))/0.6]">
                  <div className="size-full rounded-[14px] bg-[hsl(var(--background))] grid place-items-center overflow-hidden">
                    <Image
                      src={asset(
                        (Array.isArray(s.images) && s.images.length > 0
                          ? typeof s.images[0] === "string"
                            ? s.images[0]
                            : s.images[0]?.url
                          : undefined) || "/images/placeholder-card.jpg"
                      )}
                      alt={s.title}
                      className="size-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                </div>
                <div className="mt-1 text-[11px] line-clamp-1 opacity-80 group-hover:opacity-100">
                  {s.title}
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Scroll buttons */}
      <div className="pointer-events-none absolute inset-y-0 left-1 right-1">
        <div className="h-full flex items-center justify-between">
          <Tooltip content={t("storiesScrollLeft" as any) || "Scroll left"} side="right">
            <button
              className="pointer-events-auto glass size-8 grid place-items-center rounded-full"
              aria-label={t("storiesScrollLeft")}
              onClick={() =>
                scroller.current?.scrollBy({ left: -220, behavior: "smooth" })
              }
            >
              ‹
            </button>
          </Tooltip>
          <Tooltip content={t("storiesScrollRight" as any) || "Scroll right"} side="left">
            <button
              className="pointer-events-auto glass size-8 grid place-items-center rounded-full"
              aria-label={t("storiesScrollRight")}
              onClick={() =>
                scroller.current?.scrollBy({ left: 220, behavior: "smooth" })
              }
            >
              ›
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Viewer modal */}
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
