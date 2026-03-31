"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { SearchBox } from "@/components/ui/search-box";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useRouter } from "next/navigation";
import React from "react";
import { homeHeroImages } from "@/lib/public-images";
import { useAuth } from "@/lib/use-auth";
import { Tooltip } from "@/components/ui/tooltip";

export function HomeHero() {
  const { t, isRtl } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden mt-5 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      {/* ----------  accent gradients + glass shapes ---------- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(var(--accent)/.3),transparent_50%)]" />
        <motion.div
          className="absolute -left-20 -top-20 w-72 h-72 rotate-45 rounded-3xl bg-[hsl(var(--accent)/.12)] backdrop-blur-2xl border border-white/10"
          animate={{ rotate: [40, 58, 40], y: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 -bottom-16 w-96 h-32 rounded-full bg-[hsl(var(--accent)/.1)] backdrop-blur-2xl border border-white/10"
          animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
          transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
        />

      </div>

      <div className="relative z-10 px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 items-center gap-8">
        {/* ----------  left side ---------- */}
        <div dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "text-right" : "text-left"}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight relative w-fit ${isRtl ? "mr-auto" : "ml-0"}`}
          >
            {t("heroHeadline")}
            <span className={`absolute -bottom-2 h-1 w-2/3 rounded-full bg-[hsl(var(--accent))] ${isRtl ? "right-0" : "left-0"}`} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className={`mt-4 max-w-xl text-sm sm:text-base text-[hsl(var(--muted-foreground))] ${isRtl ? "mr-auto" : "ml-0"}`}
          >
            {t("heroSubheadline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`mt-6 grid items-center gap-3 ${isRtl ? "sm:grid-cols-[1fr_auto]" : "sm:grid-cols-[1fr_auto]"}`}
          >
            <SearchBox placeholder={t("search")} className="w-full" />
            <div className="flex items-center gap-2">
              <Tooltip content={t("browseNow")} side="bottom">
                <Button variant="accent" onClick={() => router.push("/listings")}>{t("browseNow")}</Button>
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
          </motion.div>
        </div>

        {/* ----------  right side ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-56 sm:h-64 md:h-72 lg:h-80 rounded-2xl border border-white/10 overflow-hidden"
        >
          <Image
            src={homeHeroImages.main}
            alt="Hero property"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-3">
            {homeHeroImages.gallery.map((url, i) => (
              <div
                key={i}
                className="relative h-20 rounded-xl overflow-hidden border border-white/20"
              >
                <Image
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover"
                />
                {i === 1 && (
                  <div className="absolute inset-0 grid place-items-center bg-black/20">
                    <svg
                      className="size-6 text-white"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
