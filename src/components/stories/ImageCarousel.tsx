"use client";
import React from "react";
import { ImageSlider } from "@/components/ui/image-slider";

type Img = string | { url?: string | null } | null | undefined;

export default function ImageCarousel({ images }: { images: Img[] }) {
  const imgs = (images || []).map((u) => ({
    url: typeof u === "string" ? u : u?.url ?? undefined,
    alt: "Story image",
  }));
  return (
    <div className="rounded-xl overflow-hidden">
      <ImageSlider images={imgs} aspect="16/9" />
    </div>
  );
}
