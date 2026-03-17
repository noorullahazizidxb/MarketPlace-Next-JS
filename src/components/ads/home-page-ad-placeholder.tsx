"use client";
import React, { useMemo } from "react";
import { useApiGet } from "@/lib/api-hooks";
import Image from "next/image";

// Reuse subset of AdEntity fields we care about
export type HomePageAdPlacement =
  | "HOME_PAGE_1ST"
  | "HOME_PAGE_2ND"
  | "HOME_PAGE_3RD";

interface AdEntity {
  id: number;
  imageUrl?: string | null;
  placement: HomePageAdPlacement | string; // allow unknown but we'll filter
  isActive: boolean;
  title?: string | null;
}

const ORDER: HomePageAdPlacement[] = [
  "HOME_PAGE_1ST",
  "HOME_PAGE_2ND",
  "HOME_PAGE_3RD",
];

/**
 * Renders the specific home page ad slot determined by index.
 *  index: 0 -> HOME_PAGE_1ST, 1 -> HOME_PAGE_2ND, 2 -> HOME_PAGE_3RD
 * If that placement has no active ad, nothing (not even an empty container) is rendered.
 * Any index outside the known range returns null.
 */
export function AdPlaceholder({ index }: { index: number }) {
  const { data } = useApiGet<AdEntity[] | undefined>(["ads", "home"], "/ads");

  const ad = useMemo(() => {
    if (!data || !Array.isArray(data)) return undefined;
    // Guard index range first
    if (index < 0 || index >= ORDER.length) return undefined;
    const targetPlacement = ORDER[index];
    // Find first active ad for that exact placement (prefer lowest id for determinism)
    return data
      .filter(
        (ad): ad is AdEntity & { placement: HomePageAdPlacement } =>
          ad.isActive === true && ad.placement === targetPlacement
      )
      .sort((a, b) => a.id - b.id)[0];
  }, [data, index]);

  if (!ad) return null; // do not render a container when no active ad for this slot

  const url = ad.imageUrl || undefined;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="h-[150px] w-full">
        {url ? (
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
          <div className="h-full w-full grid place-items-center bg-gradient-to-br from-white/5 to-white/0 text-xs text-white/40 tracking-wide">
            {ad.title || ad.placement.replace(/_/g, " ")}
          </div>
        )}
      </div>
    </div>
  );
}
