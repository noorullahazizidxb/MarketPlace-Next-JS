"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListingCard, type Listing } from "../ui/listing-card";
import { useEngagedAutoplay } from "@/hooks/use-engaged-autoplay";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function HiddenListingsSlider({
  items,
  autoplayInterval = 5000,
  pauseOnHover = true,
}: {
  items: Listing[];
  autoplayInterval?: number; // ms
  pauseOnHover?: boolean;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(true);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { isEngaged, setIsEngaged, engagementProps } = useEngagedAutoplay();

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
  // Accept HIDDEN explicitly, plus support older HIDE_SELLER for safety
  const hidden = useMemo(() => {
    return (items || []).filter((it) => {
      const cv = String(it.contactVisibility ?? "").toUpperCase();
      if (!cv) return false;
      if (cv === "HIDDEN" || cv === "HIDE_SELLER") return true;
      return cv !== "SHOW_SELLER"; // treat any other value as hidden for safety
    });
  }, [items]);

  // responsive chunk size: 1 on small screens, 2 on md, 3 on lg+
  const [chunkSize, setChunkSize] = useState(3);
  useEffect(() => {
    const compute = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1200;
      if (w < 640) return 1; // sm
      if (w < 1024) return 2; // md
      return 3; // lg+
    };
    const apply = () => setChunkSize(compute());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const slides = useMemo(() => chunk(hidden, chunkSize), [hidden, chunkSize]);
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const next = () => {
    setDir(1);
    setIdx((i) => (i + 1) % Math.max(slides.length || 1, 1));
  };

  const prev = () => {
    setDir(-1);
    setIdx(
      (i) =>
        (i - 1 + Math.max(slides.length || 1, 1)) %
        Math.max(slides.length || 1, 1),
    );
  };

  // When slides length shrinks, ensure idx is in range
  useEffect(() => {
    if (slides.length === 0) {
      setIdx(0);
      return;
    }
    if (idx >= slides.length) setIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  // autoplay effect
  useEffect(() => {
    // clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const autoplayEnabled = pauseOnHover ? isEngaged : true;
    if (!autoplayEnabled) return;
    if (prefersReducedMotion) return;
    if (!inView) return;

    if (slides.length <= 1) return;

    // window.setInterval returns number in browsers
    intervalRef.current = window.setInterval(
      () => {
        // autoplay moves forward
        setDir(1);
        setIdx((i) => (i + 1) % slides.length);
      },
      Math.max(500, autoplayInterval),
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    autoplayInterval,
    isEngaged,
    pauseOnHover,
    slides.length,
    inView,
    prefersReducedMotion,
  ]);

  const announce = `Slide ${Math.min(idx + 1, slides.length)} of ${slides.length
    }`;

  if (hidden.length === 0) return null;

  return (
    <section
      ref={rootRef as any}
      dir="ltr"
      className="relative mt-8"
      {...engagementProps}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hidden listings carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        }
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">
          Promoted Listings
        </h3>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={prev}
            className="size-9 rounded-full grid place-items-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground))/0.1]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="size-9 rounded-full grid place-items-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground))/0.1]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(600px_200px_at_10%_-20%,hsl(var(--primary)/0.12),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(600px_200px_at_90%_120%,hsl(var(--accent)/0.12),transparent_70%)]" />
        <div className="relative p-4 min-h-[320px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: dir === 1 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 1 ? -40 : 40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragStart={() => setIsEngaged(true)}
              onDragEnd={(
                _e: PointerEvent | MouseEvent | TouchEvent,
                info: PanInfo,
              ) => {
                // determine swipe direction by offset or velocity
                const offset = info.offset.x;
                const velocity = info.velocity.x;
                const THRESHOLD = 80; // px
                const VEL = 500; // px/s
                // user swiped left (next)
                if (offset < -THRESHOLD || velocity < -VEL) {
                  setDir(1);
                  setIdx((i) => (i + 1) % Math.max(slides.length || 1, 1));
                } else if (offset > THRESHOLD || velocity > VEL) {
                  setDir(-1);
                  setIdx(
                    (i) =>
                      (i - 1 + Math.max(slides.length || 1, 1)) %
                      Math.max(slides.length || 1, 1),
                  );
                }
              }}
            >
              {slides[idx]?.map((it) => (
                <ListingCard
                  key={it.id}
                  listing={it}
                  cleanImageOverlayOnEngage
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              if (i === idx) return;
              setDir(i > idx ? 1 : -1);
              setIdx(i);
            }}
            className={
              i === idx
                ? "go-to-slide size-1.5 rounded-full"
                : "size-1.5 rounded-full bg-[hsl(var(--foreground))/0.3] hover:opacity-90"
            }
          />
        ))}
      </div>
    </section>
  );
}
