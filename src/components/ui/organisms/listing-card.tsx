"use client";

import { useState, type ReactNode } from "react";
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
  X,
} from "lucide-react";
import { ImageSlider } from "@/components/ui/organisms/image-slider";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/molecules/dialog";
import { Tooltip } from "@/components/ui/molecules/tooltip";
import { useLanguage } from "@/components/providers/language-provider";
import { listingFallbackImage, type AssetImage } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { hoverLift, reveal, revealViewport } from "@/lib/motion";

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

function ListingDialogShell({
  open,
  onOpenChange,
  icon,
  title,
  subtitle,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("flex max-h-[min(88dvh,38rem)] max-w-md flex-col overflow-hidden p-0", className)}>
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          {icon}
          <div className="min-w-0 flex-1">
            <DialogTitle className="app-text-heading-sm font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-1 app-text-caption text-muted-foreground">
              {subtitle}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label={t("close")}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden />
            </button>
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-5">
          {children}
        </div>

        <div className="shrink-0 border-t border-border bg-card/95 p-4 backdrop-blur">
          <DialogClose asChild>
            <button
              type="button"
              className="min-h-11 w-full rounded-xl bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("close")}
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
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
    <ListingDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("contactSellerTitle")}
      subtitle={t("contactSellerSubtitle")}
      icon={
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-success/12 text-success">
          <Phone className="size-4" aria-hidden />
        </span>
      }
    >
      {Boolean(phone) && (
        <a
          href={`tel:${phone}`}
          className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-border bg-muted/25 px-4 py-3 font-medium transition-colors hover:border-primary/35 hover:bg-primary/5"
        >
          <span className="inline-flex items-center gap-2">
            <Phone className="size-4 text-primary" aria-hidden /> {t("call")}
          </span>
          <span className="app-text-caption text-muted-foreground" dir="ltr">{phone}</span>
        </a>
      )}
      {Boolean(whatsapp) && (
        <a
          href={`https://wa.me/${String(whatsapp).replace(/[^\d]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-success/25 bg-success/8 px-4 py-3 font-medium text-success transition-colors hover:bg-success/12"
        >
          <span className="inline-flex items-center gap-2">
            <MessageSquare className="size-4" aria-hidden /> {t("whatsApp")}
          </span>
          <span className="app-text-caption" dir="ltr">{whatsapp}</span>
        </a>
      )}
      {!phone && !whatsapp && (
        <div className="rounded-2xl border border-dashed border-border p-5 text-center app-text-body text-muted-foreground">
          {t("noContact")}
        </div>
      )}
    </ListingDialogShell>
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
    <ListingDialogShell
      open={open}
      onOpenChange={onOpenChange}
      className="max-h-[min(88dvh,40rem)] max-w-lg"
      title={t("representatives")}
      subtitle={t("representativesSubtitle")}
      icon={
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-4" aria-hidden />
        </span>
      }
    >
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
                <p className="mt-0.5 app-text-caption text-muted-foreground" dir="ltr">
                  {phone || t("noContact")}
                </p>
              </div>
              {Boolean(phone) && (
                <a
                  href={`https://wa.me/${String(phone).replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-success px-3 app-text-label font-medium text-primary-foreground"
                >
                  <MessageSquare className="size-4" aria-hidden /> {t("whatsApp")}
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
    </ListingDialogShell>
  );
}

export function ListingCard({
  listing,
  cleanImageOverlayOnEngage = false,
  priority = false,
  className,
}: {
  listing: Listing;
  cleanImageOverlayOnEngage?: boolean;
  priority?: boolean;
  className?: string;
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
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      whileHover={hoverLift}
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-primary/25 hover:shadow-lg focus-within:border-primary/35",
        className,
      )}
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
          sizes="(max-width: 640px) 92vw, (max-width: 768px) 46vw, (max-width: 1280px) 18vw, 14vw"
          className="transition-transform duration-700 group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-overlay-dark/55 via-transparent to-overlay-dark/10" />

        <div
          className={`absolute inset-x-1.5 top-1.5 flex items-start justify-between gap-1 transition-opacity duration-200 ${hideOverlays ? "opacity-0" : "opacity-100"}`}
        >
          <div className="flex min-w-0 flex-wrap gap-1">
            {listing.listingType && (
              <span className="rounded-full border border-overlay-light/20 bg-overlay-dark/55 px-1.5 py-0.5 app-text-micro font-semibold uppercase tracking-[0.06em] text-overlay-light backdrop-blur-md">
                {listing.listingType}
              </span>
            )}
            {promoted && (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-warning/25 bg-warning/90 px-1.5 py-0.5 app-text-micro font-semibold text-warning-foreground shadow-sm">
                <BadgeCheck className="size-2.5" /> {t("promoted")}
              </span>
            )}
          </div>
          {rating != null && (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-overlay-light/20 bg-overlay-dark/55 px-1.5 py-0.5 app-text-micro font-semibold text-overlay-light backdrop-blur-md">
              <Star className="size-2.5 fill-warning text-warning" />
              {rating.toFixed(1)}
              {reviews > 0 && <span className="font-normal opacity-70">({reviews})</span>}
            </span>
          )}
        </div>

        <div
          className={`absolute inset-x-1.5 bottom-1.5 flex items-end justify-between gap-1 transition-opacity duration-200 ${hideOverlays ? "opacity-0" : "opacity-100"}`}
        >
          {listing.category?.name ? (
            <span className="inline-flex min-w-0 items-center gap-1 rounded-full border border-overlay-light/20 bg-overlay-dark/55 px-1.5 py-0.5 app-text-micro text-overlay-light backdrop-blur-md">
              <Building2 className="size-2.5 shrink-0" />
              <span className="truncate">{listing.category.name}</span>
            </span>
          ) : <span />}
          <span className="shrink-0 rounded-md bg-background/92 px-1.5 py-0.5 app-text-micro font-bold text-foreground shadow-md backdrop-blur-md">
            {price}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-2.5">
        <div className="min-w-0">
          <Link
            href={`/listings/${listing.id}`}
            className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <h3 className="line-clamp-2 app-text-label font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {listing.title}
            </h3>
          </Link>
          {listing.description && (
            <p className="mt-0.5 line-clamp-1 app-text-caption leading-snug text-muted-foreground">
              {String(listing.description).trim()}
            </p>
          )}
        </div>

        <div className="mt-1.5 flex min-h-4 items-center gap-1.5 app-text-micro text-muted-foreground">
          {listing.location && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="size-3 shrink-0 text-primary" />
              <span className="truncate">{listing.location}</span>
            </span>
          )}
          {!listing.location && (
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3 text-success" />
              {showSeller ? t("seller") : t("promoted")}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-1 border-t border-border/60 pt-2">
          <Tooltip
            content={
              showSeller
                ? t("contactSeller")
                : t("chooseRepresentativeHint")
            }
            side="top"
            className="flex min-w-0 flex-1"
          >
            <button
              type="button"
              onClick={() =>
                showSeller ? setContactOpen(true) : setRepresentativesOpen(true)
              }
              className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-primary/8 px-2 app-text-caption font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showSeller ? (
                <Phone className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
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
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-[box-shadow,transform] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rtl:-scale-x-100"
            >
              <ArrowUpRight className="size-4" aria-hidden />
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
