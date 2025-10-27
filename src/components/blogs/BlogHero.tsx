"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
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
    <section className="relative overflow-hidden mt-5 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      {/* ----------  accent gradients + glass shapes ---------- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,hsl(var(--accent)/.25),transparent_50%)]" />
        <div className="absolute -left-16 top-20 w-40 h-40 rotate-45 rounded-2xl bg-[hsl(var(--accent)/.15)] backdrop-blur-xl border border-white/10" />
        <div className="absolute left-10 top-10 w-20 h-20 rounded-full border-2 border-[hsl(var(--accent)/.4)]" />
        <div className="absolute -right-20 bottom-24 w-64 h-24 rounded-full bg-[hsl(var(--accent)/.12)] backdrop-blur-xl border border-white/10" />
      </div>

      <div className="relative z-10 px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 items-center gap-8">
        {/* ----------  left side ---------- */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight relative w-fit"
          >
            {t("blogs")}
            <span className="absolute -bottom-2 left-0 h-1 w-2/3 rounded-full bg-[hsl(var(--accent))]" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl"
          >
            {t("searchIntro")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 flex items-center gap-3"
          >
            <div className="relative flex-1 h-12 rounded-2xl border border-[hsl(var(--border))] bg-white/5 backdrop-blur-xl focus-within:border-[hsl(var(--accent))] focus-within:shadow-[0_0_0_2px_hsl(var(--accent)/.35)] transition-shadow duration-300">
              <div className="absolute left-3 top-0 h-full flex items-center">
                <svg
                  className="size-5 text-foreground/60"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("searchListingsPlaceholder")}
                className="w-full h-full pl-11 pr-4 bg-transparent outline-none text-sm"
                aria-label="Search blogs"
              />
            </div>

            {canCreate && onCreate && (
              <Button onClick={onCreate} variant="accent" size="md">
                {t("createBlog")}
              </Button>
            )}
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
            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop"
            alt="Blog hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            <svg
              className="size-5 text-[hsl(var(--accent))]"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 20h9M16.5 3.5l-9 9L2 16.5l3.5-5.5 9-9z" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
