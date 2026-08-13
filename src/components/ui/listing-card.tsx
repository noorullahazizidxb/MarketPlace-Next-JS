"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ImageSlider } from "@/components/ui/image-slider";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { useLanguage } from "@/components/providers/language-provider";
import { listingFallbackImage, type AssetImage } from "@/lib/assets";

type Representative = {
  representative?: {
    id?: number;
    region?: string | null;
    whatsappNumber?: string | null;
    whatsapp?: string | null;
    active?: boolean;
  };
  id?: number;
  region?: string | null;
  whatsappNumber?: string | null;
  whatsapp?: string | null;
  active?: boolean;
};

export type Listing = {
  id: string | number;
  title: string;
  description?: string | null;
  price?: string | number | null;
  currency?: string | null;
  listingType?: string | null;
  contactVisibility?: "SHOW_SELLER" | "HIDE_SELLER" | string | null;
  images?: Array<AssetImage | string | null> | null;
  imageUrl?: string | null;
  representatives?: Representative[];
  user?: {
    id: string;
    name?: string | null;
    fullName?: string | null;
    contacts?: { phone?: string; whatsapp?: string } | null;
  };
  location?: string | null;
  categoryId?: string | number | null;
  category?: {
    id?: string | number | null;
    name: string;
  } | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  promoted?: boolean | null;
};

function normalizeImages(listing: Listing) {
  const images = Array.isArray(listing.images) ? listing.images : [];
  if (images.length > 0) return images;
  return listing.imageUrl
    ? [{ url: listing.imageUrl, alt: listing.title }]
    : [];
}

function ContactDialog({
  listing,
  open,
  onOpenChange,
}: {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();
  const phone = listing.user?.contacts?.phone;
  const whatsapp = listing.user?.contacts?.whatsapp;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(88dvh,38rem)] max-w-md flex-col overflow-hidden p-0">
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-success/12 text-success">
            <Phone className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="app-text-heading-sm font-semibold">
              {t("contactSellerTitle")}
            </DialogTitle>
            <p className="mt-1 app-text-caption text-muted-foreground">
              {t("contactSellerSubtitle")}
            </p>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label={t("close")}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span aria-hidden>×</span>
            </button>
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-border bg-muted/25 px-4 py-3 font-medium transition-colors hover:border-primary/35 hover:bg-primary/5"
            >
              <span className="inline-flex items-center gap-2">
                <Phone className="size-4 text-primary" /> {t("call")}
              </span>
              <span className="app-text-caption text-muted-foreground">{phone}</span>
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${String(whatsapp).replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-success/25 bg-success/8 px-4 py-3 font-medium text-success transition-colors hover:bg-success/12"
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="size-4" /> {t("whatsApp")}
              </span>
              <span className="app-text-caption">{whatsapp}</span>
            </a>
          )}
          {!phone && !whatsapp && (
            <div className="rounded-2xl border border-dashed border-border p-5 text-center app-text-body text-muted-foreground">
              {t("noContact")}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-card/95 p-4 backdrop-blur">
          <DialogClose asChild>
            <button className="min-h-11 w-full rounded-xl bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              {t("close")}
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RepresentativesDialog({
  listing,
  open,
  onOpenChange,
}: {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();
  const representatives = Array.isArray(listing.representatives)
    ? listing.representatives
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(88dvh,40rem)] max-w-lg flex-col overflow-hidden p-0">
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="app-text-heading-sm font-semibold">
              {t("representatives")}
            </DialogTitle>
            <p className="mt-1 app-text-caption text-muted-foreground">
              {t("representativesSubtitle")}
            </p>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label={t("close")}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span aria-hidden>×</span>
            </button>
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-5">
          {representatives.length > 0 ? (
            representatives.map((row, index) => {
              const representative = row.representative ?? row;
              const phone =
                representative.whatsappNumber ?? representative.whatsapp ?? "";
              return (
                <div
                  key={representative.id ?? index}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/20 p-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {representative.region || t("unknown")}
                    </p>
                    <p className="mt-0.5 app-text-caption text-muted-foreground">
                      {phone || t("noContact")}
                    </p>
                  </div>
                  {phone && (
                    <a
                      href={`https://wa.me/${String(phone).replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-success px-3 app-text-label font-medium text-primary-foreground"
                    >
                      <MessageSquare className="size-4" /> {t("whatsApp")}
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-5 text-center app-text-body text-muted-foreground">
              {t("noRepresentatives")}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-card/95 p-4 backdrop-blur">
          <DialogClose asChild>
            <button className="min-h-11 w-full rounded-xl bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              {t("close")}
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ListingCard({
  listing,
  cleanImageOverlayOnEngage = false,
  priority = false,
}: {
  listing: Listing;
  cleanImageOverlayOnEngage?: boolean;
  priority?: boolean;
}) {
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  const [representativesOpen, setRepresentativesOpen] = useState(false);
  const [isImageEngaged, setIsImageEngaged] = useState(false);
  const showSeller = listing.contactVisibility === "SHOW_SELLER";
  const promoted = listing.promoted || !showSeller;
  const rating =
    typeof listing.averageRating === "number" ? listing.averageRating : null;
  const reviews =
    typeof listing.reviewCount === "number" ? listing.reviewCount : 0;
  const price = listing.price != null && String(listing.price).trim()
    ? `${listing.price}${listing.currency ? ` ${listing.currency}` : ""}`
    : t("contactSeller");
  const images = normalizeImages(listing);
  const fallbackSrc = listingFallbackImage(listing.category?.name);
  const hideOverlays = cleanImageOverlayOnEngage && isImageEngaged;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-border/70 bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-token-lg"
    >
      <div
        className="relative overflow-hidden bg-muted"
        onMouseEnter={() => setIsImageEngaged(true)}
        onMouseLeave={() => setIsImageEngaged(false)}
        onFocus={() => setIsImageEngaged(true)}
        onBlur={(event) => {
          const next = event.relatedTarget as Node | null;
          if (!next || !event.currentTarget.contains(next)) {
            setIsImageEngaged(false);
          }
        }}
      >
        <ImageSlider
          images={images}
          aspect="3/2"
          autoPlay
          forceEngaged={isImageEngaged}
          intervalMs={4200}
          firstSlideIsPriority={priority}
          fallbackSrc={fallbackSrc}
          className="transition-transform duration-700 group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-overlay-dark/55 via-transparent to-overlay-dark/10" />

        <div
          className={`absolute inset-x-3 top-3 flex items-start justify-between gap-2 transition-opacity duration-200 ${hideOverlays ? "opacity-0" : "opacity-100"}`}
        >
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {listing.listingType && (
              <span className="rounded-full border border-overlay-light/20 bg-overlay-dark/55 px-2.5 py-1 app-text-micro font-semibold uppercase tracking-[0.08em] text-overlay-light backdrop-blur-md">
                {listing.listingType}
              </span>
            )}
            {promoted && (
              <span className="inline-flex items-center gap-1 rounded-full border border-warning/25 bg-warning/90 px-2.5 py-1 app-text-micro font-semibold text-warning-foreground shadow-sm">
                <BadgeCheck className="size-3" /> {t("promoted")}
              </span>
            )}
          </div>
          {rating != null && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-overlay-light/20 bg-overlay-dark/55 px-2.5 py-1 app-text-caption font-semibold text-overlay-light backdrop-blur-md">
              <Star className="size-3 fill-warning text-warning" />
              {rating.toFixed(1)}
              {reviews > 0 && <span className="font-normal opacity-70">({reviews})</span>}
            </span>
          )}
        </div>

        <div
          className={`absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 transition-opacity duration-200 ${hideOverlays ? "opacity-0" : "opacity-100"}`}
        >
          {listing.category?.name ? (
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-overlay-light/20 bg-overlay-dark/55 px-2.5 py-1 app-text-caption text-overlay-light backdrop-blur-md">
              <Building2 className="size-3 shrink-0" />
              <span className="truncate">{listing.category.name}</span>
            </span>
          ) : <span />}
          <span className="shrink-0 rounded-xl bg-background/92 px-3 py-1.5 app-text-label font-bold text-foreground shadow-lg backdrop-blur-md">
            {price}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-[var(--space-card)]">
        <div className="min-w-0">
          <Link
            href={`/listings/${listing.id}`}
            className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <h3 className="line-clamp-2 app-text-heading-sm font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {listing.title}
            </h3>
          </Link>
          {listing.description && (
            <p className="mt-2 line-clamp-2 app-text-body leading-relaxed text-muted-foreground">
              {String(listing.description).trim()}
            </p>
          )}
        </div>

        <div className="mt-3 flex min-h-6 items-center gap-3 app-text-caption text-muted-foreground">
          {listing.location && (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{listing.location}</span>
            </span>
          )}
          {!listing.location && (
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" />
              {showSeller ? t("seller") : t("promoted")}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-4">
          <Tooltip
            content={showSeller ? t("contactSeller") : t("chooseRepresentative")}
            side="top"
          >
            <button
              type="button"
              onClick={() =>
                showSeller ? setContactOpen(true) : setRepresentativesOpen(true)
              }
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/8 px-3 app-text-label font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {showSeller ? (
                <Phone className="size-4" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              <span className="truncate">
                {showSeller ? t("contactSeller") : t("chooseRepresentative")}
              </span>
            </button>
          </Tooltip>
          <Tooltip content={t("details")} side="top">
            <Link
              href={`/listings/${listing.id}`}
              aria-label={`${t("details")}: ${listing.title}`}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </Tooltip>
        </div>
      </div>

      <ContactDialog
        listing={listing}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
      <RepresentativesDialog
        listing={listing}
        open={representativesOpen}
        onOpenChange={setRepresentativesOpen}
      />
    </motion.article>
  );
}
