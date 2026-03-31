"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Star,
  MessageSquare,
  TagIcon,
  CreditCard,
} from "lucide-react";
import { ImageSlider } from "@/components/ui/image-slider";
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { Tooltip } from "@/components/ui/tooltip";

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
  user?: {
    id: string;
    name?: string | null;
    contacts?: { phone?: string; whatsapp?: string };
  };
  location?: string | null;
  category?: {
    name: string;
  };
  averageRating?: number | null;
  reviewCount?: number | null;
};

export function ListingCard({
  listing,
  cleanImageOverlayOnEngage = false,
}: {
  listing: Listing;
  cleanImageOverlayOnEngage?: boolean;
}) {
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  const [repOpen, setRepOpen] = useState(false);
  const [isImageEngaged, setIsImageEngaged] = useState(false);
  const showSeller = listing.contactVisibility === "SHOW_SELLER";
  const hideImageOverlays = cleanImageOverlayOnEngage && isImageEngaged;
  const showHoverCta = isImageEngaged;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      style={{ willChange: "transform" }}
      className="group hover-ambient relative rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
    >
      <div
        className="relative overflow-hidden rounded-t-2xl"
        onMouseEnter={() => setIsImageEngaged(true)}
        onMouseLeave={() => setIsImageEngaged(false)}
        onFocus={() => setIsImageEngaged(true)}
        onBlur={(event) => {
          const next = event.relatedTarget as Node | null;
          if (!next || !event.currentTarget.contains(next)) {
            setIsImageEngaged(false);
          }
        }}
        onTouchStart={() => setIsImageEngaged(true)}
        onTouchEnd={() => setIsImageEngaged(false)}
        onTouchCancel={() => setIsImageEngaged(false)}
      >
        {listing.images && listing.images.length > 0 ? (
          <ImageSlider
            images={listing.images}
            autoPlay
            forceEngaged={isImageEngaged}
            className="transition-transform duration-500 group-hover:scale-103"
            aspect="1/1"
          />
        ) : (
          <div className="relative aspect-square w-full animate-pulse bg-gradient-to-br from-[hsl(var(--card))/0.08] via-[hsl(var(--card))/0.04] to-transparent" />
        )}
        {/* ── Static overlays — CSS transitions, no framer runtime cost ─────── */}
        {/* Gradient + radial blend — always present, opacity via CSS */}
        <div
          className={
            "absolute inset-0 pointer-events-none transition-opacity duration-200 " +
            (hideImageOverlays ? "opacity-0" : "opacity-100")
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))/0.8] via-[hsl(var(--background))/0.1] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.12),transparent_70%)] mix-blend-soft-light" />
        </div>

        {/* Hover CTA — single AnimatePresence for the one element that truly needs a spring */}
        <AnimatePresence initial={false}>
          {showHoverCta && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-end justify-center p-4 pointer-events-none z-10"
            >
              <div className="pointer-events-auto w-full flex justify-between items-center">
                <Link
                  className="inline-flex items-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-[hsl(var(--primary-foreground))] no-underline shadow-md transition-all duration-200 hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] hover:no-underline hover:shadow-lg"
                  href={`/listings/${listing.id}`}
                >
                  {t("details")}
                  <ArrowRight className="size-4" />
                </Link>
                <span className="text-xs px-3 py-1 rounded-full bg-[hsl(var(--background))]/70 border border-[hsl(var(--border))]">
                  {listing.price} {listing.currency}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges — CSS opacity transitions, no per-badge AnimatePresence */}
        <div
          className={
            "absolute top-2 right-2 z-[0] flex flex-col items-end gap-2 pointer-events-none transition-opacity duration-200 " +
            (hideImageOverlays ? "opacity-0" : "opacity-100")
          }
        >
          {/* Rating badge - default to 0.0 */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent))]/30 bg-[hsl(var(--background))]/80 backdrop-blur px-2 py-1 text-[11px] text-[hsl(var(--foreground))] shadow-md">
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
                      "mr-[2px] size-3 transition-colors " +
                      (filled
                        ? "text-amber-400 fill-amber-400"
                        : half
                          ? "text-amber-300"
                          : "text-[hsl(var(--muted-foreground))] dark:text-white/30")
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
          <div className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--accent))]/30 bg-[hsl(var(--background))]/80 backdrop-blur px-2 py-1 text-[11px] text-[hsl(var(--foreground))] shadow-md">
            <MessageSquare className="size-3.5 text-amber-300 dark:text-amber-400" />
            <span className="font-medium tabular-nums">
              {typeof listing.reviewCount === "number"
                ? listing.reviewCount
                : 0}
            </span>
          </div>
        </div>

        {/* Price — top-left */}
        <div
          className={
            "absolute top-2 left-2 z-[0] transition-opacity duration-200 " +
            (hideImageOverlays ? "opacity-0" : "opacity-100")
          }
        >
          <span className="text-xs px-3 py-1 rounded-full shadow-glass text-black font-semibold glass flex items-center gap-2">
            <CreditCard className="size-4 inline-flex" />
            <span className="font-medium tabular-nums">
              {listing.price} {listing.currency}
            </span>
          </span>
        </div>

        {/* Seller / Promoted — bottom-left */}
        <div
          className={
            "absolute bottom-2 left-2 z-[0] flex items-center gap-2 transition-opacity duration-200 " +
            (hideImageOverlays ? "opacity-0" : "opacity-100")
          }
        >
          {showSeller ? (
            <Tooltip content={t("contactSeller")} side="top">
              <span
                onClick={() => setContactOpen(true)}
                className="text-2xs px-2 py-1 rounded-full bg-emerald-600 text-white border border-[hsl(var(--accent))]/50 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Phone className="size-3" /> {t("seller")}
              </span>
            </Tooltip>
          ) : (
            <span className="text-2xs px-2 py-1 rounded-full bg-amber-400 text-black border border-[hsl(var(--accent))]/30 flex items-center gap-1 shadow-sm">
              <ShieldCheck className="size-3" /> {t("promoted")}
            </span>
          )}
        </div>

        {/* Category — bottom-right */}
        {listing.category?.name && (
          <div
            className={
              "absolute bottom-2 right-2 z-[0] flex items-center gap-2 transition-opacity duration-200 " +
              (hideImageOverlays ? "opacity-0" : "opacity-100")
            }
          >
            <span className="text-2xs px-2 py-1 rounded-full bg-pink-500 text-white border border-[hsl(var(--accent))]/30 flex items-center gap-1 shadow-sm">
              <TagIcon className="size-3" /> {listing.category?.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold tracking-tight line-clamp-1 text-sm">
          {listing.title}
        </h3>
        {listing.description && (
          <p
            className="mt-1 text-[11px] leading-snug text-[hsl(var(--muted-foreground))] truncate"
            title={String(listing.description || "").trim()}
          >
            {String(listing.description || "").trim()}
          </p>
        )}

        {listing.location && (
          <p className="subtle mt-1 text-xs flex items-center gap-1">
            <span className="inline-block size-1.5 rounded-full bg-[hsl(var(--accent))]" />
            {listing.location}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          {showSeller ? (
            <>
              <Tooltip content={t("contactSeller")} side="top">
                <button
                  onClick={() => setContactOpen(true)}
                  className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                             bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                             hover:bg-emerald-500/20 hover:-translate-y-0.5 transition-all border border-emerald-500/20"
                >
                  <Phone className="size-3" />
                  {t("contactSeller")}
                </button>
              </Tooltip>
              <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogContent className="max-w-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      {t("contactSellerTitle")}
                    </h3>
                    <Tooltip content={t("close")} side="top">
                      <DialogClose asChild>
                        <button
                          aria-label={t("close")}
                          className="size-8 grid place-items-center rounded-xl hover:bg-foreground/5"
                        >
                          ×
                        </button>
                      </DialogClose>
                    </Tooltip>
                  </div>
                  <p className="subtle mb-4 text-sm">
                    {t("contactSellerSubtitle")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {listing.user?.contacts?.phone && (
                      <a
                        href={`tel:${listing.user.contacts.phone}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:ring-2 ring-[hsl(var(--accent))]/40 transition-all"
                        onClick={() => setContactOpen(false)}
                      >
                        <Phone className="size-4" /> {t("call")}{" "}
                        {listing.user.contacts.phone}
                      </a>
                    )}
                    {listing.user?.contacts?.whatsapp && (
                      <a
                        href={`https://wa.me/${String(
                          listing.user.contacts.whatsapp,
                        ).replace(/[+\s]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-400 border border-border text-[hsl(var(--accent-foreground, var(--foreground)))] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        onClick={() => setContactOpen(false)}
                      >
                        <Phone className="size-4" /> {t("whatsApp")}{" "}
                        {listing.user.contacts.whatsapp}
                      </a>
                    )}
                    <DialogClose asChild>
                      <button className="mt-2 text-sm inline-flex items-center justify-center bg-[hsl(var(--accent))] gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all">
                        {t("close")}
                      </button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <Tooltip content={t("chooseRepresentative")} side="top">
                <button
                  onClick={() => setRepOpen(true)}
                  className="text-sm inline-flex items-center gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
                >
                  {t("chooseRepresentative")}
                </button>
              </Tooltip>
              <Dialog open={repOpen} onOpenChange={setRepOpen}>
                <DialogContent className="max-w-md p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      {t("representatives")}
                    </h3>
                    <Tooltip content={t("close")} side="top">
                      <DialogClose asChild>
                        <button
                          aria-label={t("close")}
                          className="size-8 grid place-items-center rounded-xl hover:bg-foreground/5"
                        >
                          ×
                        </button>
                      </DialogClose>
                    </Tooltip>
                  </div>
                  <p className="subtle mb-4 text-sm">
                    {t("representativesSubtitle")}
                  </p>
                  <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {Array.isArray(listing.representatives) &&
                      listing.representatives.length > 0 ? (
                      listing.representatives.map((r, idx) => {
                        const rep = (r as any).representative ?? r;
                        const phone =
                          rep?.whatsappNumber || rep?.whatsapp || "";
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card-bg, var(--card)))]"
                          >
                            <div>
                              <div className="font-medium">
                                {rep?.region ?? t("unknown")}
                              </div>
                              {phone && (
                                <div className="text-xs subtle">{phone}</div>
                              )}
                            </div>
                            {phone ? (
                              <a
                                href={`https://wa.me/${String(phone).replace(
                                  /[+\s]/g,
                                  "",
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500 text-white hover:shadow-lg"
                              >
                                {t("whatsApp")}
                              </a>
                            ) : (
                              <button
                                className="px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                                disabled
                              >
                                {t("noContact")}
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm">{t("noRepresentatives")}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <DialogClose asChild>
                      <button className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--accent))] text-white">
                        {t("close")}
                      </button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Tooltip content={t("details")} side="top">
            <Link
              href={`/listings/${listing.id}`}
              className="text-sm inline-flex items-center gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
            >
              {t("details")} <ArrowRight className="size-4" />
            </Link>
          </Tooltip>
        </div>
      </div>
    </motion.article>
  );
}
