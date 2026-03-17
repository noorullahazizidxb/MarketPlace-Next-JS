"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React from "react";
import { blogHeroImage } from "@/lib/public-images";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  onCreate?: () => void;
  canCreate?: boolean;
  suggestions?: string[];
  modeLabel?: string;
  resultCount?: number;
};

export function BlogHero({
  value,
  onChange,
  onSubmit,
  onCreate,
  canCreate,
  suggestions = [],
  resultCount,
}: Props) {
  const { t, isRtl } = useLanguage();
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!searchContainerRef.current) return;
      if (!searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <section className="relative mt-5 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      {/* ----------  accent gradients + glass shapes ---------- */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,hsl(var(--accent)/.25),transparent_50%)]" />
        <motion.div
          className="absolute -left-16 top-20 w-40 h-40 rotate-45 rounded-2xl bg-[hsl(var(--accent)/.15)] backdrop-blur-xl border border-white/10"
          animate={{ rotate: [45, 60, 45], y: [0, 10, 0] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-10 top-10 w-20 h-20 rounded-full border-2 border-[hsl(var(--accent)/.4)]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 5.3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 bottom-24 w-64 h-24 rounded-full bg-[hsl(var(--accent)/.12)] backdrop-blur-xl border border-white/10"
          animate={{ x: [0, -8, 0], y: [0, 8, 0] }}
          transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 items-center gap-8">
        {/* ----------  left side ---------- */}
        <div dir={isRtl ? "rtl" : "ltr"} className={`overflow-visible ${isRtl ? "text-right" : "text-left"}`}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight relative w-fit ${isRtl ? "mr-auto" : "ml-0"}`}
          >
            {t("blogs")}
            <span className={`absolute -bottom-2 h-1 w-2/3 rounded-full bg-[hsl(var(--accent))] ${isRtl ? "right-0" : "left-0"}`} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className={`mt-4 max-w-xl text-sm sm:text-base text-[hsl(var(--muted-foreground))] ${isRtl ? "mr-auto" : "ml-0"}`}
          >
            {t("searchIntro")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`mt-6 flex items-center gap-3 ${isRtl ? "" : "justify-start"}`}
          >
            <div
              ref={searchContainerRef}
              className="relative z-20 flex-1 overflow-visible h-12 rounded-2xl border border-[hsl(var(--border))] bg-white/5 backdrop-blur-xl focus-within:border-[hsl(var(--accent))] focus-within:shadow-[0_0_0_2px_hsl(var(--accent)/.35)] transition-shadow duration-300"
            >
              <div className={`absolute top-0 h-full flex items-center ${isRtl ? "right-3" : "left-3"}`}>
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
                className={`h-full w-full bg-transparent outline-none text-sm ${isRtl ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"}`}
                aria-label="Search blogs"
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSubmit?.();
                    setShowSuggestions(false);
                  }
                }}
              />

              {showSuggestions && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                  <div className="px-3 py-2 text-xs subtle flex items-center justify-between border-b border-[hsl(var(--border))/0.5]">
                    <span>
                      {suggestions.length > 0
                        ? `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"}`
                        : (t("blogSuggestionsEmpty") as string)}
                    </span>
                    <span>{t("blogSuggestionsHint") as string}</span>
                  </div>
                  <ul className="max-h-56 overflow-auto divide-y divide-[hsl(var(--border))/0.5] p-2">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          className={`w-full rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[hsl(var(--muted))] ${isRtl ? "text-right" : "text-left"}`}
                          onClick={() => {
                            onChange(s);
                            setShowSuggestions(false);
                            onSubmit?.();
                          }}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                    {suggestions.length === 0 && (
                      <li className="px-3 py-4 text-center text-sm subtle">{t("blogSuggestionsEmpty") as string}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <Button onClick={onSubmit} variant="primary" size="md">
              <Search className="size-4" />
              {t("search") || "Search"}
            </Button>

            {canCreate && onCreate && (
              <Button onClick={onCreate} variant="accent" size="md">
                {t("createBlog")}
              </Button>
            )}
          </motion.div>
          {typeof resultCount === "number" && (
            <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </p>
          )}
        </div>

        {/* ----------  right side ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-56 sm:h-64 md:h-72 lg:h-80 rounded-2xl border border-white/10 overflow-hidden"
        >
          <Image
            src={blogHeroImage}
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
