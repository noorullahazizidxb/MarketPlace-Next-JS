"use client";
import React, { useMemo } from "react";
import { useApiGet } from "@/lib/api-hooks";
import Image from "next/image";

export type DetailAdPlacement =
  | "DETAIL_PAGE_1ST"
  | "DETAIL_PAGE_2ND"
  | "DETAIL_PAGE_SIDEBAR";

interface AdEntity {
  id: number;
  imageUrl?: string | null;
  placement: string;
  isActive: boolean;
  title?: string | null;
  body?: string | null;
}

// Shared fetch cache key so multiple slots on page reuse the same SWR response
const SWR_KEY = ["ads", "detail-page"] as const;

function pickAd(data: AdEntity[] | undefined, placement: DetailAdPlacement) {
  if (!data) return undefined;
  return data
    .filter(
      (a): a is AdEntity & { placement: DetailAdPlacement } =>
        a.isActive === true && a.placement === placement
    )
    .sort((a, b) => a.id - b.id)[0]; // deterministic: lowest id wins
}

export function DetailAdSlot({
  placement,
  height,
  className,
}: {
  placement: DetailAdPlacement;
  /** height in px, default 150 except sidebar default 800 */
  height?: number;
  className?: string;
}) {
  const { data } = useApiGet<AdEntity[] | undefined>(SWR_KEY, "/ads");
  const ad = useMemo(() => pickAd(data, placement), [data, placement]);

  // fixed height classes (no dynamic tailwind generation)
  const hClass =
    placement === "DETAIL_PAGE_SIDEBAR" ? "h-[800px]" : "h-[150px]";
  const url = ad?.imageUrl || undefined;

  return (
    <div
      className={
        "relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] " +
        (className || "")
      }
    >
      <div className={`w-full ${hClass}`}>
        {ad ? (
          url ? (
            <div className="relative h-full w-full">
              <Image
                src={url}
                alt={ad.title || ad.placement}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 100vw"
                priority={false}
              />
            </div>
          ) : (
            <div className="h-full w-full grid place-items-center bg-gradient-to-br from-white/5 to-white/0 text-xs text-white/40 tracking-wide p-4 text-center">
              {ad.title || ad.placement.replace(/_/g, " ")}
            </div>
          )
        ) : (
          // skeleton placeholder while no active ad (or while loading)
          <div className="h-full w-full bg-white/5 animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default DetailAdSlot;
