"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale, fallbackLocale } from "@/lib/i18n";
import { useEffect } from "react";

interface LanguageState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: any) => string; // lightweight, replaced by helper
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: fallbackLocale,
      setLocale: (l) => set({ locale: l }),
      t: (key: any) => key,
    }),
    { name: "language-store" },
  ),
);

// Side-effect hook to reflect lang & dir on <html>
export function useHtmlLanguageAttributes(locale: Locale) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      html.lang = locale;
      // Do not set global direction; specific layout components will handle dir switching.
    }
  }, [locale]);
}
