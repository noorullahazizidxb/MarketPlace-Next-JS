"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

function Hexagon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path d="M50 0L93.3 25v50L50 100L6.7 75V25L50 0z" fill="currentColor" />
    </svg>
  );
}

export default function HomePromoBanner() {
  const { t, isRtl } = useLanguage();

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
          {/* ======  decorative shapes  ====== */}
          {/* top-left neon hex */}
          <Hexagon className="absolute -left-10 -top-10 w-32 h-32 text-[hsl(var(--accent)/0.25)] opacity-60 rotate-12" />
          {/* bottom-right blob */}
          <svg
            viewBox="0 0 200 200"
            className="absolute -bottom-16 -right-16 w-64 h-64 text-[hsl(var(--primary)/0.2)] opacity-50"
          >
            <path
              fill="currentColor"
              d="M48,-63.9C60.7,-53.1,68.1,-36.9,70.3,-19.9C72.5,-2.9,69.5,15,62.6,30.1C55.7,45.2,44.9,58.5,30.8,66.9C16.7,75.3,-0.7,78.8,-16.8,74.5C-32.9,70.2,-47.6,58.1,-58.1,42.8C-68.6,27.5,-74.9,9,-72.9,-8.7C-70.9,-26.4,-60.6,-43.3,-46.8,-54.1C-33,-64.9,-15.5,-69.6,0.9,-70.5C17.3,-71.4,34.6,-68.5,48,-63.9Z"
              transform="translate(100 100)"
            />
          </svg>

          <div className="relative px-6 py-10 md:px-10 md:py-14">
            <div
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                isRtl ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 text-center md:text-left">
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
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <button
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl
                               bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
                               shadow-md shadow-[hsl(var(--primary)/0.3)]
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
                </button>

                <div
                  className={`hidden md:flex items-center justify-center
                              bg-[hsl(var(--foreground)/0.08)] rounded-full p-4 w-20 h-20
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
