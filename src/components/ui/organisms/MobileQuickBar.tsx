"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useTheme } from "@/lib/theme/theme-context";
import { useLanguage } from "@/components/providers/language-provider";
import { supportedLocales } from "@/lib/i18n";
import { cn } from "@/lib/cn";

function subscribe() {
  return () => {};
}

function Flag({ country, alt }: { country?: string; alt?: string }) {
  if (!country)
    return (
      <span className="inline-block w-5 h-4 rounded-sm bg-muted text-center app-text-micro leading-4">
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
 * Floating mobile-only quick-settings pill — theme + language.
 */
export function MobileQuickBar({ className }: { className?: string }) {
  const { locale, setLocale, isRtl } = useLanguage();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = theme === "dark";
  const currentLocaleData = supportedLocales.find((l) => l.code === locale)!;
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
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center gap-1.5 px-2 py-1.5 rounded-full",
          "bg-background/60 backdrop-blur-2xl",
          "border border-border/40 shadow-xl",
          "before:absolute before:-inset-2 before:bg-gradient-to-r before:from-primary/20 before:via-accent/20 before:to-transparent before:blur-xl before:-z-10",
        )}
      >
        <motion.button
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          whileTap={{ scale: 0.88 }}
          className={cn(
            "relative size-[var(--ctrl-h-sm)] rounded-xl grid place-items-center text-foreground",
            "hover:bg-muted/50 transition-colors",
          )}
        >
          {isDark ? (
            <Sun className="app-icon-sm" aria-hidden />
          ) : (
            <Moon className="app-icon-sm" aria-hidden />
          )}
        </motion.button>

        <div className="w-px h-5 bg-border/60" aria-hidden />

        <motion.button
          type="button"
          aria-label={`Switch to ${otherLocale.label}`}
          onClick={() => setLocale(otherLocale.code)}
          whileTap={{ scale: 0.88 }}
          className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <Flag country={currentLocaleData.country} alt={currentLocaleData.label} />
          <span className="app-text-caption font-medium uppercase tracking-wide">
            {locale}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
