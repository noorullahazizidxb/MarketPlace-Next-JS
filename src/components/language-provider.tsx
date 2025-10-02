"use client";
import { createContext, useContext, useMemo } from "react";
import { getTranslation, Locale, translations, isRtl } from "@/lib/i18n";
import {
  useLanguageStore,
  useHtmlLanguageAttributes,
} from "@/store/language.store";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof (typeof translations)["en"]) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  useHtmlLanguageAttributes(locale);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => getTranslation(locale, key),
      isRtl: isRtl(locale),
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
