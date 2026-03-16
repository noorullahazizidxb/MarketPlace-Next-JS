"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";

function Hexagon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path d="M50 0L93.3 25v50L50 100L6.7 75V25L50 0z" fill="currentColor" />
    </svg>
  );
}

export default function HomePromoBanner() {
  const { t, isRtl } = useLanguage();
  const DirectionIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      aria-label={(t as any)("homePromoBanner") || "See our products"}
      className="w-full"
    >
      <div className="container-padded">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl
                       border border-[hsl(var(--border))]
                       bg-gradient-to-br from-[hsl(var(--accent)/0.15)]
                                         via-[hsl(var(--primary)/0.08)]
                                         to-[hsl(var(--card))]
                       shadow-lg shadow-[hsl(var(--accent)/0.2)] dark:shadow-none"
        >
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <motion.div
              className="absolute -left-10 -top-10"
              animate={{ rotate: [10, 22, 10], y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Hexagon className="h-32 w-32 text-[hsl(var(--accent)/0.25)] opacity-60" />
            </motion.div>
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute -bottom-16 -right-16 h-64 w-64 text-[hsl(var(--primary)/0.2)] opacity-50"
              animate={{ rotate: [0, -10, 0], x: [0, 8, 0], y: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                fill="currentColor"
                d="M48,-63.9C60.7,-53.1,68.1,-36.9,70.3,-19.9C72.5,-2.9,69.5,15,62.6,30.1C55.7,45.2,44.9,58.5,30.8,66.9C16.7,75.3,-0.7,78.8,-16.8,74.5C-32.9,70.2,-47.6,58.1,-58.1,42.8C-68.6,27.5,-74.9,9,-72.9,-8.7C-70.9,-26.4,-60.6,-43.3,-46.8,-54.1C-33,-64.9,-15.5,-69.6,0.9,-70.5C17.3,-71.4,34.6,-68.5,48,-63.9Z"
                transform="translate(100 100)"
              />
            </motion.svg>
          </div>

          <div className="relative px-6 py-10 md:px-10 md:py-14">
            <div
              className={isRtl
                ? "flex flex-col items-center gap-8 md:flex-row-reverse md:gap-12"
                : "grid items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-10"}
            >
              <div className={isRtl ? "hidden" : "hidden md:flex md:justify-start"}>
                <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[hsl(var(--accent))/0.2] bg-[hsl(var(--background))/0.55] shadow-inner backdrop-blur-sm">
                  <ShoppingCart className="size-12 text-[hsl(var(--accent))] drop-shadow-xl" />
                </div>
              </div>

              <div className={`flex-1 ${isRtl ? "text-center md:text-right" : "text-center md:text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
                <motion.h2
                  initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="heading-2xl text-[hsl(var(--foreground))] drop-shadow-md"
                >
                  {(t as any)("homePromoTitle") || "تمام محصولات ما را ببینید!"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 text-base text-[hsl(var(--foreground)/0.8)] max-w-2xl"
                >
                  {(t as any)("homePromoSubtitle") ||
                    "پیش از صدها موبایل های جدید و مستعمل از بهترین فروشگاه های افغانستان در دسترس شما."}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                className={isRtl ? "flex flex-col items-center gap-4 sm:flex-row" : "flex flex-col items-center gap-4 md:items-end"}
              >
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl
                               bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
                               shadow-md shadow-[hsl(var(--primary)/0.3)]
                               hover:scale-105 active:scale-95
                               transition-all duration-200"
                  aria-label={(t as any)("viewAll") || "View all"}
                >
                  <DirectionIcon className="size-4" />
                  <span className="font-semibold text-sm">
                    {(t as any)("Rent, Buy & Sale") || "کرایه و یا خرید "}
                  </span>
                </Link>

                <Link
                  href="/listings?sort=newest#listings"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                               bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]
                               border border-[hsl(var(--accent)/0.2)]
                               hover:bg-[hsl(var(--accent)/0.2)] active:scale-95
                               transition-all duration-200"
                  aria-label={(t as any)("quickExplore") || "Quick explore"}
                >
                  <ShoppingCart className="size-4" />
                  <span className="text-sm">
                    {(t as any)("quickExplore") || "گشتی سریع"}
                  </span>
                </Link>

              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
