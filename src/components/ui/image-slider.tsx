"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";
import { useLanguage } from "@/components/providers/language-provider";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { url?: string | null; alt?: string | null };

export function ImageSlider({
  images,
  className = "",
  aspect = "4/1",
  heightClass,
}: {
  images?: Slide[] | null;
  className?: string;
  aspect?: string; // e.g. "16/9" or "16/10"
  heightClass?: string; // optional fixed height class (e.g., "h-56 md:h-72")
}) {
  const getAspectClass = (a: string) => {
    switch (a) {
      case "16/9":
        return "ar-16-9";
      case "4/1":
        return "ar-4-1";
      case "1/1":
        return "ar-1-1";
      case "3/2":
        return "ar-3-2";
      default:
        return "ar-16-9";
    }
  };
  const slides =
    Array.isArray(images) && images.length > 0
      ? images
      : [{ url: "/images/placeholder-card.jpg", alt: "placeholder" }];
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { isRtl } = useLanguage();

  useEffect(() => {
    // simple autoplay
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [slides.length, isRtl]);

  // Scroll to active index when it changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const left = index * el.clientWidth;
    // Flip direction for RTL by scrolling from the right edge
    const target = isRtl ? el.scrollWidth - el.clientWidth - left : left;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, [index, isRtl]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`w-full ${
          heightClass ? heightClass : getAspectClass(aspect)
        }`}
      >
        <div
          ref={scrollerRef}
          className={`h-full flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar ${
            isRtl ? "flex-row-reverse" : ""
          }`}
        >
          {slides.map((s, i) => (
            <div key={i} className="relative min-w-full h-full snap-start">
              <Image
                src={asset(s?.url) || "/images/placeholder-card.jpg"}
                alt={s?.alt || `Slide ${i + 1}`}
                fill
                className="object-cover will-change-transform"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnIC8+PC9zdmc+"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={() =>
              setIndex((i) => (i - 1 + slides.length) % slides.length)
            }
            className={`absolute ${
              isRtl ? "right-2" : "left-2"
            } top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full z-20`}
          >
            {isRtl ? (
              <ChevronRight className="size-5" />
            ) : (
              <ChevronLeft className="size-5" />
            )}
          </button>
          <button
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className={`absolute ${
              isRtl ? "left-2" : "right-2"
            } top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full z-20`}
          >
            {isRtl ? (
              <ChevronLeft className="size-5" />
            ) : (
              <ChevronRight className="size-5" />
            )}
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-2 z-30">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
