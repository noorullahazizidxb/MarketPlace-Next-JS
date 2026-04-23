"use client";
import { useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { usePathname } from "next/navigation";

const logos = [
  { src: "https://unpkg.com/simple-icons@v11/icons/google.svg", alt: "Google" },
  { src: "https://unpkg.com/simple-icons@v11/icons/amazon.svg", alt: "Amazon" },
  { src: "https://unpkg.com/simple-icons@v11/icons/microsoft.svg", alt: "Microsoft" },
  { src: "https://unpkg.com/simple-icons@v11/icons/netflix.svg", alt: "Netflix" },
  { src: "https://unpkg.com/simple-icons@v11/icons/airbnb.svg", alt: "Airbnb" },
  { src: "https://unpkg.com/simple-icons@v11/icons/uber.svg", alt: "Uber" },
];

/**
 * Partners marquee — pure-CSS infinite scroll.
 * Logos are duplicated so the strip is 2× wide; animating
 * translateX(-50%) loops seamlessly with no JS per-frame cost.
 * Hover pauses playback via .animate-marquee:hover rule in globals.css.
 */
export function Partners() {
  const pathname = usePathname();
  const { t } = useLanguage();
  // Duplicate 4× so one half (2 sets) is always wider than any viewport;
  // translateX(-50%) then snaps back on identical content → seamless.
  const items = useMemo(() => [...logos, ...logos, ...logos, ...logos], []);

  if (!pathname) return null;
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) return null;

  return (
    <section className="relative mt-12" aria-label={t("featuredPartners")}>
      <div className="container-padded">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-foreground/50 mb-5 letter-spacing-wider">
          {t("featuredPartners")}
        </h3>

        {/* Fade masks on left/right edges */}
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-[hsl(var(--card))]/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-[hsl(var(--card))]/80 to-transparent" />

          {/* The track — CSS marquee, pauses on hover.
               Using mx-2 per-item (not flex gap) so trailing space is baked
               into each item; -50% translateX then lands exactly at the seam. */}
          <div className="flex animate-marquee py-5" style={{ width: "max-content", animationDuration: "56s" }}>
            {items.map((l, idx) => (
              <div
                key={idx}
                className="mx-2 shrink-0 flex flex-col items-center justify-center gap-3 w-32 h-28 rounded-xl
                           border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]
                           hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/8
                           transition-all duration-300 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.src}
                  alt={l.alt}
                  width={40}
                  height={40}
                  className="opacity-50 group-hover:opacity-85 transition-opacity duration-300 dark:invert"
                />
                <span className="text-[10px] font-medium text-foreground/40 group-hover:text-foreground/70 transition-colors">
                  {l.alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

