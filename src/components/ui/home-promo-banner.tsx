"use client";

import React from "react";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export default function HomePromoBanner() {
  const { t, isRtl } = useLanguage();
  return (
    <section
      aria-label={(t as any)("homePromoBanner") || "See our products"}
      className="w-full"
    >
      <div className="container-padded">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
          <div className="absolute inset-0 bg-[hsl(var(--accent))]" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.03)] to-transparent" />
          <div className="relative">
            <div className="px-4 py-8 md:px-8 md:py-14">
              <div
                className={`flex ${
                  isRtl ? "flex-row-reverse" : "flex-row"
                } items-center gap-6 md:gap-12`}
              >
                <div className="flex-1 min-w-0">
                  <h2 className="heading-2xl text-[hsl(var(--accent-foreground))]">
                    {(t as any)("homePromoTitle") ||
                      "تمام محصولات ما را ببینید!"}
                  </h2>
                  <p className="mt-3 text-base text-[hsl(var(--accent-foreground))]/88 max-w-3xl">
                    {(t as any)("homePromoSubtitle") ||
                      "پیش از صدها موبایل های جدید و مستعمل از بهترین فروشگاه های افغانستان در دسترس شما."}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md transition-transform transform active:scale-95 hover:[background-color:hsl(var(--secondary))] hover:[color:hsl(var(--secondary-foreground))]`}
                    aria-label={(t as any)("viewAll") || "View all"}
                  >
                    {isRtl ? (
                      <ArrowLeft className="size-4 text-current" />
                    ) : null}
                    <span className="font-medium text-sm">
                      {(t as any)("viewAllMobiles") || "مشاهده همه موبایل ها"}
                    </span>
                    {!isRtl ? (
                      <ArrowRight className="size-4 text-current" />
                    ) : null}
                  </button>

                  <div
                    className={`hidden md:flex items-center justify-center bg-[hsl(var(--foreground))/0.10] rounded-full p-5 w-28 h-28 shadow-inner transform transition-all duration-300 group-hover:scale-105 ${
                      isRtl ? "-scale-x-100" : ""
                    }`}
                  >
                    <ShoppingCart className="size-14 text-[hsl(var(--foreground))] drop-shadow-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
