"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useEffect } from "react";
import { useAppStore } from "@/store/app.store";
import { Compass, Sparkles, Stars } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();
  const setHideChrome = useAppStore((s) => s.setHideChrome);

  useEffect(() => {
    setHideChrome(true);
    return () => setHideChrome(false);
  }, [setHideChrome]);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      {/* Ambient gradient shapes */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute -top-32 -right-24 size-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.25),transparent_60%)] blur-3xl"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: [0, 10, 0] }}
        transition={{
          duration: 2.6,
          delay: 0.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute -bottom-40 -left-24 size-[520px] rounded-full bg-[radial-gradient(circle_at_70%_70%,hsl(var(--accent)/0.22),transparent_60%)] blur-3xl"
      />

      {/* Subtle animated wireframe ring */}
      <motion.svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute inset-0 m-auto h-[420px] w-[420px] opacity-[0.18]"
        initial={{ rotate: -6, opacity: 0 }}
        animate={{ rotate: 6, opacity: 1 }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" />
          </linearGradient>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="url(#ring)"
          strokeWidth="1.5"
        />
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="url(#ring)"
          strokeWidth="1"
        />
        <circle
          cx="200"
          cy="200"
          r="80"
          fill="none"
          stroke="url(#ring)"
          strokeWidth="0.8"
        />
      </motion.svg>

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-3xl px-6"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[linear-gradient(to_bottom_right,hsl(var(--card)),hsl(var(--card))/80)] p-8 sm:p-12 shadow-2xl">
          {/* Decorative sparkle */}
          <div className="pointer-events-none absolute -top-6 -left-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-xl">
            <Sparkles className="size-6 text-[hsl(var(--primary))]" />
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[hsl(var(--muted-foreground))] backdrop-blur"
            >
              <Stars className="size-3" />
              {t("notFoundTitle")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 text-7xl sm:text-8xl md:text-9xl font-black tracking-[-0.02em] bg-gradient-to-br from-[hsl(var(--primary))] via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent drop-shadow"
            >
              404
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-[hsl(var(--muted-foreground))]"
            >
              {t("notFoundDescription")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/">
                <Button variant="primary" className="group px-6 py-2.5 text-sm">
                  <Compass className="mr-2 size-4 transition-transform group-hover:-translate-y-0.5" />
                  {t("notFoundGoHome")}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Subtle corner highlight */}
          <div className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </motion.div>
    </section>
  );
}
