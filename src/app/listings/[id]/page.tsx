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
  Copy,
  Check,
  CloudOff,
  RefreshCw,
  Banknote,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/molecules/button";
import { ImageSlider } from "@/components/ui/organisms/image-slider";
import QRCode from "react-qr-code";
import { useAuth } from "@/lib/use-auth";
import { asset } from "@/lib/assets";
import { setCachedToken } from "@/lib/axiosClient";
import Image from "next/image";
import { useLanguage } from "@/components/providers/language-provider";
import { RelatedListingsSlider } from "@/components/listings/RelatedListingsSlider";
import { listingPlaceholderImages } from "@/lib/public-images";
import { AnimatePresence, motion } from "framer-motion";
import { ListingDetailSkeleton } from "@/components/skeletons/ListingDetailSkeleton";
import { RevealGroup, RevealItem } from "@/components/ui/atoms/reveal";
import { swap } from "@/lib/motion";
import { toastError, toastSuccess } from "@/lib/toast";

export default function ListingDetailsPage() {
  return (
    <Suspense fallback={<ListingDetailSkeleton />}>
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
    refetch,
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
    <div className="space-y-[var(--space-section)] app-shell-page" data-app-page="listing-detail">
      {isLoading ? (
        <ListingDetailSkeleton />
      ) : (
        <header className="space-y-3">
          <Link
            href="/listings"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-card/70 px-3 app-text-label font-medium text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="app-icon-sm rtl:-scale-x-100" aria-hidden /> {t("backToListings")}
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="heading-xl min-w-0 break-words">
              {listing?.title ?? t("listing")}
            </h1>
            {avgRating > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-2.5 py-1 app-text-body">
                <Stars count={Math.round(avgRating)} />
                <span className="app-text-caption tabular-nums">
                  {avgRating.toFixed(1)} ({reviewCount})
                </span>
              </span>
            )}
          </div>
        </header>
      )}
      {error && (
        <div
          role="alert"
          className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-3">
            <CloudOff className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
            <div>
              <p className="font-semibold text-destructive">{t("listingLoadError")}</p>
              <p className="mt-1 app-text-caption text-muted-foreground">{error.message}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" LeftIcon={RefreshCw} onClick={() => void refetch()}>
            {t("tryAgain")}
          </Button>
        </div>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-[var(--space-section)] lg:grid-cols-3">
          <div className="space-y-[var(--space-gap)] lg:col-span-2">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur overflow-hidden">
              <ImageSlider images={images} aspect="4/3" firstSlideIsPriority />
            </div>
            <div className="card p-[var(--space-card)] space-y-[var(--space-gap)]">
              <div className="flex flex-wrap items-center gap-3">
                {listing?.price && (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-1.5 app-text-heading-sm font-semibold tabular-nums text-foreground">
                    <CreditCard className="app-icon-md text-primary" aria-hidden />
                    {listing.price} {listing.currency}
                  </div>
                )}
                {listing?.listingType && (
                  <span className="app-text-caption px-2 py-1 rounded-full bg-[var(--foreground)]/10 border border-[var(--border)]">
                    {listing.listingType}
                  </span>
                )}
                {listing?.status && (
                  <span className="inline-flex items-center gap-1 app-text-caption px-2 py-1 rounded-full border border-[var(--border)] bg-[var(--muted)]/10">
                    <BadgeCheck className="app-icon-xs" /> {listing.status}
                  </span>
                )}
                {listing?.location && (
                  <span className="inline-flex items-center gap-1 app-text-body subtle">
                    <MapPin className="app-icon-sm" /> {listing.location}
                  </span>
                )}
                {listing?.category?.name && (
                  <span className="inline-flex items-center gap-1 app-text-body subtle">
                    <Tag className="app-icon-sm" /> {listing.category.name}
                  </span>
                )}
              </div>
              {listing?.description && (
                <p className="app-text-body leading-relaxed text-[var(--foreground)]/80">
                  {listing.description}
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 app-text-caption">
                {listing?.createdAt && (
                  <InfoPill
                    icon={<Calendar className="app-icon-xs" />}
                    label={t("created")}
                    value={new Date(listing.createdAt).toLocaleDateString()}
                  />
                )}
                {listing?.updatedAt && (
                  <InfoPill
                    icon={<Calendar className="app-icon-xs" />}
                    label={t("updated") || "Updated"}
                    value={new Date(listing.updatedAt).toLocaleDateString()}
                  />
                )}
                {listing?.approvedAt && (
                  <InfoPill
                    icon={<Calendar className="app-icon-xs" />}
                    label={t("approvedAt") || "Approved"}
                    value={new Date(listing.approvedAt).toLocaleDateString()}
                  />
                )}
                {listing?.expiresAt && (
                  <InfoPill
                    icon={<Calendar className="app-icon-xs" />}
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

          <RevealGroup className="space-y-[var(--space-gap)]">
            <RevealItem>
              {contactHidden ? (
                <RepresentativesCard reps={listing?.representatives || []} />
              ) : (
                <SellerCard user={listing?.user} />
              )}
            </RevealItem>
            <RevealItem>
              <ActionsCard pageUrl={pageUrl} />
            </RevealItem>
            <RevealItem>
              <NewsletterCard />
            </RevealItem>
            <RevealItem>
              <QRCard url={pageUrl} />
            </RevealItem>
            {/* Sidebar large ad slot (DETAIL_PAGE_SIDEBAR) */}
            <DetailAdSlot placement="DETAIL_PAGE_SIDEBAR" />
          </RevealGroup>
        </div>
      )}
      {/* Related listings by category */}
      {!!listing?.category?.id && (
        <RelatedListingsSlider
          categoryId={(listing as any).categoryId ?? listing.category.id}
          currentId={String(id)}
          title={t("relatedListings")}
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
    <div className="flex min-w-0 items-start gap-2 rounded-xl border border-border bg-muted/20 px-3 py-2">
      <span className="mt-0.5 text-muted-foreground" aria-hidden>{icon}</span>
      <dl className="min-w-0">
        <dt className="app-text-micro text-muted-foreground">{label}</dt>
        <dd className="truncate app-text-caption font-medium tabular-nums">{value}</dd>
      </dl>
    </div>
  );
}

function RepresentativesCard({ reps }: { reps: any[] }) {
  const { t } = useLanguage();
  if (!Array.isArray(reps) || reps.length === 0) return null;
  return (
    <div className="card p-[var(--space-card)] space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <User className="app-icon-sm" /> {t("listingRepresentatives")}
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
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/5 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="size-9 rounded-full bg-[var(--primary)]/15 grid place-items-center">
                  <User className="app-icon-sm text-[var(--primary)]" />
                </div>
                <div className="min-w-0">
                  <div className="app-text-body font-medium truncate">
                    {rep?.name ||
                      rep?.region ||
                      `Representative #${rep?.id ?? i + 1}`}
                  </div>
                  {rep?.region && (
                    <div className="app-text-caption subtle">
                      {t("region")}: {rep.region}
                    </div>
                  )}
                  {phone && (
                    <div className="app-text-caption subtle">
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
                    <MessageCircle className="app-icon-sm" /> {t("chat")}
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
    <div className="card p-[var(--space-card)] space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <User className="app-icon-sm" /> {t("seller")}
      </h3>
      <div className="flex items-center gap-3">
        <Link
          href={user?.id ? `/profile/${user.id}` : "#"}
          onClick={(e) => {
            if (!user?.id) e.preventDefault();
          }}
          className="size-10 rounded-full bg-[var(--primary)]/15 grid place-items-center overflow-hidden hover:opacity-90"
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
            className="app-text-body font-medium hover:underline"
          >
            {user.firstName ||
              user.fullName ||
              user.email ||
              `User ${user.id?.slice?.(0, 6)}`}
          </Link>
          <div className="app-text-caption subtle">ID: {user.id}</div>
          {user.contacts?.phone && (
            <div className="app-text-caption subtle">
              {t("phone")}: {user.contacts.phone}
            </div>
          )}
          {user.contacts?.whatsapp && (
            <div className="app-text-caption subtle">
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
              <Phone className="app-icon-sm" /> {t("call")}
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="primary" className="flex-1">
            <Phone className="app-icon-sm" /> {t("contact")}
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
              <MessageCircle className="app-icon-sm" /> {t("whatsApp")}
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="ghost" className="flex-1">
            <MessageCircle className="app-icon-sm" /> {t("message")}
          </Button>
        )}
      </div>
    </div>
  );
}

function ActionsCard({ pageUrl }: { pageUrl: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toastSuccess(t("linkCopied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError(t("linkCopyFailed"));
    }
  };
  const share = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ url: pageUrl });
      } catch { }
    } else {
      void copy();
    }
  };
  return (
    <div className="card p-[var(--space-card)] space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <Share2 className="app-icon-sm" /> {t("quickActions")}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => void share()}
          size="sm"
          variant="secondary"
          className="w-full"
        >
          <Share2 className="app-icon-sm" /> {t("shareText")}
        </Button>
        <Button onClick={() => void copy()} size="sm" variant="ghost" className="w-full" aria-live="polite">
          <span className="relative grid app-icon-sm place-items-center" aria-hidden>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={copied ? "copied" : "copy"}
                variants={swap}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 grid place-items-center"
              >
                {copied ? <Check className="app-icon-sm text-success" /> : <Copy className="app-icon-sm" />}
              </motion.span>
            </AnimatePresence>
          </span>
          {copied ? t("linkCopied") : t("copyLink")}
        </Button>
        <Button size="sm" variant="ghost" className="w-full">
          <Heart className="app-icon-sm" /> {t("save")}
        </Button>
        <Button size="sm" variant="ghost" className="w-full">
          <Flag className="app-icon-sm" /> {t("report") || "Report"}
        </Button>
      </div>
    </div>
  );
}

function NewsletterCard() {
  const { t } = useLanguage();
  return (
    <div className="card p-[var(--space-card)] space-y-2">
      <h3 className="font-semibold">{t("newsletter")}</h3>
      <p className="app-text-caption subtle">{t("subscribeBlurb")}</p>
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
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 app-text-body outline-none transition focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20"
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
    <div className="card p-[var(--space-card)]">
      <h3 className="font-semibold">{t("scanVisit")}</h3>
      <div className="mt-3 rounded-2xl border border-[var(--border)] bg-background p-3 shadow-sm dark:bg-background/90">
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
          className={`app-icon-sm ${i < count
            ? "fill-warning text-warning"
            : "text-[var(--primary)]/20"
            }`}
        />
      ))}
    </div>
  );
}

function FeedbacksSection({ feedbacks }: { feedbacks: any[] }) {
  return (
    <div className="card p-[var(--space-card)] space-y-[var(--space-gap)]">
      <h3 className="font-semibold">Feedbacks</h3>
      {(!feedbacks || feedbacks.length === 0) && (
        <p className="subtle">No feedbacks yet.</p>
      )}
      <div className="space-y-3">
        {feedbacks?.map((r: any, i: number) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/5"
          >
            <div className="flex items-center gap-3 app-text-body">
              <AvatarSmall user={r.user} />
              <span className="font-medium">
                {r?.user?.fullName || r?.user?.name || "Anonymous"}
              </span>
              <Stars count={Number(r.rating) || 0} />
              {r.createdAt && (
                <span className="subtle ml-auto app-text-caption">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {r.comment && <p className="app-text-body mt-1">{r.comment}</p>}
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
      className="size-8 rounded-full border border-[var(--border)] bg-[var(--muted)]/20 text-[var(--foreground)]/80 grid place-items-center overflow-hidden hover:opacity-90"
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
        <span className="app-text-micro font-medium">{initials}</span>
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
  const urls = listingPlaceholderImages.compact;
  const url = urls[index % urls.length];
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="h-[150px] w-full">
        <div className="relative h-full w-full">
          <Image src={url} alt="Advertisement" className="object-cover" fill />
        </div>
      </div>
    </div>
  );
}

function LargeAdPlaceholder() {
  const urls = listingPlaceholderImages.large;
  const url = urls[0];
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
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
    <div className="card p-[var(--space-card)] space-y-3">
      <h3 className="font-semibold">Leave a feedback</h3>
      {!canPost ? (
        <p className="app-text-body subtle">
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
            <span className="app-text-caption subtle">
              {rating ? `${rating}/5` : "Select rating"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something about this listing"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 app-text-body outline-none transition focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              loading={createFeedback.isPending}
              disabled={!rating}
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
            className={`transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 rounded-md`}
          >
            <Star
              className={`app-icon-md ${active ? "fill-warning text-warning" : "text-warning"
                }`}
            />
          </button>
        );
      })}
    </div>
  );
}
