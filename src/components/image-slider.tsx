"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";

type Slide = { url?: string | null; alt?: string | null };

export function ImageSlider({
  images,
  className = "",
  aspect = "4/1",
}: {
  images?: Slide[] | null;
  className?: string;
  aspect?: string; // e.g. "16/9" or "16/10"
}) {
  const slides =
    Array.isArray(images) && images.length > 0
      ? images
      : [{ url: "/images/placeholder-card.jpg", alt: "placeholder" }];
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // simple autoplay
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [slides.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let dx = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) dx = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
      if (dx > 50) setIndex((i) => Math.max(0, i - 1));
      else if (dx < -50) setIndex((i) => Math.min(slides.length - 1, i + 1));
      dx = 0;
    };
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [slides.length]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div className={`w-full`} style={{ aspectRatio: aspect }}>
        <div
          className="h-full flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="relative min-w-full h-full">
              <Image
                src={asset(s?.url) || "/images/placeholder-card.jpg"}
                alt={s?.alt || `Slide ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={() =>
              setIndex((i) => (i - 1 + slides.length) % slides.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full"
            style={{ zIndex: 1 }}
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 glass size-9 grid place-items-center rounded-full"
            style={{ zIndex: 1 }}
          >
            ›
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-2 z-30">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
