"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { ListingCard, type Listing } from "../ui/listing-card";
import { useEngagedAutoplay } from "@/hooks/use-engaged-autoplay";
import { Tooltip } from "@/components/ui/tooltip";

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

    const autoplayEnabled = pauseOnHover ? !isEngaged : true;
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

  const announce = `Slide ${Math.min(idx + 1, slides.length)} of ${slides.length}`;

  if (hidden.length === 0) return null;

  return (
    <section
      ref={rootRef as any}
      dir="ltr"
      className="relative isolate overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur-xl sm:p-5 lg:p-6"
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_0%_0%,color-mix(in_oklab,var(--primary)_13%,transparent),transparent_70%)]" />
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 app-text-micro font-semibold uppercase tracking-[0.12em] text-primary">
            <Sparkles className="size-3" /> Curated marketplace
          </div>
          <h2 className="app-text-heading font-semibold tracking-tight">
            Promoted listings
          </h2>
          <p className="mt-1 max-w-2xl app-text-body text-muted-foreground">
            Seller-protected offers backed by an available marketplace representative.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Previous" side="bottom">
            <button
              aria-label="Previous"
              onClick={prev}
              disabled={slides.length <= 1}
              className="grid size-10 place-items-center rounded-xl border border-border bg-background/75 text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/8 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
          </Tooltip>
          <Tooltip content="Next" side="bottom">
            <button
              aria-label="Next"
              onClick={next}
              disabled={slides.length <= 1}
              className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[1.35rem] border border-border/60 bg-background/55">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(600px_240px_at_100%_120%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_70%)]" />
        <div className="relative p-3 sm:p-4">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: dir === 1 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 1 ? -40 : 40 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 items-stretch gap-[var(--space-gap)] sm:grid-cols-2 lg:grid-cols-3 app-density-grid-gap"
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

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 app-text-caption text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          {hidden.length} protected {hidden.length === 1 ? "offer" : "offers"}
        </span>
        <div className="flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              if (i === idx) return;
              setDir(i > idx ? 1 : -1);
              setIdx(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === idx
                ? "w-6 bg-primary"
                : "w-2 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
        </div>
      </div>
    </section>
  );
}
