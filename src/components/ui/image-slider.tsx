"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";
import { ChevronLeft, ChevronRight, LoaderIcon } from "lucide-react";
import { useEngagedAutoplay } from "@/hooks/use-engaged-autoplay";
import { Tooltip } from "@/components/ui/tooltip";

type Slide = { url?: string | null; alt?: string | null };

export function ImageSlider({
  images,
  className = "",
  aspect = "4/1",
  heightClass,
  sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1536px) 30vw, 22vw",
  autoPlay = false,
  forceEngaged = false,
  intervalMs = 5000,
  firstSlideIsPriority = false,
}: {
  images?: Slide[] | null;
  className?: string;
  aspect?: string; // e.g. "16/9" or "16/10"; ignored when heightClass is provided
  heightClass?: string; // optional fixed height class (e.g., "h-56 md:h-72")
  sizes?: string; // next/image sizes attribute override
  autoPlay?: boolean; // enable/disable autoplay
  forceEngaged?: boolean; // parent-driven engagement (e.g., wrapper hover/focus)
  intervalMs?: number; // autoplay interval
  firstSlideIsPriority?: boolean; // whether the first slide gets priority loading
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
  // Cache container width to avoid reading clientWidth (forced reflow) on every slide change
  const cachedWidthRef = useRef<number>(0);
  // Respect reduced motion preferences
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [inView, setInView] = useState(true);

  // Cache scroller width via ResizeObserver — avoids forced reflow on slide change
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    // Seed the initial value
    cachedWidthRef.current = el.clientWidth;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) cachedWidthRef.current = entry.contentRect.width;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  // Scroll to active index when it changes — use cached width to avoid forced reflow
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = cachedWidthRef.current || el.offsetWidth;
    el.scrollTo({ left: index * width, behavior: "smooth" });
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
              firstSlideIsPriority={firstSlideIsPriority}
            />
          ))}
        </div>
      </div>

      {/* controls */}
      {slides.length > 1 && (
        <>
          <Tooltip content="Previous image" side="right">
            <button
              type="button"
              aria-label="Previous image"
              data-slider-control="true"
              onClick={(event) => {
                event.stopPropagation();
                setIndex((i) => (i - 1 + slides.length) % slides.length);
              }}
              className={`absolute left-3 top-1/2 -translate-y-1/2 bg-[hsl(var(--background))]/60 backdrop-blur-md hover:bg-[hsl(var(--background))]/90 border border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] size-9 grid place-items-center rounded-full z-20 shadow-lg`}
            >
              <ChevronLeft className="size-5 text-[hsl(var(--foreground))]" />
            </button>
          </Tooltip>
          <Tooltip content="Next image" side="left">
            <button
              type="button"
              aria-label="Next image"
              data-slider-control="true"
              onClick={(event) => {
                event.stopPropagation();
                setIndex((i) => (i + 1) % slides.length);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 bg-[hsl(var(--background))]/60 backdrop-blur-md hover:bg-[hsl(var(--background))]/90 border border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] size-9 grid place-items-center rounded-full z-20 shadow-lg`}
            >
              <ChevronRight className="size-5 text-[hsl(var(--foreground))]" />
            </button>
          </Tooltip>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-2 z-30 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md">
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
                className={`transition-all duration-300 rounded-full go-to-slide ${i === index
                  ? "w-4 h-1.5 bg-white scale-1"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80 hover:scale-125"
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
  firstSlideIsPriority,
}: {
  slide: { url?: string | null; alt?: string | null };
  index: number;
  sizes: string;
  isActive: boolean;
  firstSlideIsPriority: boolean;
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
        loading={firstSlideIsPriority && index === 0 ? "eager" : "lazy"}
        priority={firstSlideIsPriority && index === 0}
        fetchPriority={firstSlideIsPriority && index === 0 ? "high" : "auto"}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
