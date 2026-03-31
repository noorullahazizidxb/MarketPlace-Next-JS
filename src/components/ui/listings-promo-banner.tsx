"use client";

import React from "react";
import { motion } from "framer-motion";
import { BadgePercent, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

function Prism(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" {...props}>
      <path fill="currentColor" d="M100 0L200 100 100 200 0 100z" opacity="0.4" />
    </svg>
  );
}

export default function ListingsPromoBanner() {
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
          <motion.div
            className="absolute -left-20 -top-20"
            animate={{ rotate: [36, 52, 36], y: [0, 10, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Prism className="w-64 h-64 text-[hsl(var(--accent)/0.25)]" />
          </motion.div>
          <motion.div
            className="absolute -right-24 -bottom-24"
            animate={{ rotate: [-8, -20, -8], x: [0, -8, 0] }}
            transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Prism className="w-80 h-80 text-[hsl(var(--primary)/0.15)]" />
          </motion.div>

          <div className="relative px-6 py-10 md:px-10 md:py-14">
            <div
              className={isRtl
                ? "grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12"
                : "grid items-center gap-8 md:grid-cols-[auto_minmax(0,1.2fr)_minmax(0,0.9fr)] md:gap-12"}
            >
              {!isRtl && (
                <div className="hidden md:flex md:justify-start">
                  <Tooltip content={(t as any)("deals") || "Deals"} side="right">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-16 w-16 rounded-full border border-[hsl(var(--secondary-foreground)/0.12)] bg-[hsl(var(--background))/0.58] p-0 shadow-inner backdrop-blur-sm hover:bg-[hsl(var(--accent)/0.12)]"
                      aria-label={(t as any)("deals") || "Deals"}
                    >
                      <BadgePercent className="size-7 text-[hsl(var(--accent))]" />
                    </Button>
                  </Tooltip>
                </div>
              )}

              <div className={`flex-1 ${isRtl ? "text-center md:text-right" : "text-center md:text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
                <motion.h2
                  initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="heading-2xl text-[hsl(var(--secondary-foreground))] drop-shadow"
                >
                  {(t as any)("listingsPromoTitle") || "جدیدترین موبایل ها"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -40 }}
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
                className={isRtl ? "flex flex-wrap items-center justify-center gap-4 md:justify-start" : "flex flex-col items-center gap-3 md:items-start"}
              >
                <Tooltip content={(t as any)("browseNow") || "Browse listings"} side="top">
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl
                               bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]
                               shadow-lg shadow-[hsl(var(--accent)/0.4)]
                               no-underline hover:no-underline hover:text-[hsl(var(--accent-foreground))]
                               hover:scale-105 active:scale-95
                               transition-all duration-200"
                    aria-label={(t as any)("viewAll") || "View all"}
                  >
                    <DirectionIcon className="size-4" />
                    <span className="font-semibold text-sm">
                      {(t as any)("Rent, Buy & Sale") || "کرایه و یا خرید "}
                    </span>
                  </Link>
                </Tooltip>

                <Tooltip content={(t as any)("deals") || "Featured deals"} side="top">
                  <Link
                    href="/listings?tag=featured#listings"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                               bg-transparent text-[hsl(var(--secondary-foreground))]
                               border border-[hsl(var(--secondary-foreground)/0.08)]
                               no-underline hover:no-underline hover:text-[hsl(var(--secondary-foreground))]
                               hover:bg-[hsl(var(--accent)/0.06)] active:scale-95
                               transition-all duration-200"
                    aria-label={(t as any)("deals") || "Deals"}
                  >
                    <Sparkles className="size-4" />
                    <span className="text-sm">
                      {(t as any)("deals") || "پیشنهادها"}
                    </span>
                  </Link>
                </Tooltip>

              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
