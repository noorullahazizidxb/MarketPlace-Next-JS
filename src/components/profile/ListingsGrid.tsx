"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "../../types/user";
import { ImageSlider } from "../ui/image-slider";
import { MapPin, Tag } from "lucide-react";

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  if (!listings.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-gap)] app-density-grid-gap">
      {listings.map((l, i) => (
        <motion.article
          key={l.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group relative overflow-hidden rounded-[1.5rem] border border-border/[0.07] bg-card/90 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.28)] transition-shadow duration-300"
        >
          {/* Top shimmer line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-overlay-light/20 to-transparent z-10" />

          {/* Image */}
          <div className="relative h-44 overflow-hidden">
            {l.images?.[0]?.url ? (
              <ImageSlider
                images={l.images.map((img) => ({
                  url: img?.url || "",
                  alt: l.title || "Listing image",
                }))}
                aspect="4/3"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/10 to-primary/5 app-text-caption text-muted-foreground">
                No image
              </div>
            )}
            {/* overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-overlay-dark/30 via-transparent to-transparent pointer-events-none" />
            {/* category badge */}
            {l.category?.name && (
              <div className="absolute left-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/40 backdrop-blur-sm px-2.5 py-1 app-text-caption font-semibold text-primary-foreground/90">
                <Tag className="size-3" />
                {l.category.name}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-[var(--space-card)]">
            <h3 className="app-text-body font-semibold leading-snug line-clamp-2 text-foreground">
              {l.title}
            </h3>
            {(l as any).location && (
              <p className="mt-1.5 flex items-center gap-1 app-text-caption text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                {(l as any).location}
              </p>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
