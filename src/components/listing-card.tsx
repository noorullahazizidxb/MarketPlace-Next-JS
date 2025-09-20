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
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  averageRating?: number | null;
  reviewCount?: number | null;
};

export function ListingCard({ listing }: { listing: Listing }) {
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
        <div className="absolute top-2 right-2 z-[1] flex flex-col items-end gap-2 pointer-events-none">
          {/* Rating badge - default to 0.0 */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card-bg, var(--card)))] px-2 py-1 text-[11px] text-[hsl(var(--card-fg, var(--foreground)))] shadow-sm dark:bg-[hsl(var(--card-bg, var(--card)))]">
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
                        ? "text-[hsl(var(--accent))] fill-[hsl(var(--accent))]"
                        : half
                        ? "text-[hsl(var(--accent))] opacity-70"
                        : "text-[hsl(var(--muted-foreground))]")
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
          <div className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card-bg, var(--card)))] px-2 py-1 text-[11px] text-[hsl(var(--card-fg, var(--foreground)))] shadow-sm dark:bg-[hsl(var(--card-bg, var(--card)))]">
            <MessageSquare className="size-3.5 text-[hsl(var(--muted-foreground))]" />
            <span className="font-medium tabular-nums">
              {typeof listing.reviewCount === "number"
                ? listing.reviewCount
                : 0}
            </span>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 z-[1] flex items-center gap-2">
          <span className="text-2xs px-2 py-1 rounded-full bg-[hsl(var(--card-bg, var(--card)))] text-[hsl(var(--card-fg, var(--foreground)))] border border-[hsl(var(--border))] shadow-sm">
            {listing.listingType || "LISTING"}
          </span>
          {showSeller ? (
            <span
              onClick={() => setContactOpen(true)}
              className="text-2xs px-2 py-1 rounded-full bg-emerald-600 text-white border border-[hsl(var(--accent))]/50 flex items-center gap-1 shadow-sm"
            >
              <Phone className="size-3" /> Seller
            </span>
          ) : (
            <span className="text-2xs px-2 py-1 rounded-full bg-amber-400 text-black border border-[hsl(var(--accent))]/30 flex items-center gap-1 shadow-sm">
              <ShieldCheck className="size-3" /> Promoted
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
            <>
              <button
                onClick={() => setContactOpen(true)}
                className="text-sm inline-flex items-center gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
              >
                Contact seller
              </button>
              {contactOpen &&
                mounted &&
                createPortal(
                  <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
                  >
                    <div
                      className="absolute inset-0 bg-[hsl(var(--background))]/70 backdrop-blur-[2px]"
                      onClick={() => setContactOpen(false)}
                    />
                    <div className="relative z-[2001] w-full max-w-sm rounded-2xl bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] p-5 shadow-2xl">
                      <h3 className="text-lg font-semibold mb-2">
                        Contact Seller
                      </h3>
                      <p className="subtle mb-4">
                        Choose how you'd like to contact the seller
                      </p>
                      <div className="flex flex-col gap-2">
                        {listing.user?.contacts?.phone && (
                          <a
                            href={`tel:${listing.user.contacts.phone}`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:ring-2 ring-[hsl(var(--accent))]/40 transition-all"
                            onClick={() => setContactOpen(false)}
                          >
                            <Phone className="size-4" /> Call{" "}
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
                            <Phone className="size-4" /> WhatsApp{" "}
                            {listing.user.contacts.whatsapp}
                          </a>
                        )}
                        <button
                          onClick={() => setContactOpen(false)}
                          className="mt-2 text-sm inline-flex items-center justify-center bg-[hsl(var(--accent))] gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
            </>
          ) : (
            <>
              <button
                onClick={() => setRepOpen(true)}
                className="text-sm inline-flex items-center gap-1 p-2 rounded-2xl subtle hover:ring-2 ring-[hsl(var(--accent))]/30 hover:-translate-y-0.5 transition-all"
              >
                Choose representative
              </button>
              {repOpen &&
                mounted &&
                createPortal(
                  <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
                  >
                    <div
                      className="absolute inset-0 bg-[hsl(var(--background))]/70 backdrop-blur-[2px]"
                      onClick={() => setRepOpen(false)}
                    />
                    <div className="relative z-[2001] w-full max-w-md rounded-2xl bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] p-5 shadow-2xl">
                      <h3 className="text-lg font-semibold mb-2">
                        Representatives
                      </h3>
                      <p className="subtle mb-4">
                        Choose a local representative to contact via WhatsApp
                      </p>
                      <div className="flex flex-col gap-3">
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
                                    {rep?.region ?? "Unknown"}
                                  </div>
                                  {phone && (
                                    <div className="text-xs subtle">
                                      {phone}
                                    </div>
                                  )}
                                </div>
                                {phone ? (
                                  <a
                                    href={`https://wa.me/${String(
                                      phone
                                    ).replace(/[+\s]/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500 text-white hover:shadow-lg"
                                  >
                                    WhatsApp
                                  </a>
                                ) : (
                                  <button
                                    className="px-3 py-1 rounded-lg bg-gray-300 text-gray-700"
                                    disabled
                                  >
                                    No contact
                                  </button>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm">
                            No representatives available for this listing.
                          </p>
                        )}
                        <div className="mt-3">
                          <button
                            onClick={() => setRepOpen(false)}
                            className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--accent))] text-white"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
            </>
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
