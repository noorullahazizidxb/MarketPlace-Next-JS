"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams } from "next/navigation";
// Removed unused HomeAdPlaceholder import (was previously used for homepage ads)
import DetailAdSlot from "@/components/ads/detail-page-ad-slot";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import {
  Star,
  ArrowLeft,
  MapPin,
  BadgeCheck,
  Tag,
  Calendar,
  Share2,
  Heart,
  Flag,
  MessageCircle,
  User,
  Phone,
  Link2,
  Copy,
  Banknote,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "@/components/ui/image-slider";
import QRCode from "react-qr-code";
import { useAuth } from "@/lib/use-auth";
import { asset } from "@/lib/assets";
import { setCachedToken } from "@/lib/axiosClient";
import Image from "next/image";
import { useLanguage } from "@/components/providers/language-provider";
import { RelatedListingsSlider } from "@/components/listings/RelatedListingsSlider";

export default function ListingDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ListingDetailsContent />
    </Suspense>
  );
}

function ListingDetailsContent() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const {
    data: listing,
    isLoading,
    error,
    mutate,
  } = useApiGet<any>(["listing", id], `/listings/${id}`);
  const { user } = useAuth();

  const images: { url?: string | null; alt?: string | null }[] = Array.isArray(
    listing?.images
  )
    ? listing.images
    : [];

  const feedbacks = Array.isArray(listing?.feedbacks) ? listing?.feedbacks : [];
  const avgRating = Number(listing?.averageRating || 0);
  const reviewCount = Number(listing?.reviewCount || feedbacks.length || 0);

  const contactHidden = listing?.contactVisibility === "HIDE_SELLER";

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/listings"
          className="subtle inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-4" /> {t("back")}
        </Link>
        <h1 className="heading-xl flex items-center gap-3">
          {listing?.title ?? t("listing")}
          {avgRating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 px-2 py-1 text-sm">
              <Stars count={Math.round(avgRating)} />
              <span className="text-xs">
                {avgRating.toFixed(1)} ({reviewCount})
              </span>
            </span>
          )}
        </h1>
      </div>
      {isLoading && <p>{t("loading")}</p>}
      {error && (
        <p className="text-red-500">
          {String((error as any).message || error)}
        </p>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 backdrop-blur overflow-hidden">
              <ImageSlider images={images} aspect="1/1" />
            </div>
            <div className="card p-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {listing?.price && (
                  <div className="px-3 py-1 rounded-xl tabular-nums text-sm border border-[hsl(var(--border))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]">
                    <CreditCard className="size-5 mr-1 inline-flex" />{" "}
                    {listing.price} {listing.currency}
                  </div>
                )}
                {listing?.listingType && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--foreground))]/10 border border-[hsl(var(--border))]">
                    {listing.listingType}
                  </span>
                )}
                {listing?.status && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10">
                    <BadgeCheck className="size-3" /> {listing.status}
                  </span>
                )}
                {listing?.location && (
                  <span className="inline-flex items-center gap-1 text-sm subtle">
                    <MapPin className="size-4" /> {listing.location}
                  </span>
                )}
                {listing?.category?.name && (
                  <span className="inline-flex items-center gap-1 text-sm subtle">
                    <Tag className="size-4" /> {listing.category.name}
                  </span>
                )}
              </div>
              {listing?.description && (
                <p className="text-sm leading-relaxed text-[hsl(var(--foreground))]/80">
                  {listing.description}
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {listing?.createdAt && (
                  <InfoPill
                    icon={<Calendar className="size-3" />}
                    label={t("created")}
                    value={new Date(listing.createdAt).toLocaleDateString()}
                  />
                )}
                {listing?.updatedAt && (
                  <InfoPill
                    icon={<Calendar className="size-3" />}
                    label={t("updated") || "Updated"}
                    value={new Date(listing.updatedAt).toLocaleDateString()}
                  />
                )}
                {listing?.approvedAt && (
                  <InfoPill
                    icon={<Calendar className="size-3" />}
                    label={t("approvedAt") || "Approved"}
                    value={new Date(listing.approvedAt).toLocaleDateString()}
                  />
                )}
                {listing?.expiresAt && (
                  <InfoPill
                    icon={<Calendar className="size-3" />}
                    label={t("expires")}
                    value={new Date(listing.expiresAt).toLocaleDateString()}
                  />
                )}
              </div>
            </div>

            {/* Detail page advertisement slot 1 */}
            <DetailAdSlot placement="DETAIL_PAGE_1ST" />
            <FeedbackCreateForm
              listingId={String(id)}
              onSuccess={() => mutate()}
              onOptimisticAdd={(fb: any) =>
                mutate((prev: any) => {
                  if (!prev) return prev;
                  const list = Array.isArray(prev.feedbacks)
                    ? prev.feedbacks
                    : [];
                  const count = Number(prev.reviewCount || list.length || 0);
                  const avg = Number(prev.averageRating || 0);
                  const nextCount = count + 1;
                  const nextAvg =
                    (avg * count + Number(fb?.rating || 0)) / nextCount;
                  return {
                    ...prev,
                    feedbacks: [fb, ...list],
                    reviewCount: nextCount,
                    averageRating: nextAvg,
                  };
                }, false)
              }
              canPost={!!user}
            />
            <FeedbacksSection feedbacks={feedbacks} />
            {/* Detail page advertisement slot 2 */}
            <DetailAdSlot placement="DETAIL_PAGE_2ND" />
          </div>

          <div className="space-y-4">
            {contactHidden ? (
              <RepresentativesCard reps={listing?.representatives || []} />
            ) : (
              <SellerCard user={listing?.user} />
            )}

            <ActionsCard pageUrl={pageUrl} />
            <SocialsCard />
            <NewsletterCard />
            <QRCard url={pageUrl} />
            {/* Sidebar large ad slot (DETAIL_PAGE_SIDEBAR) */}
            <DetailAdSlot placement="DETAIL_PAGE_SIDEBAR" />
          </div>
        </div>
      )}
      {/* Related listings by category */}
      {!!listing?.category?.id && (
        <RelatedListingsSlider
          categoryId={(listing as any).categoryId ?? listing.category.id}
          currentId={String(id)}
          title={"Related Listings"}
        />
      )}
    </div>
  );
}
function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/5 px-2 py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[hsl(var(--foreground))]/70">{icon}</span>
        <span className="subtle">{label}:</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

function RepresentativesCard({ reps }: { reps: any[] }) {
  const { t } = useLanguage();
  if (!Array.isArray(reps) || reps.length === 0) return null;
  return (
    <div className="card p-5 space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <User className="size-4" /> {t("listingRepresentatives")}
      </h3>
      <div className="space-y-2">
        {reps.map((r, i) => {
          const rep = r?.representative || r;
          const phone = rep?.whatsappNumber as string | undefined;
          const wa = phone
            ? `https://wa.me/${normalizeWhatsapp(phone)}`
            : undefined;
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/5 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="size-9 rounded-full bg-[hsl(var(--primary))]/15 grid place-items-center">
                  <User className="size-4 text-[hsl(var(--primary))]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {rep?.name ||
                      rep?.region ||
                      `Representative #${rep?.id ?? i + 1}`}
                  </div>
                  {rep?.region && (
                    <div className="text-xs subtle">
                      {t("region")}: {rep.region}
                    </div>
                  )}
                  {phone && (
                    <div className="text-xs subtle">
                      {t("whatsApp")}: {phone}
                    </div>
                  )}
                </div>
              </div>
              {wa && (
                <Button asChild size="sm" variant="secondary">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <MessageCircle className="size-4" /> {t("chat")}
                  </a>
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SellerCard({ user }: { user?: any }) {
  const { t } = useLanguage();
  if (!user) return null;
  return (
    <div className="card p-5 space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <User className="size-4" /> {t("seller")}
      </h3>
      <div className="flex items-center gap-3">
        <Link
          href={user?.id ? `/profile/${user.id}` : "#"}
          onClick={(e) => {
            if (!user?.id) e.preventDefault();
          }}
          className="size-10 rounded-full bg-[hsl(var(--primary))]/15 grid place-items-center overflow-hidden hover:opacity-90"
        >
          <Image
            src={asset(user.photo) || "/default-avatar.png"}
            alt={user.fullName || "User Avatar"}
            className="rounded-full"
            width={40}
            height={40}
          />
        </Link>
        <div>
          <Link
            href={user?.id ? `/profile/${user.id}` : "#"}
            onClick={(e) => {
              if (!user?.id) e.preventDefault();
            }}
            className="text-sm font-medium hover:underline"
          >
            {user.firstName ||
              user.fullName ||
              user.email ||
              `User ${user.id?.slice?.(0, 6)}`}
          </Link>
          <div className="text-xs subtle">ID: {user.id}</div>
          {user.contacts?.phone && (
            <div className="text-xs subtle">
              {t("phone")}: {user.contacts.phone}
            </div>
          )}
          {user.contacts?.whatsapp && (
            <div className="text-xs subtle">
              {t("whatsApp")}: {user.contacts.whatsapp}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user.contacts?.phone ? (
          <Button asChild size="sm" variant="primary" className="flex-1">
            <a
              href={`tel:${user.contacts.phone}`}
              className="inline-flex items-center gap-2 w-full justify-center"
            >
              <Phone className="size-4" /> {t("call")}
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="primary" className="flex-1">
            <Phone className="size-4" /> {t("contact")}
          </Button>
        )}

        {user.contacts?.whatsapp ? (
          <Button asChild size="sm" variant="ghost" className="flex-1">
            <a
              href={`https://wa.me/${String(user.contacts.whatsapp).replace(
                /[+\s]/g,
                ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 w-full justify-center"
            >
              <MessageCircle className="size-4" /> {t("whatsApp")}
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="ghost" className="flex-1">
            <MessageCircle className="size-4" /> {t("message")}
          </Button>
        )}
      </div>
    </div>
  );
}

function ActionsCard({ pageUrl }: { pageUrl: string }) {
  const { t } = useLanguage();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch { }
  };
  const share = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ url: pageUrl });
      } catch { }
    } else {
      copy();
    }
  };
  return (
    <div className="card p-5 space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <Share2 className="size-4" /> {t("quickActions")}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={share}
          size="sm"
          variant="secondary"
          className="w-full"
        >
          <Share2 className="size-4" /> {t("shareText")}
        </Button>
        <Button onClick={copy} size="sm" variant="ghost" className="w-full">
          <Copy className="size-4" /> {t("copyLink")}
        </Button>
        <Button size="sm" variant="ghost" className="w-full">
          <Heart className="size-4" /> {t("save")}
        </Button>
        <Button size="sm" variant="ghost" className="w-full">
          <Flag className="size-4" /> {t("report") || "Report"}
        </Button>
      </div>
    </div>
  );
}

function SocialsCard() {
  return (
    <div className="card p-5">
      <h3 className="font-semibold mb-3">Follow</h3>
      <div className="flex items-center gap-2">
        <Link
          href="#"
          className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 p-2 transition-all hover:-translate-y-0.5"
        >
          <svg
            aria-hidden
            className="size-4 text-[hsl(var(--foreground))]/70 group-hover:text-[hsl(var(--primary))]"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M22.46 6c-.77.35-1.6.58-2.46.69a4.16 4.16 0 0 0 1.82-2.3a8.3 8.3 0 0 1-2.63 1a4.15 4.15 0 0 0-7.07 3.78A11.8 11.8 0 0 1 3.15 4.6a4.13 4.13 0 0 0 1.28 5.54a4.1 4.1 0 0 1-1.88-.52v.05a4.15 4.15 0 0 0 3.33 4.07a4.2 4.2 0 0 1-1.88.07a4.16 4.16 0 0 0 3.88 2.89A8.33 8.33 0 0 1 2 19.54a11.76 11.76 0 0 0 6.36 1.86c7.63 0 11.8-6.32 11.8-11.8l-.01-.54A8.4 8.4 0 0 0 22.46 6Z"
            />
          </svg>
        </Link>
        <Link
          href="#"
          className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 p-2 transition-all hover:-translate-y-0.5"
        >
          <svg
            aria-hidden
            className="size-4 text-[hsl(var(--foreground))]/70 group-hover:text-[hsl(var(--primary))]"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2Zm3.95 7.05L10.5 14.5L8.05 12.05l-1.4 1.4L10.5 17.3l7.85-7.85l-1.4-1.4Z"
            />
          </svg>
        </Link>
        <Link
          href="#"
          className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 p-2 transition-all hover:-translate-y-0.5"
        >
          <Link2 className="size-4 text-[hsl(var(--foreground))]/70 group-hover:text-[hsl(var(--primary))]" />
        </Link>
      </div>
    </div>
  );
}

function NewsletterCard() {
  const { t } = useLanguage();
  return (
    <div className="card p-5 space-y-2">
      <h3 className="font-semibold">{t("newsletter")}</h3>
      <p className="text-xs subtle">{t("subscribeBlurb")}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const email = String(fd.get("email") || "");
          if (!email) return;
        }}
        className="mt-1 flex items-center gap-2"
      >
        <input
          name="email"
          type="email"
          required
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none transition focus:border-[hsl(var(--primary))]/50 focus:ring-2 focus:ring-[hsl(var(--primary))]/20"
        />
        <Button type="submit" size="sm" variant="primary">
          {t("subscribe")}
        </Button>
      </form>
    </div>
  );
}

function QRCard({ url }: { url: string }) {
  const { t } = useLanguage();
  if (!url) return null;
  return (
    <div className="card p-5">
      <h3 className="font-semibold">{t("scanVisit")}</h3>
      <div className="mt-3 rounded-2xl border border-[hsl(var(--border))] bg-white p-3 shadow-sm dark:bg-white/90">
        <QRCode value={url} className="h-auto w-full" />
      </div>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < count
              ? "fill-yellow-400 text-yellow-400"
              : "text-[hsl(var(--primary))]/20"
            }`}
        />
      ))}
    </div>
  );
}

function FeedbacksSection({ feedbacks }: { feedbacks: any[] }) {
  return (
    <div className="card p-5 space-y-4">
      <h3 className="font-semibold">Feedbacks</h3>
      {(!feedbacks || feedbacks.length === 0) && (
        <p className="subtle">No feedbacks yet.</p>
      )}
      <div className="space-y-3">
        {feedbacks?.map((r: any, i: number) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/5"
          >
            <div className="flex items-center gap-3 text-sm">
              <AvatarSmall user={r.user} />
              <span className="font-medium">
                {r?.user?.fullName || r?.user?.name || "Anonymous"}
              </span>
              <Stars count={Number(r.rating) || 0} />
              {r.createdAt && (
                <span className="subtle ml-auto text-xs">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function normalizeWhatsapp(input: string) {
  return String(input).replace(/[^\d]/g, "");
}

function AvatarSmall({ user }: { user?: any }) {
  const name: string = user?.fullName || user?.name || "Anonymous";
  const photo: string | null | undefined = user?.photo;
  const initials = getInitials(name);
  return (
    <Link
      href={user?.id ? `/profile/${user.id}` : "#"}
      onClick={(e) => {
        if (!user?.id) e.preventDefault();
      }}
      className="size-8 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-[hsl(var(--foreground))]/80 grid place-items-center overflow-hidden hover:opacity-90"
    >
      {photo ? (
        <Image
          src={asset(photo)}
          alt={name}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-[11px] font-medium">{initials}</span>
      )}
    </Link>
  );
}

function getInitials(name: string) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts[1]?.[0] || "";
  return (first + last).toUpperCase() || (first || "A").toUpperCase();
}

function AdPlaceholder({ index }: { index: number }) {
  const urls = [
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
  ];
  const url = urls[index % urls.length];
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="h-[150px] w-full">
        <div className="relative h-full w-full">
          <Image src={url} alt="Advertisement" className="object-cover" fill />
        </div>
      </div>
    </div>
  );
}

function LargeAdPlaceholder() {
  const urls = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526403224741-5a0d0fb7f7b9?q=80&w=2000&auto=format&fit=crop",
  ];
  const url = urls[0];
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="w-full h-[800px]">
        <div className="relative h-full w-full">
          <Image src={url} alt="Advertisement" className="object-cover" fill />
        </div>
      </div>
    </div>
  );
}

function FeedbackCreateForm({
  listingId,
  onSuccess,
  onOptimisticAdd,
  canPost,
}: {
  listingId: string;
  onSuccess?: () => void;
  onOptimisticAdd?: (fb: any) => void;
  canPost: boolean;
}) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState("");
  const { user, token } = useAuth();
  const createFeedback = useApiMutation("post", "/feedbacks");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;
    if (!rating) return;
    if (token) setCachedToken(token);
    const optimistic = {
      id: `temp_${Date.now()}`,
      listingId,
      userId: user?.id,
      statusAfter: "APPROVED",
      rating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
      user: {
        id: user?.id,
        fullName: user?.fullName || user?.name || "You",
        name: user?.name,
        photo: user?.photo || null,
      },
    };
    onOptimisticAdd?.(optimistic);
    await createFeedback.mutateAsync({
      listingId,
      rating,
      comment: comment.trim() || undefined,
      statusAfter: "APPROVED",
    });
    setRating(0);
    setHover(0);
    setComment("");
    onSuccess?.();
  };

  return (
    <div className="card p-5 space-y-3">
      <h3 className="font-semibold">Leave a feedback</h3>
      {!canPost ? (
        <p className="text-sm subtle">
          Please{" "}
          <Link href="/sign-in" className="link">
            sign in
          </Link>{" "}
          to post feedback.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div className="flex items-center gap-3">
            <StarRatingInput
              value={hover || rating}
              onChange={(v) => setRating(v)}
              onHover={(v) => setHover(v)}
            />
            <span className="text-xs subtle">
              {rating ? `${rating}/5` : "Select rating"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something about this listing"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none transition focus:border-[hsl(var(--primary))]/50 focus:ring-2 focus:ring-[hsl(var(--primary))]/20"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={createFeedback.isPending || !rating}
            >
              Post
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
  onHover,
}: {
  value: number;
  onChange: (v: number) => void;
  onHover?: (v: number) => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-1"
      role="group"
      aria-label="Rating"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            title={`Rate ${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => onHover?.(n)}
            onMouseLeave={() => onHover?.(0)}
            onClick={() => onChange(n)}
            className={`transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 rounded-md`}
          >
            <Star
              className={`size-6 ${active ? "fill-yellow-400 text-yellow-400" : "text-yellow-400"
                }`}
            />
          </button>
        );
      })}
    </div>
  );
}
