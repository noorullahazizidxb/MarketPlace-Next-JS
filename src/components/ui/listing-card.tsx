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
  Tag,
  TagIcon,
  Banknote,
  CreditCard,
} from "lucide-react";
import { asset } from "@/lib/assets";
import { ImageSlider } from "@/components/ui/image-slider";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // legacy; will remove after dialog refactor if unused
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";

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

export function ListingCard({ listing }: { listing: Listing }) {
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  const [repOpen, setRepOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const img = listing.images?.[0]?.url
    ? asset(listing.images[0].url)
    : "/favicon.svg";
  const showSeller = listing.contactVisibility === "SHOW_SELLER";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      className="group hover-ambient relative rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        {listing.images && listing.images.length > 0 ? (
          <ImageSlider
            images={listing.images}
            className="transition-transform duration-500 group-hover:scale-103"
            aspect="1/1"
          />
        ) : (
          <div className="relative aspect-square w-full animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.12),transparent_70%)] mix-blend-soft-light" />
        {/* Top-right badges: rating and reviews (always shown with fallbacks) */}
        <div className="absolute top-2 right-2 z-[0] flex flex-col items-end gap-2 pointer-events-none">
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
        <div className="absolute top-2 left-2 z-[0]">
          <span className="text-xs px-3 py-1 rounded-full shadow-glass text-black font-semibold glass">
            <CreditCard className="size-4 inline-flex mr-2" />
            {listing.price} {listing.currency}
          </span>
        </div>

        <div className="absolute bottom-2 left-2 z-[0] flex items-center gap-2">
          {showSeller ? (
            <span
              onClick={() => setContactOpen(true)}
              className="text-2xs px-2 py-1 rounded-full bg-emerald-600 text-white border border-[hsl(var(--accent))]/50 flex items-center gap-1 shadow-sm"
            >
              <Phone className="size-3" /> {t("seller")}
            </span>
          ) : (
            <span className="text-2xs px-2 py-1 rounded-full bg-amber-400 text-black border border-[hsl(var(--accent))]/30 flex items-center gap-1 shadow-sm">
              <ShieldCheck className="size-3" /> {t("promoted")}
            </span>
          )}
        </div>
        <div className="absolute bottom-2 right-2 z-[0] flex items-center gap-2">
          {listing.category?.name && (
            <span className="text-2xs px-2 py-1 rounded-full bg-pink-500 text-white border border-[hsl(var(--accent))]/30 flex items-center gap-1 shadow-sm">
              <TagIcon className="size-3" /> {listing.category?.name}
            </span>
          )}
        </div>
      </div>

      <div className="p-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold tracking-tight line-clamp-1">
            {listing.title}
          </h3>
        </div>
        <div className="absolute right-1 b-20"></div>
        {listing.description && (
          <p
            className="mt-1 text-[11px] leading-snug text-[hsl(var(--muted-foreground))] truncate"
            title={String(listing.description || "").trim()}
          >
            {String(listing.description || "").trim()}
          </p>
        )}

        {listing.location && (
          <p className="subtle mt-1 text-xs">{listing.location}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {showSeller ? (
            <>
              <button
                onClick={() => setContactOpen(true)}
                className="text-sm inline-flex items-center gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
              >
                {t("contactSeller")}
              </button>
              <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogContent className="max-w-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      {t("contactSellerTitle")}
                    </h3>
                    <DialogClose asChild>
                      <button
                        aria-label={t("close")}
                        className="size-8 grid place-items-center rounded-xl hover:bg-foreground/5"
                      >
                        ×
                      </button>
                    </DialogClose>
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
                          listing.user.contacts.whatsapp
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
              <button
                onClick={() => setRepOpen(true)}
                className="text-sm inline-flex items-center gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
              >
                {t("chooseRepresentative")}
              </button>
              <Dialog open={repOpen} onOpenChange={setRepOpen}>
                <DialogContent className="max-w-md p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      {t("representatives")}
                    </h3>
                    <DialogClose asChild>
                      <button
                        aria-label={t("close")}
                        className="size-8 grid place-items-center rounded-xl hover:bg-foreground/5"
                      >
                        ×
                      </button>
                    </DialogClose>
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
                                  ""
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
          <Link
            href={`/listings/${listing.id}`}
            className="text-sm inline-flex items-center gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
          >
            {t("details")} <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
