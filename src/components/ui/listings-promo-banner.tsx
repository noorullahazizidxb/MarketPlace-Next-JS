"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export default function ListingsPromoBanner() {
  const { t, isRtl } = useLanguage();

  /* ----------  inline triangle prism  ---------- */
  const Prism = (props: any) => (
    <svg viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M100 0L200 100 100 200 0 100z"
        opacity="0.4"
      />
    </svg>
  );

  return (
    <section
      aria-label={(t as any)("homePromoBanner") || "See our products"}
      className="w-full"
    >
      <div className="container-padded">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl
                       border border-[hsl(var(--border))]
                       bg-gradient-to-tr from-[hsl(var(--secondary))]
                                         via-[hsl(var(--accent)/0.12)]
                                         to-[hsl(var(--card))]
                       shadow-lg shadow-[hsl(var(--accent)/0.15)]"
        >
          {/* ======  decorative shapes  ====== */}
          <Prism className="absolute -left-20 -top-20 w-64 h-64 text-[hsl(var(--accent)/0.25)] rotate-45" />
          <Prism className="absolute -right-24 -bottom-24 w-80 h-80 text-[hsl(var(--primary)/0.15)] -rotate-12" />

          <div className="relative px-6 py-10 md:px-10 md:py-14">
            <div
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                isRtl ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="heading-2xl text-[hsl(var(--secondary-foreground))] drop-shadow"
                >
                  {(t as any)("listingsPromoTitle") || "جدیدترین موبایل ها"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 text-base text-[hsl(var(--secondary-foreground)/0.88)] max-w-2xl"
                >
                  {(t as any)("listingsPromoSubtitle") ||
                    "اکنون پیشنهادهای ویژه و تازه‌ترین آگهی‌ها را ببینید و از تخفیف‌ها بهره‌مند شوید."}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex items-center gap-4"
              >
                <button
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl
                               bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]
                               shadow-lg shadow-[hsl(var(--accent)/0.4)]
                               hover:scale-105 active:scale-95
                               transition-all duration-200"
                  aria-label={(t as any)("viewAll") || "View all"}
                >
                  {isRtl && <ArrowLeft className="size-4" />}
                  <span className="font-semibold text-sm">
                    {(t as any)("viewAllMobiles") || "مشاهده همه موبایل ها"}
                  </span>
                  {!isRtl && <ArrowRight className="size-4" />}
                </button>

                <button
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                               bg-transparent text-[hsl(var(--secondary-foreground))]
                               border border-[hsl(var(--secondary-foreground)/0.08)]
                               hover:bg-[hsl(var(--accent)/0.06)] active:scale-95
                               transition-all duration-200"
                  aria-label={(t as any)("deals") || "Deals"}
                >
                  <ShoppingCart className="size-4" />
                  <span className="text-sm">
                    {(t as any)("deals") || "پیشنهادها"}
                  </span>
                </button>

                <div
                  className={`hidden md:flex items-center justify-center
                              bg-[hsl(var(--foreground)/0.06)] rounded-full p-4 w-20 h-20
                              shadow-inner backdrop-blur-sm
                              group-hover:scale-110 transition-transform duration-300
                              ${isRtl ? "-scale-x-100" : ""}`}
                >
                  <ShoppingCart className="size-12 text-[hsl(var(--foreground))] drop-shadow-xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
