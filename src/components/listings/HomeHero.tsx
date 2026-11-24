"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { SearchBox } from "@/components/ui/molecules/search-box";
import { Button } from "@/components/ui/molecules/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useRouter } from "next/navigation";
import React from "react";
import { homeHeroImages } from "@/lib/public-images";
import { useAuth } from "@/lib/use-auth";
import { Tooltip } from "@/components/ui/molecules/tooltip";
import { duration, ease } from "@/lib/motion";

function browseCatalog() {
  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomeHero() {
  const { t, isRtl } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden mt-2 md:mt-3 rounded-3xl border border-border bg-card">
      {/* ----------  accent gradients + glass shapes ---------- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_50%)]" />
        <motion.div
          className="absolute -left-20 -top-20 w-72 h-72 rotate-45 rounded-3xl bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] backdrop-blur-2xl border border-border"
          animate={{ rotate: [40, 58, 40], y: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 -bottom-16 w-96 h-32 rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] backdrop-blur-2xl border border-border"
          animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
          transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
        />

      </div>

      <div className="relative z-10 px-5 sm:px-8 md:px-10 py-8 sm:py-10 md:py-14 grid lg:grid-cols-2 items-center gap-6 md:gap-8">
        {/* ----------  left side ---------- */}
        <div dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "text-right" : "text-left"}>
          <h1
            className={`app-text-h1 font-extrabold tracking-tight relative w-fit ${isRtl ? "mr-auto" : "ml-0"}`}
          >
            {t("heroHeadline")}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration.slow, delay: 0.15, ease: ease.out }}
              className={`absolute -bottom-2 h-1 w-2/3 rounded-full bg-accent ${isRtl ? "right-0 origin-right" : "left-0 origin-left"}`}
            />
          </h1>

          <p
            className={`mt-4 max-w-xl app-text-body text-[var(--muted-foreground)] ${isRtl ? "mr-auto" : "ml-0"}`}
          >
            {t("heroSubheadline")}
          </p>

          <div className="mt-6 grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <SearchBox placeholder={t("search")} className="w-full min-w-0" fluid />
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip content={t("browseNow")} side="bottom">
                <Button variant="accent" onClick={browseCatalog}>{t("browseNow")}</Button>
              </Tooltip>
              <Tooltip content={t("listYourProperty")} side="bottom">
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!user) {
                      router.push("/sign-in");
                      return;
                    }
                    router.push("/listings/create");
                  }}
                >
                  {t("listYourProperty")}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ----------  right side ---------- */}
        <motion.div
          initial={{ scale: 1.015 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: ease.out }}
          className="relative h-56 sm:h-64 md:h-72 lg:h-80 rounded-2xl border border-border overflow-hidden"
        >
          <Image
            src={homeHeroImages.main}
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-overlay-dark/40 via-overlay-dark/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-3" aria-hidden>
            {homeHeroImages.gallery.map((url, i) => (
              <div
                key={i}
                className="relative h-16 sm:h-20 rounded-xl overflow-hidden border border-overlay-light/25 shadow-md"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 28vw, (max-width: 1024px) 18vw, 12vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
