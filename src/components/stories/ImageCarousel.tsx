"use client";
import React from "react";
import { ImageSlider } from "@/components/ui/organisms/image-slider";

type Img = string | { url?: string | null } | null | undefined;

export default function ImageCarousel({ images }: { images: Img[] }) {
  const imgs = (images || []).map((u) => ({
    url: typeof u === "string" ? u : u?.url ?? undefined,
    alt: "Story image",
  }));
  return (
    <div className="w-full overflow-hidden rounded-none sm:rounded-b-xl">
      <ImageSlider
        images={imgs}
        aspect="16/9"
        heightClass="h-44 sm:h-56 md:h-64"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 640px"
      />
    </div>
  );
}
