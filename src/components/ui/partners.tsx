"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { usePathname } from "next/navigation";
const logos = [
  { src: "https://unpkg.com/simple-icons@v11/icons/google.svg", alt: "Google" },
  { src: "https://unpkg.com/simple-icons@v11/icons/amazon.svg", alt: "Amazon" },
  {
    src: "https://unpkg.com/simple-icons@v11/icons/microsoft.svg",
    alt: "Microsoft",
  },
  {
    src: "https://unpkg.com/simple-icons@v11/icons/netflix.svg",
    alt: "Netflix",
  },
  { src: "https://unpkg.com/simple-icons@v11/icons/airbnb.svg", alt: "Airbnb" },
  { src: "https://unpkg.com/simple-icons@v11/icons/uber.svg", alt: "Uber" },
];

export function Partners() {
  const pathname = usePathname();
  // Do not show footer on sign-in page

  const { t } = useLanguage();
  const items = useMemo(() => [...logos, ...logos], []); // repeat for marquee
  if (!pathname) return null;
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
    return null;
  return (
    <section className="relative mt-12">
      <div className="container-padded">
        <h3 className="text-sm font-semibold tracking-wide text-foreground/70 mb-4">
          {t("featuredPartners")}
        </h3>
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80">
          <motion.div
            className="flex items-center gap-10 py-6"
            initial={{ x: 0 }}
            animate={{ x: [0, -400] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            {items.map((l, idx) => (
              <div
                key={idx}
                className="group shrink-0 h-12 w-28 grid place-items-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={l.src}
                  alt={l.alt}
                  width={56}
                  height={56}
                  className="opacity-80"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
