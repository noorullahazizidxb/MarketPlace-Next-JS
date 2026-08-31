"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Phone, ArrowUpRight } from "lucide-react";
import { asset, listingFallbackImage } from "@/lib/assets";
import { useLanguage } from "@/components/providers/language-provider";
import type { Listing } from "./listing-card";

/**
 * Listing Card V2 — Compact horizontal layout.
 * Thumbnail left, info right. Ideal for dense list views.
 */
export function ListingCardHorizontal({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  const imageUrl =
    asset(
      Array.isArray(listing.images) && listing.images[0]
        ? (listing.images[0] as { url?: string | null }).url
        : listing.imageUrl,
    ) || listingFallbackImage(listing.category?.name);

  const price =
    listing.price != null
      ? `${listing.currency ?? ""} ${Number(listing.price).toLocaleString()}`.trim()
      : null;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-soft"
    >
      {/* Thumbnail */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="80px"
        />
        {listing.promoted && (
          <span className="absolute left-1 top-1 rounded-md bg-primary px-1 py-0.5 text-[10px] font-semibold text-primary-foreground">
            {t("promoted")}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="app-text-body font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {listing.title}
        </p>

        {listing.location && (
          <span className="inline-flex items-center gap-1 app-text-caption text-muted-foreground">
            <MapPin className="app-icon-xs shrink-0" />
            {listing.location}
          </span>
        )}

        <div className="flex items-center justify-between gap-2">
          {price && (
            <span className="app-text-label font-bold text-price">{price}</span>
          )}
          {(listing.averageRating ?? 0) > 0 && (
            <span className="inline-flex items-center gap-0.5 app-text-caption text-warning-foreground">
              <Star className="app-icon-xs fill-current" />
              {listing.averageRating?.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <ArrowUpRight className="app-icon-sm shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

/**
 * Listing Card V3 — Editorial / magazine style.
 * Full-width hero image with gradient overlay and text below.
 */
export function ListingCardEditorial({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  const imageUrl =
    asset(
      Array.isArray(listing.images) && listing.images[0]
        ? (listing.images[0] as { url?: string | null }).url
        : listing.imageUrl,
    ) || listingFallbackImage(listing.category?.name);

  const price =
    listing.price != null
      ? `${listing.currency ?? ""} ${Number(listing.price).toLocaleString()}`.trim()
      : null;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glass"
    >
      {/* Hero image with gradient */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category badge */}
        {listing.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 app-text-caption font-medium backdrop-blur-sm">
            {listing.category.name}
          </span>
        )}

        {/* Price overlay */}
        {price && (
          <span className="absolute bottom-3 right-3 rounded-xl bg-background/90 px-3 py-1.5 app-text-label font-bold text-price backdrop-blur-sm">
            {price}
          </span>
        )}
      </div>

      {/* Text content */}
      <div className="p-4 space-y-2">
        <h3 className="app-text-heading-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          {listing.location && (
            <span className="inline-flex items-center gap-1 app-text-caption text-muted-foreground">
              <MapPin className="app-icon-xs shrink-0" />
              {listing.location}
            </span>
          )}
          {listing.user?.name && (
            <span className="app-text-caption text-muted-foreground truncate">
              {listing.user.name}
            </span>
          )}
        </div>

        {listing.description && (
          <p className="app-text-caption text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        )}
      </div>
    </Link>
  );
}

/**
 * Listing Card V4 — Minimal / list item.
 * Text-only with a color indicator. Max density for data-heavy views.
 */
export function ListingCardMinimal({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  const price =
    listing.price != null
      ? `${listing.currency ?? ""} ${Number(listing.price).toLocaleString()}`.trim()
      : null;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3 transition-all duration-150 hover:border-primary/40 hover:bg-card"
    >
      {/* Color indicator */}
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full bg-primary opacity-70 group-hover:opacity-100 transition-opacity"
      />

      {/* Title + location */}
      <div className="min-w-0 flex-1">
        <p className="app-text-body font-medium truncate group-hover:text-primary transition-colors">
          {listing.title}
        </p>
        {listing.location && (
          <p className="app-text-caption text-muted-foreground truncate">
            {listing.location}
          </p>
        )}
      </div>

      {/* Price */}
      {price && (
        <span className="shrink-0 app-text-label font-semibold text-price whitespace-nowrap">
          {price}
        </span>
      )}

      {/* Promoted badge */}
      {listing.promoted && (
        <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 app-text-caption font-medium text-primary">
          {t("promoted")}
        </span>
      )}

      <ArrowUpRight className="app-icon-xs shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
