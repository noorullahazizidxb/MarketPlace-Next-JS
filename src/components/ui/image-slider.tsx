"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { url?: string | null; alt?: string | null };

export function ImageSlider({
  images,
  className = "",
  aspect = "4/1",
  heightClass,
  sizes = "(max-width: 768px) 100vw, 33vw",
  autoPlay = true,
  intervalMs = 5000,
}: {
  images?: Slide[] | null;
  className?: string;
  aspect?: string; // e.g. "16/9" or "16/10"; ignored when heightClass is provided
  heightClass?: string; // optional fixed height class (e.g., "h-56 md:h-72")
  sizes?: string; // next/image sizes attribute override
  autoPlay?: boolean; // enable/disable autoplay
  intervalMs?: number; // autoplay interval
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
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
  // Respect reduced motion preferences
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [inView, setInView] = useState(true);

  // Observe visibility to avoid running autoplay offscreen
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setInView(!!e?.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => {
      try {
        obs.disconnect();
      } catch {}
    };
  }, []);

  useEffect(() => {
    // simple autoplay
    if (timer.current) window.clearInterval(timer.current);
    if (autoPlay && !prefersReducedMotion && inView && slides.length > 1) {
      timer.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, intervalMs);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [slides.length, autoPlay, prefersReducedMotion, intervalMs, inView]);

  // Scroll to active index when it changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const left = index * el.clientWidth;
    el.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className}`}>
      <div
        className={`w-full ${
          heightClass ? heightClass : getAspectClass(aspect)
        }`}
      >
        <div
          ref={scrollerRef}
          // Force LTR scrolling behavior regardless of page language
          dir="ltr"
          className={
            "h-full flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
          }
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
                sizes={sizes}
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : "auto"}
                draggable={false}
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
            className={`absolute left-2 top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full z-20`}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full z-20`}
          >
            <ChevronRight className="size-5" />
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
