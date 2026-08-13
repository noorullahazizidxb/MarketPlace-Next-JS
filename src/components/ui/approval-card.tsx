"use client";
import { useState } from "react";
import Image from "next/image";
import { ImageSlider } from "@/components/ui/image-slider";
import { motion } from "framer-motion";
import { useApiMutation } from "@/lib/api-hooks";
import { twMerge } from "tailwind-merge";
import { asset, DEFAULT_LISTING_IMAGE } from "@/lib/assets";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";

type ContactVisibility = "HIDE_SELLER" | "SHOW_SELLER" | "MASKED";

export type ApprovalCardProps = {
  listing: any;
  onApproved?: (id: string, visibility: ContactVisibility) => void;
  onRejected?: (id: string) => void;
};

export function ApprovalCard({
  listing,
  onApproved,
  onRejected,
}: ApprovalCardProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [contactVisibility, setContactVisibility] = useState<ContactVisibility>(
    listing?.contactVisibility || "HIDE_SELLER"
  );

  const approve = useApiMutation("post", `/listings/${listing?.id}/approve`);
  const reject = useApiMutation("post", `/listings/${listing?.id}/reject`);

  const cover =
    asset(listing?.images?.[0]?.url) || DEFAULT_LISTING_IMAGE;
  const gallery: Array<{
    id?: number | string;
    url?: string | null;
    alt?: string | null;
  }> = Array.isArray(listing?.images) ? listing.images : [];
  const author = listing?.user || {};
  const priceTag = listing?.price
    ? `${listing?.price} ${listing?.currency || "AFN"}`
    : listing?.listingType || "Listing";
  const status = listing?.status || "PENDING";
  const expiresAt = listing?.expiresAt ? new Date(listing.expiresAt) : null;
  const createdAt = listing?.createdAt ? new Date(listing.createdAt) : null;
  const reps: Array<any> = Array.isArray(listing?.representatives)
    ? listing.representatives
    : [];
  const reviews = {
    average: listing?.averageRating ?? 0,
    count: listing?.reviewCount ?? 0,
  };

  return (
    <div
      className={twMerge(
        "group rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-token-lg",
        "transition-transform duration-300 hover:-translate-y-1 hover:shadow-token-lg"
      )}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <ImageSlider
          images={listing?.images}
          aspect="16/9"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-overlay-dark/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
          <Link
            href={author?.id ? `/profile/${author.id}` : "#"}
            onClick={(e) => {
              if (!author?.id) e.preventDefault();
            }}
            className="rounded-full border border-[var(--border)] overflow-hidden hover:opacity-90"
          >
            <Image
              src={asset(author?.avatarUrl || author?.photo) || "/favicon.svg"}
              alt={author?.fullName || author?.name || author?.email || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <div className="min-w-0">
            <Link
              href={author?.id ? `/profile/${author.id}` : "#"}
              onClick={(e) => {
                if (!author?.id) e.preventDefault();
              }}
              className="text-primary-foreground/90 font-medium truncate hover:underline"
            >
              {author?.fullName || author?.name || author?.email}
            </Link>
            <div className="text-primary-foreground/70 app-text-caption truncate">
              {listing?.category?.name || listing?.categoryName || "Category"}
            </div>
          </div>
          <div className="ml-auto text-primary-foreground/80 app-text-body backdrop-blur-sm rounded-full px-3 py-1 border border-border">
            {priceTag}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="app-text-body font-semibold line-clamp-1">
              {listing?.title || t("untitled")}
            </h3>
            <p className="app-text-body subtle line-clamp-2">
              {listing?.description || t("noDescriptionProvided")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 app-text-micro">
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[color-mix(in oklab, var(--muted) 40%, transparent)]">
                {status}
              </span>
              {listing?.listingType && (
                <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[color-mix(in oklab, var(--muted) 40%, transparent)]">
                  {listing.listingType}
                </span>
              )}
              {listing?.location && (
                <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[color-mix(in oklab, var(--muted) 40%, transparent)]">
                  {listing.location}
                </span>
              )}
              {expiresAt && (
                <span
                  title="Expires"
                  className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[color-mix(in oklab, var(--muted) 40%, transparent)]"
                >
                  {t("expires")} {expiresAt.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="link app-text-body">
            {t("view")}
          </button>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="app-text-caption subtle">
            {createdAt ? `${t("created")} ${createdAt.toLocaleString()}` : null}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
            <div className="min-w-[120px] w-full sm:w-auto sm:min-w-[136px]">
              <select
                aria-label="Contact visibility"
                value={contactVisibility}
                onChange={(e) =>
                  setContactVisibility(e.target.value as ContactVisibility)
                }
                className="app-text-caption rounded-lg bg-[var(--muted)] border border-[var(--border)] px-2 py-1 w-full"
              >
                <option value="HIDE_SELLER">{t("hideSeller")}</option>
                <option value="SHOW_SELLER">{t("showSeller")}</option>
                <option value="MASKED">{t("masked")}</option>
              </select>
            </div>
            <Button
              size="sm"
              className="w-full sm:w-auto min-w-[110px]"
              onClick={async () => {
                await approve.mutateAsync({ contactVisibility });
                onApproved?.(listing.id, contactVisibility);
              }}
              variant="primary"
            >
              {t("approve")}
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto min-w-[110px]"
              onClick={async () => {
                await reject.mutateAsync({});
                onRejected?.(listing.id);
              }}
              variant="accent"
            >
              {t("reject")}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[85vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 flex items-center justify-end p-3 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--card)]/80 rounded-t-2xl">
            <DialogClose asChild>
              <button
                aria-label="Close modal"
                className="glass size-8 rounded-xl grid place-items-center"
              >
                <X className="app-icon-sm" />
              </button>
            </DialogClose>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-4">
              <Image
                src={
                  asset(author?.avatarUrl || author?.photo) || "/favicon.svg"
                }
                alt={
                  author?.fullName || author?.name || author?.email || "User"
                }
                width={64}
                height={64}
                className="rounded-xl border border-[var(--border)]"
              />
              <div className="min-w-0">
                <div className="app-text-heading-sm font-semibold line-clamp-1">
                  {author?.fullName || author?.name || author?.email}
                </div>
                <div className="app-text-body subtle line-clamp-2">
                  {author?.email}
                </div>
                {author?.address && (
                  <div className="app-text-body subtle line-clamp-2">
                    {[
                      author.address.street,
                      author.address.city,
                      author.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
              <Button className="ml-auto" onClick={() => setOpen(false)}>
                {t("closeDialog")}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
                <div className="app-text-body font-medium">{t("listingDetails")}</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 app-text-body">
                  <span className="subtle">{t("id")}</span>
                  <span className="truncate">{listing?.id}</span>
                  <span className="subtle">{t("type")}</span>
                  <span>{listing?.listingType || "-"}</span>
                  <span className="subtle">{t("status")}</span>
                  <span>{status}</span>
                  <span className="subtle">{t("price")}</span>
                  <span>{priceTag}</span>
                  <span className="subtle">{t("visibility")}</span>
                  <span>{contactVisibility}</span>
                  <span className="subtle">{t("location")}</span>
                  <span>{listing?.location || "-"}</span>
                  <span className="subtle">{t("category")}</span>
                  <span>{listing?.category?.name || "-"}</span>
                  <span className="subtle">{t("created")}</span>
                  <span>{createdAt ? createdAt.toLocaleString() : "-"}</span>
                  <span className="subtle">{t("expires")}</span>
                  <span>{expiresAt ? expiresAt.toLocaleString() : "-"}</span>
                  <span className="subtle">{t("approvedAt")}</span>
                  <span>
                    {listing?.approvedAt
                      ? new Date(listing.approvedAt).toLocaleString()
                      : "-"}
                  </span>
                  <span className="subtle">{t("approvedBy")}</span>
                  <span>{listing?.approvedById || "-"}</span>
                </div>
                <div className="app-text-body subtle whitespace-pre-wrap mt-2">
                  {listing?.description || t("noDescription")}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
                <div className="app-text-body font-medium">Seller & Contacts</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 app-text-body">
                  <span className="subtle">Name</span>
                  <span className="truncate">
                    {author?.fullName || author?.name || "-"}
                  </span>
                  <span className="subtle">Email</span>
                  <a
                    href={`mailto:${author?.email || ""}`}
                    className="link truncate"
                  >
                    {author?.email || "-"}
                  </a>
                  <span className="subtle">Phone</span>
                  <a
                    href={author?.phone ? `tel:${author.phone}` : "#"}
                    className="link truncate"
                  >
                    {author?.phone || "-"}
                  </a>
                  <span className="subtle">WhatsApp</span>
                  <a
                    href={
                      author?.contacts?.whatsapp
                        ? `https://wa.me/${author.contacts.whatsapp.replace(
                          /[^\d]/g,
                          ""
                        )}`
                        : "#"
                    }
                    className="link truncate"
                  >
                    {author?.contacts?.whatsapp || "-"}
                  </a>
                  <span className="subtle">Address</span>
                  <span className="truncate">
                    {author?.address
                      ? [
                        author.address.street,
                        author.address.city,
                        author.address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                      : "-"}
                  </span>
                </div>
                {reps.length > 0 && (
                  <div className="mt-3">
                    <div className="app-text-body font-medium mb-1">
                      Representatives
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reps.map((r, i) => (
                        <span
                          key={r.id || i}
                          className="px-2 py-1 rounded-full border border-[var(--border)] bg-[color-mix(in oklab, var(--muted) 40%, transparent)] app-text-micro"
                        >
                          {r?.representative?.region || "Region"} ·{" "}
                          {r?.representative?.whatsappNumber || "N/A"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 app-text-body subtle">
                  Reviews: {reviews.average?.toFixed?.(1) || 0} ⭐ (
                  {reviews.count})
                </div>
              </div>
            </div>

            {gallery.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] p-4">
                <div className="app-text-body font-medium mb-3">Gallery</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {gallery.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="relative aspect-square overflow-hidden rounded-xl"
                    >
                      <Image
                        src={asset(img.url) || DEFAULT_LISTING_IMAGE}
                        alt={img.alt || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[var(--border)] p-4">
              <div className="app-text-body font-medium mb-2">Metadata</div>
              <pre className="app-text-caption subtle overflow-auto max-h-48">
                {JSON.stringify(listing?.metadata ?? {}, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
