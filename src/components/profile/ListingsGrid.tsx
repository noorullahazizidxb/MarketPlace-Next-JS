"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Listing } from "../../types/user";
import { ImageSlider } from "../ui/image-slider";

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((l) => (
        <motion.article
          key={l.id}
          whileHover={{ y: -3 }}
          className="rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="relative h-100 overflow-hidden">
            {l.images?.[0]?.url ? (
              <ImageSlider
                images={l.images.map((img) => ({
                  url: img?.url || "",
                  alt: l.title || "Listing image",
                }))}
                aspect="4/3"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm subtle">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {l.category?.name && (
              <div className="absolute left-3 bottom-3 text-xs px-2 py-1 rounded-md bg-background/70 border border-[hsl(var(--border))] backdrop-blur">
                {l.category.name}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-base font-semibold line-clamp-2">{l.title}</h3>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
