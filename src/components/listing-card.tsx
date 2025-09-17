"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Star,
  MessageSquare,
} from "lucide-react";
import { asset } from "@/lib/assets";
import { ImageSlider } from "@/components/image-slider";

type ListingImage = { url: string; alt?: string | null };
type Representative = {
  representative: {
    id: number;
    region: string;
    whatsappNumber?: string;
    active: boolean;
  };
};

export type Listing = {
  id: string;
  title: string;
  description?: string | null;
  price?: string | number | null;
  currency?: string | null;
  listingType?: string | null;
  contactVisibility?: "SHOW_SELLER" | "HIDE_SELLER" | string | null;
  images?: ListingImage[];
  representatives?: Representative[];
  user?: { id: string; name?: string | null };
  location?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
};

export function ListingCard({ listing }: { listing: Listing }) {
  const img = listing.images?.[0]?.url
    ? asset(listing.images[0].url)
    : "/favicon.svg";
  const showSeller = listing.contactVisibility === "SHOW_SELLER";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      className="group relative rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <ImageSlider
          images={listing.images}
          className="transition-transform duration-500 group-hover:scale-105"
          aspect="16/10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent pointer-events-none" />
        {/* Top-right badges: rating and reviews (always shown with fallbacks) */}
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2">
          {/* Rating badge - default to 0.0 */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[11px] text-white shadow-sm backdrop-blur-sm dark:bg-black/60">
            <div className="flex items-center -ml-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const rating =
                  typeof listing.averageRating === "number"
                    ? listing.averageRating
                    : 0;
                const filled = i + 1 <= Math.floor(rating);
                const half =
                  !filled && i < Math.ceil(rating) && rating % 1 >= 0.5;
                return (
                  <Star
                    key={i}
                    className={
                      "mr-[2px] size-3 " +
                      (filled
                        ? "fill-yellow-400 text-yellow-400"
                        : half
                        ? "fill-gradient text-yellow-300"
                        : "text-white/30")
                    }
                  />
                );
              })}
            </div>
            <span className="ml-1 font-medium tabular-nums">
              {(typeof listing.averageRating === "number"
                ? listing.averageRating
                : 0
              ).toFixed(1)}
            </span>
          </div>

          {/* Reviews badge - default to 0 */}
          <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[11px] text-white shadow-sm backdrop-blur-sm dark:bg-black/60">
            <MessageSquare className="size-3.5 text-white/80" />
            <span className="font-medium tabular-nums">
              {typeof listing.reviewCount === "number"
                ? listing.reviewCount
                : 0}
            </span>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <span className="text-2xs px-2 py-1 rounded-full bg-white/70 text-black border border-[hsl(var(--border))] dark:bg-black/60 dark:text-white/90">
            {listing.listingType || "LISTING"}
          </span>
          {showSeller ? (
            <span className="text-2xs px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
              <Phone className="size-3" /> Seller
            </span>
          ) : (
            <span className="text-2xs px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <ShieldCheck className="size-3" /> Protected
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold tracking-tight line-clamp-1">
            {listing.title}
          </h3>
          {listing.price && (
            <div className="px-2 py-1 rounded-xl bg-[hsl(var(--muted))] text-sm border border-[hsl(var(--border))]">
              {listing.price} {listing.currency}
            </div>
          )}
        </div>
        {listing.location && (
          <p className="subtle mt-1 text-xs">{listing.location}</p>
        )}
        {listing.description && (
          <p className="text-sm mt-2 line-clamp-2 text-foreground/80">
            {listing.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          {showSeller ? (
            <a
              href={`tel:${listing.user?.name ?? ""}`}
              className="text-sm inline-flex items-center gap-1 underline underline-offset-4 opacity-90 hover:opacity-100"
            >
              Contact seller
            </a>
          ) : (
            <Link
              href={`/representative/${listing.id}`}
              className="text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Choose representative <ArrowRight className="size-4" />
            </Link>
          )}
          <Link
            href={`/listings/${listing.id}`}
            className="text-sm inline-flex items-center gap-1 subtle hover:text-foreground"
          >
            Details <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
