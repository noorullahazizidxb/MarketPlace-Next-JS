"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { asset } from "@/lib/assets";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ListingDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ListingDetailsContent />
    </Suspense>
  );
}

function ListingDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const {
    data: listing,
    isLoading,
    error,
  } = useApiGet<any>(["listing", id], `/listings/${id}`);

  const images: { url: string; alt?: string | null }[] = Array.isArray(
    listing?.images
  )
    ? listing.images
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/listings"
          className="subtle inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h1 className="heading-xl">{listing?.title ?? "Listing"}</h1>
      </div>
      {isLoading && <p>Loading…</p>}
      {error && (
        <p className="text-red-500">
          {String((error as any).message || error)}
        </p>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Gallery images={images} />
            <div className="mt-4 card p-4 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                {listing?.price && (
                  <div className="px-2 py-1 rounded-xl bg-white/5 border border-white/10 text-sm">
                    {listing.price} {listing.currency}
                  </div>
                )}
                {listing?.listingType && (
                  <span className="text-xs px-2 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10">
                    {listing.listingType}
                  </span>
                )}
                {listing?.location && (
                  <span className="subtle text-sm">{listing.location}</span>
                )}
              </div>
              {listing?.description && (
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {listing.description}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <Reviews listingId={String(id)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Gallery({
  images,
}: {
  images: { url: string; alt?: string | null }[];
}) {
  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-white/5" />
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-3 lg:col-span-2 relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          fill
          alt={images[0].alt ?? ""}
          src={asset(images[0].url)}
          className="object-cover"
        />
      </div>
      <div className="hidden lg:grid grid-cols-1 gap-3">
        {images.slice(1, 4).map((img, i) => (
          <div
            key={i}
            className="relative aspect-[16/10] overflow-hidden rounded-xl"
          >
            <Image
              fill
              alt={img.alt ?? ""}
              src={asset(img.url)}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(3),
});

type ReviewForm = z.infer<typeof reviewSchema>;

function Reviews({ listingId }: { listingId: string }) {
  const { data: reviews } = useApiGet<any[] | any>(
    ["reviews", listingId],
    `/listings/${listingId}/reviews`
  );
  const list = Array.isArray(reviews) ? reviews : reviews ? [reviews] : [];

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema) as Resolver<ReviewForm>,
  });
  const createReview = useApiMutation("post", `/listings/${listingId}/reviews`);

  const onSubmit: SubmitHandler<ReviewForm> = async (data) => {
    await createReview.mutateAsync(data);
    reset();
  };

  return (
    <div className="card p-4 space-y-4">
      <h3 className="font-semibold">Reviews</h3>
      {list.length === 0 && <p className="subtle">No reviews yet.</p>}
      <div className="space-y-3">
        {list.map((r: any, i: number) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-white/10 bg-white/5"
          >
            <div className="flex items-center gap-2 text-sm">
              <Stars count={Number(r.rating) || 0} />
              <span className="subtle">{r.user?.name ?? "Anonymous"}</span>
            </div>
            {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={5}
            step={1}
            placeholder="Rating (1-5)"
            {...register("rating")}
          />
          <Input placeholder="Write a short comment" {...register("comment")} />
          <Button type="submit" disabled={isSubmitting}>
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < count ? "fill-yellow-400 text-yellow-400" : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}
