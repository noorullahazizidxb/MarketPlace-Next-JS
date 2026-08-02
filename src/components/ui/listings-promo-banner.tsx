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
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl
                       border border-[var(--border)]
                       bg-gradient-to-tr from-[var(--secondary)]
                                         via-[color-mix(in oklab, var(--accent) 12%, transparent)]
                                         to-[var(--card)]
                       shadow-lg shadow-[color-mix(in oklab, var(--accent) 15%, transparent)]"
        >
          {/* ======  decorative shapes  ====== */}
          <motion.div
            className="absolute -left-20 -top-20"
            animate={{ rotate: [36, 52, 36], y: [0, 10, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Prism className="w-64 h-64 text-[color-mix(in oklab, var(--accent) 25%, transparent)]" />
          </motion.div>
          <motion.div
            className="absolute -right-24 -bottom-24"
            animate={{ rotate: [-8, -20, -8], x: [0, -8, 0] }}
            transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Prism className="w-80 h-80 text-[color-mix(in oklab, var(--primary) 15%, transparent)]" />
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
                      className="h-16 w-16 rounded-full border border-[color-mix(in oklab, var(--secondary-foreground) 12%, transparent)] bg-[color-mix(in oklab, var(--background) 58%, transparent)] p-0 shadow-inner backdrop-blur-sm hover:bg-[color-mix(in oklab, var(--accent) 12%, transparent)]"
                      aria-label={(t as any)("deals") || "Deals"}
                    >
                      <BadgePercent className="size-7 text-[var(--accent)]" />
                    </Button>
                  </Tooltip>
                </div>
              )}

              <div className={`flex-1 ${isRtl ? "text-center md:text-right" : "text-center md:text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
                <motion.h2
                  initial={{ x: isRtl ? -20 : 20 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: 0.2 }}
                  className="heading-2xl text-[var(--secondary-foreground)] drop-shadow"
                >
                  {(t as any)("listingsPromoTitle") || "جدیدترین موبایل ها"}
                </motion.h2>
                <motion.p
                  initial={{ x: -20 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 app-text-body text-[color-mix(in oklab, var(--secondary-foreground) 88%, transparent)] max-w-2xl"
                >
                  {(t as any)("listingsPromoSubtitle") ||
                    "اکنون پیشنهادهای ویژه و تازه‌ترین آگهی‌ها را ببینید و از تخفیف‌ها بهره‌مند شوید."}
                </motion.p>
              </div>

              <motion.div
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className={isRtl ? "flex flex-wrap items-center justify-center gap-4 md:justify-start" : "flex flex-col items-center gap-3 md:items-start"}
              >
                <Tooltip content={(t as any)("browseNow") || "Browse listings"} side="top">
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl
                               bg-[var(--accent)] text-[var(--accent-foreground)]
                               shadow-lg shadow-[color-mix(in oklab, var(--accent) 40%, transparent)]
                               no-underline hover:no-underline hover:text-[var(--accent-foreground)]
                               hover:scale-105 active:scale-95
                               transition-all duration-200"
                    aria-label={(t as any)("viewAll") || "View all"}
                  >
                    <DirectionIcon className="size-4" />
                    <span className="font-semibold app-text-body">
                      {(t as any)("Rent, Buy & Sale") || "کرایه و یا خرید "}
                    </span>
                  </Link>
                </Tooltip>

                <Tooltip content={(t as any)("deals") || "Featured deals"} side="top">
                  <Link
                    href="/listings?tag=featured#listings"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                               bg-transparent text-[var(--secondary-foreground)]
                               border border-[color-mix(in oklab, var(--secondary-foreground) 8%, transparent)]
                               no-underline hover:no-underline hover:text-[var(--secondary-foreground)]
                               hover:bg-[color-mix(in oklab, var(--accent) 6%, transparent)] active:scale-95
                               transition-all duration-200"
                    aria-label={(t as any)("deals") || "Deals"}
                  >
                    <Sparkles className="size-4" />
                    <span className="app-text-body">
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
