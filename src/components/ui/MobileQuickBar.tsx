"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useThemeStore } from "@/store/theme.store";
import { useLanguage } from "@/components/providers/language-provider";
import { supportedLocales } from "@/lib/i18n";
import { cn } from "@/lib/cn";

function subscribe() {
  return () => { };
}

/** Compact flag image */
function Flag({ country, alt }: { country?: string; alt?: string }) {
  if (!country)
    return (
      <span className="inline-block w-5 h-4 rounded-sm bg-white/10 text-center text-[10px] leading-4">
        {alt?.slice(0, 2) ?? ""}
      </span>
    );
  return (
    <Image
      src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`}
      alt={alt || country}
      width={20}
      height={14}
      className="rounded-sm object-cover"
    />
  );
}

/**
 * Floating mobile-only quick-settings pill rendered at the top of the screen.
 * Provides theme toggling and language switching in a compact glass container.
 * Only visible on screens narrower than `md` breakpoint.
 */
export function MobileQuickBar({ className }: { className?: string }) {
  const { locale, setLocale, isRtl } = useLanguage();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = mode === "dark";
  const currentLocaleData = supportedLocales.find((l) => l.code === locale)!;

  // Toggle between the two available locales
  const otherLocale = supportedLocales.find((l) => l.code !== locale)!;

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 32, delay: 0.15 }}
      className={cn(
        "md:hidden fixed top-3 z-[490] flex items-center",
        isRtl ? "left-3" : "right-3",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center gap-1.5 px-2 py-1.5 rounded-full",
          "bg-[hsl(var(--background))]/60 backdrop-blur-2xl",
          "border border-white/20 shadow-xl",
          "before:absolute before:-inset-2 before:bg-gradient-to-r before:from-primary/20 before:via-fuchsia-500/20 before:to-transparent before:blur-xl before:-z-10"
        )}
      >
        {/* ── Theme toggle ── */}
        <motion.button
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setMode(isDark ? "light" : "dark")}
          whileTap={{ scale: 0.88 }}
          className={cn(
            "relative size-9 rounded-xl grid place-items-center text-[hsl(var(--foreground))]",
            "transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 ring-primary/40"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? "sun" : "moon"}
              initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="grid place-items-center"
            >
              {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* ── Divider ── */}
        <span className="w-px h-5 bg-white/10 rounded-full" />

        {/* ── Language toggle ── */}
        <motion.button
          type="button"
          aria-label={`Switch to ${otherLocale.label}`}
          onClick={() => setLocale(otherLocale.code)}
          whileTap={{ scale: 0.88 }}
          className={cn(
            "flex items-center gap-2 h-9 px-2.5 rounded-xl",
            "text-[hsl(var(--foreground))] text-xs font-semibold",
            "transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 ring-primary/40"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={locale}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2"
            >
              <Flag
                country={currentLocaleData.country}
                alt={currentLocaleData.label}
              />
              <span className="tracking-wide uppercase select-none">
                {locale.toUpperCase()}
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
