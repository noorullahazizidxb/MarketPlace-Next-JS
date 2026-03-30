"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ImageSpinner } from "@/components/ui/spinner";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Tag as TagIcon,
  ShieldCheck,
} from "lucide-react";
import { useApiGet } from "@/lib/api-hooks";
import { asset } from "@/lib/assets";
import { useEngagedAutoplay } from "@/hooks/use-engaged-autoplay";

type ListingLite = {
  id: string | number;
  title?: string | null;
  description?: string | null;
  images?: { url?: string | null; alt?: string | null }[];
  price?: string | number | null;
  currency?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  categoryId?: string | number | null;
  category?: { id?: string | number | null; name?: string | null } | null;
};

export function RelatedListingsSlider({
  categoryId,
  currentId,
  limit = 12,
  title = "Related Listings",
}: {
  categoryId?: string | number | null;
  currentId: string | number;
  limit?: number;
  title?: string;
}) {
  // Fetch all listings and filter client-side to follow existing patterns
  const { data, isLoading, error } = useApiGet<ListingLite[] | ListingLite>(
    ["listings", "all"],
    "/listings"
  );

  const all: ListingLite[] = useMemo(
    () => (Array.isArray(data) ? data : data ? [data] : []),
    [data]
  );

  const related: ListingLite[] = useMemo(() => {
    if (!categoryId) return [];
    const cid = String(categoryId);
    return all
      .filter((it) => String(it.id) !== String(currentId))
      .filter((it) => {
        const itemCid = (it as any).categoryId ?? it.category?.id;
        return itemCid != null && String(itemCid) === cid;
      })
      .slice(0, Math.max(3, limit));
  }, [all, categoryId, currentId, limit]);

  // Top rated: across all listings, sorted by averageRating desc
  const topRated: ListingLite[] = useMemo(() => {
    return [...all]
      .filter((it) => String(it.id) !== String(currentId))
      .filter((it) => typeof it.averageRating === "number")
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, Math.max(3, limit));
  }, [all, currentId, limit]);

  // Promoted: try common signals - contactVisibility !== SHOW_SELLER OR presence of a promoted flag
  const promoted: ListingLite[] = useMemo(() => {
    return all
      .filter((it) => String(it.id) !== String(currentId))
      .filter((it) => {
        const cv = String((it as any).contactVisibility ?? "").toUpperCase();
        if (cv && cv !== "SHOW_SELLER") return true; // treat as promoted/paid
        // fallback: check a promoted boolean or flag
        if ((it as any).promoted === true) return true;
        return false;
      })
      .slice(0, Math.max(3, limit));
  }, [all, currentId, limit]);

  if (isLoading) return null;
  if (error) return null;
  // If there are no items across all buckets, don't render
  const anyCount =
    (related?.length || 0) + (topRated?.length || 0) + (promoted?.length || 0);
  if (!anyCount) return null;

  return (
    <TabbedHeroCarousel
      related={related}
      topRated={topRated}
      promoted={promoted}
      title={title}
    />
  );
}

function HeroCarousel({
  items,
  title,
}: {
  items: ListingLite[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const intervalRef = useRef<number | null>(null);
  const { isEngaged, engagementProps } = useEngagedAutoplay();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const visible = items; // no windowing for simplicity

  const next = useCallback(() => {
    setDir(1);
    setIndex((i) => (i + 1) % visible.length);
  }, [visible.length]);
  const prev = useCallback(() => {
    setDir(-1);
    setIndex((i) => (i - 1 + visible.length) % visible.length);
  }, [visible.length]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!isEngaged || prefersReducedMotion || visible.length <= 1) return;
    intervalRef.current = window.setInterval(next, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isEngaged, prefersReducedMotion, visible.length, next]);

  return (
    <section
      className="relative mt-10"
      {...engagementProps}
      tabIndex={0}
      aria-label={title}
      role="region"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-10 h-[220px] bg-[radial-gradient(80%_60%_at_50%_0%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[180px] bg-[radial-gradient(60%_50%_at_50%_100%,hsl(var(--accent)/0.15),transparent_60%)]" />
      </div>

      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={prev}
            className="size-10 rounded-full grid place-items-center bg-[hsl(var(--background))]/50 border border-[hsl(var(--border))]/40 hover:bg-[hsl(var(--foreground))]/10 hover:border-transparent hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="size-10 rounded-full grid place-items-center bg-[hsl(var(--background))]/50 border border-[hsl(var(--border))]/40 hover:bg-[hsl(var(--foreground))]/10 hover:border-transparent hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 supports-[backdrop-filter]:bg-[hsl(var(--card))]/60">
        <CarouselTrack
          index={index}
          dir={dir}
          items={visible}
          onSwipePrev={prev}
          onSwipeNext={next}
        />
        <ProgressDots count={visible.length} index={index} onDot={setIndex} />
      </div>
    </section>
  );
}

function TabbedHeroCarousel({
  related,
  topRated,
  promoted,
  title,
}: {
  related: ListingLite[];
  topRated: ListingLite[];
  promoted: ListingLite[];
  title: string;
}) {
  const [tab, setTab] = useState<"related" | "top" | "promoted">("related");

  const items = useMemo(() => {
    if (tab === "related") return related;
    if (tab === "top") return topRated;
    return promoted;
  }, [tab, related, topRated, promoted]);

  // If active tab has no items, fall back to first available
  const effective =
    items && items.length > 0
      ? items
      : related.length
        ? related
        : topRated.length
          ? topRated
          : promoted;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("related")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tab === "related"
              ? "bg-[hsl(var(--card))] text-[hsl(var(--accent))] border border-[hsl(var(--accent))/20]"
              : "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]"
              }`}
          >
            <TagIcon className="size-5" />
            Related
          </button>

          <button
            onClick={() => setTab("top")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tab === "top"
              ? "bg-[hsl(var(--card))] text-[hsl(var(--accent))] border border-[hsl(var(--accent))/20]"
              : "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]"
              }`}
          >
            <Star className="size-4 text-amber-400" />
            Top Rated
          </button>

          <button
            onClick={() => setTab("promoted")}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tab === "promoted"
              ? "bg-[hsl(var(--card))] text-[hsl(var(--accent))] border border-[hsl(var(--accent))/20]"
              : "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]"
              }`}
          >
            <ShieldCheck className="size-4 text-emerald-500" />
            Promoted
          </button>
        </div>
      </div>

      <HeroCarousel items={effective} title={title} />
    </div>
  );
}

function CarouselTrack({
  index,
  dir,
  items,
  onSwipePrev,
  onSwipeNext,
}: {
  index: number;
  dir: 1 | -1;
  items: ListingLite[];
  onSwipePrev: () => void;
  onSwipeNext: () => void;
}) {
  return (
    <div className="relative">
      <div className="relative h-[420px] md:h-[440px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: dir === 1 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === 1 ? -60 : 60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(
              _e: PointerEvent | MouseEvent | TouchEvent,
              info: PanInfo
            ) => {
              const offset = info.offset.x;
              const velocity = info.velocity.x;
              if (offset < -80 || velocity < -600) onSwipeNext();
              else if (offset > 80 || velocity > 600) onSwipePrev();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {slice3(items, index).map((it, i) => (
                <TiltCard key={`${String(it.id)}-${i}`} item={it} rank={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function slice3(arr: ListingLite[], center: number) {
  if (arr.length <= 3) return arr;
  const out: ListingLite[] = [];
  out.push(arr[center % arr.length]);
  out.push(arr[(center + 1) % arr.length]);
  out.push(arr[(center + 2) % arr.length]);
  return out;
}

function TiltCard({ item, rank }: { item: ListingLite; rank: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (px - 0.5) * 8, y: (0.5 - py) * 8 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  const [imgLoaded, setImgLoaded] = useState(false);
  const img = item.images?.[0]?.url
    ? asset(item.images[0]?.url || "")
    : "/favicon.svg";
  const price = item.price != null ? String(item.price) : null;
  const ccy = item.currency || "";
  const rating =
    typeof item.averageRating === "number" ? item.averageRating : null;
  const reviews =
    typeof item.reviewCount === "number" ? item.reviewCount : null;

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      className="relative h-[360px] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -inset-10 opacity-60 mix-blend-soft-light">
        <div className="absolute -inset-16 bg-[radial-gradient(600px_220px_at_10%_-10%,hsl(var(--primary)/0.25),transparent_70%)]" />
        <div className="absolute -inset-16 bg-[radial-gradient(600px_220px_at_90%_120%,hsl(var(--accent)/0.22),transparent_70%)]" />
      </div>

      <div className="relative h-[60%]">
        {!imgLoaded && <ImageSpinner />}
        <Image
          src={img}
          alt={item.title || "Listing"}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className={`object-cover transition-all duration-500 will-change-transform hover:scale-[1.03] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))/0.85] via-transparent to-transparent" />
        {/* Price pill */}
        {price && (
          <div className="absolute top-3 left-3 rounded-full bg-[hsl(var(--background))/0.8] backdrop-blur px-3 py-1 text-xs border border-[hsl(var(--border))] shadow-sm">
            <span className="tabular-nums font-medium">
              {price} {ccy}
            </span>
          </div>
        )}
      </div>

      <div className="relative h-[40%] p-4 flex flex-col">
        <h4 className="text-sm md:text-base font-semibold line-clamp-2 pr-8">
          {item.title || "Untitled"}
        </h4>
        {item.description && (
          <p className="mt-1 text-xs subtle line-clamp-2">
            {String(item.description || "").trim()}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="inline-flex items-center gap-1 text-[11px]">
            {rating != null ? (
              <>
                <Star className="size-3 text-[hsl(var(--accent))]" />
                <span className="tabular-nums">{rating.toFixed(1)}</span>
                {reviews != null && <span className="subtle">({reviews})</span>}
              </>
            ) : (
              <span className="subtle">New</span>
            )}
          </div>
          <Link
            href={`/listings/${item.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-medium px-3 py-1 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground))/0.06] transition-colors"
          >
            View <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Rank accent */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 size-20 rounded-full blur-2xl opacity-40 ${rank === 0
          ? "bg-[hsl(var(--primary))]"
          : rank === 1
            ? "bg-[hsl(var(--accent))]"
            : "bg-[hsl(var(--secondary,var(--accent)))]"
          }`}
      />
    </motion.article>
  );
}

function ProgressDots({
  count,
  index,
  onDot,
}: {
  count: number;
  index: number;
  onDot: (i: number) => void;
}) {
  return (
    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`h-1.5 rounded-full transition-all go-to-slide ${i === index
            ? "w-6 bg-[hsl(var(--accent))]"
            : "w-3 bg-[hsl(var(--foreground))/0.3] hover:bg-[hsl(var(--foreground))/0.5]"
            }`}
        />
      ))}
    </div>
  );
}

export default RelatedListingsSlider;
