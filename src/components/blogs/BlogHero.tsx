"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/providers/language-provider";
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onCreate?: () => void;
  canCreate?: boolean;
};

export function BlogHero({ value, onChange, onCreate, canCreate }: Props) {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-visible mt-5 rounded-3xl border border-[hsl(var(--border))] bg-[radial-gradient(1200px_600px_at_90%_-10%,hsl(var(--primary)/0.15),transparent_60%),_linear-gradient(to_bottom_right,hsl(var(--card)),hsl(var(--card))/80)]">
      <div className="pointer-events-none absolute -top-24 -right-24 size-[380px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative overflow-visible px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 items-center gap-8 z-[1]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            {t("blogs")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-3 text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl"
          >
            {t("searchIntro") as string}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 grid gap-3 items-center"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="glass rounded-2xl px-3 h-12 flex items-center gap-3 w-full">
                <svg
                  className="size-5 text-foreground/60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="bg-transparent outline-none text-sm flex-1 min-w-0"
                  placeholder={t("searchListingsPlaceholder") as string}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  aria-label="Search blogs"
                />
              </div>
              {canCreate && onCreate && (
                <button
                  type="button"
                  onClick={onCreate}
                  className="inline-flex items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 h-12 hover:opacity-90 transition whitespace-nowrap"
                >
                  {t("createBlog")}
                </button>
              )}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative h-56 sm:h-64 md:h-72 lg:h-80 rounded-2xl border border-white/10 overflow-hidden"
            aria-hidden="true"
            role="presentation"
          >
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop"
              alt="Blog hero"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </motion.div>
      </div>
    </section>
  );
}
