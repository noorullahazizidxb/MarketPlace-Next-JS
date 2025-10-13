"use client";
import React from "react";
import { ImageSlider } from "@/components/ui/image-slider";

export default function ImageCarousel({ images }: { images: string[] }) {
  const imgs = images.map((u) => ({ url: u, alt: "Story image" }));
  return (
    <div className="rounded-xl overflow-hidden">
      <ImageSlider images={imgs} aspect="16/9" />
    </div>
  );
}
