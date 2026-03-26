"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";
import { ChevronLeft, ChevronRight, LoaderIcon } from "lucide-react";
import { useEngagedAutoplay } from "@/hooks/use-engaged-autoplay";

type Slide = { url?: string | null; alt?: string | null };

export function ImageSlider({
  images,
  className = "",
  aspect = "4/1",
  heightClass,
  sizes = "(max-width: 768px) 100vw, 33vw",
  autoPlay = false,
  forceEngaged = false,
  intervalMs = 5000,
}: {
  images?: Slide[] | null;
  className?: string;
  aspect?: string; // e.g. "16/9" or "16/10"; ignored when heightClass is provided
  heightClass?: string; // optional fixed height class (e.g., "h-56 md:h-72")
  sizes?: string; // next/image sizes attribute override
  autoPlay?: boolean; // enable/disable autoplay
  forceEngaged?: boolean; // parent-driven engagement (e.g., wrapper hover/focus)
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
  const immediateTimer = useRef<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { isEngaged, engagementProps } = useEngagedAutoplay();
  const prevActiveRef = useRef(false);
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
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );
    obs.observe(el);
    return () => {
      try {
        obs.disconnect();
      } catch { }
    };
  }, []);

  useEffect(() => {
    const activeNow = autoPlay && (isEngaged || forceEngaged);
    const justActivated = activeNow && !prevActiveRef.current;
    prevActiveRef.current = activeNow;

    // simple autoplay
    if (timer.current) window.clearInterval(timer.current);
    if (immediateTimer.current) window.clearTimeout(immediateTimer.current);
    if (
      autoPlay &&
      (isEngaged || forceEngaged) &&
      !prefersReducedMotion &&
      inView &&
      slides.length > 1
    ) {
      if (justActivated) {
        immediateTimer.current = window.setTimeout(() => {
          setIndex((i) => (i + 1) % slides.length);
        }, 120);
      }
      timer.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, intervalMs);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      if (immediateTimer.current) window.clearTimeout(immediateTimer.current);
    };
  }, [
    slides.length,
    autoPlay,
    isEngaged,
    forceEngaged,
    prefersReducedMotion,
    intervalMs,
    inView,
  ]);

  // Scroll to active index when it changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const left = index * el.clientWidth;
    el.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden ${className}`}
      tabIndex={0}
      {...engagementProps}
    >
      <div
        className={`w-full ${heightClass ? heightClass : getAspectClass(aspect)
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
            <SlideImage
              key={i}
              slide={s}
              index={i}
              sizes={sizes}
              isActive={i === index}
            />
          ))}
        </div>
      </div>

      {/* controls */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            data-slider-control="true"
            onClick={(event) => {
              event.stopPropagation();
              setIndex((i) => (i - 1 + slides.length) % slides.length);
            }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full z-20`}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            data-slider-control="true"
            onClick={(event) => {
              event.stopPropagation();
              setIndex((i) => (i + 1) % slides.length);
            }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full z-20`}
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-2 z-30">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                data-slider-control="true"
                onClick={(event) => {
                  event.stopPropagation();
                  setIndex(i);
                }}
                className={`w-2 h-2 rounded-full go-to-slide ${i === index
                  ? "bg-[hsl(var(--accent))]"
                  : "bg-[hsl(var(--foreground))/0.4]"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sub-component: individual slide with loading spinner ────────────────────
function SlideImage({
  slide,
  index,
  sizes,
  isActive,
}: {
  slide: { url?: string | null; alt?: string | null };
  index: number;
  sizes: string;
  isActive: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative min-w-full h-full snap-start">
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--muted))]/50 z-10"
        >
          <LoaderIcon className="animate-spin size-6 text-[hsl(var(--muted-foreground))]" />
        </span>
      )}
      <Image
        src={asset(slide?.url) || "/images/placeholder-card.jpg"}
        alt={slide?.alt || `Slide ${index + 1}`}
        fill
        className="object-cover will-change-transform"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnIC8+PC9zdmc+"
        sizes={sizes}
        loading={index === 0 ? "eager" : "lazy"}
        priority={index === 0}
        fetchPriority={index === 0 ? "high" : "auto"}
        draggable={false}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
