"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Home, Tag, SlidersHorizontal, Check } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useApiGet } from "@/lib/api-hooks";
import { cn } from "@/lib/cn";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

type Category = { id: number; name: string; slug: string };

function setParam(params: URLSearchParams, key: string, value?: string | null) {
  const p = new URLSearchParams(params.toString());
  if (value && value.length > 0) p.set(key, value);
  else p.delete(key);
  return p;
}

function Chip({
  label,
  active,
  onClick,
  id,
  Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  id: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <motion.button
      layout
      layoutId={undefined}
      key={id}
      whileTap={{ scale: 0.95 }}
      animate={{ opacity: 1 }}
      onClick={onClick}
      className={cn(
        "relative px-4 min-h-[var(--ctrl-h-sm)] h-[var(--ctrl-h-sm)] rounded-full app-text-label font-medium inline-flex items-center gap-1.5 border transition-all duration-200 overflow-hidden select-none",
        active
          ? "bg-primary border-primary/40 text-primary-foreground shadow-[0_2px_12px_-3px_color-mix(in oklab, var(--primary) 50%, transparent)]"
          : "bg-card/60 backdrop-blur-sm border-border/60 text-foreground/70 hover:border-primary/40 hover:text-foreground hover:bg-card"
      )}
    >
      {/* active shimmer */}
      {active && (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-overlay-light/30 to-transparent" />
      )}
      <AnimatePresence mode="wait">
        {active ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0, width: 0 }}
            animate={{ scale: 1, opacity: 1, width: "1rem" }}
            exit={{ scale: 0, opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden flex-shrink-0"
          >
            <Check className="size-3.5" />
          </motion.span>
        ) : Icon ? (
          <motion.span
            key="icon"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Icon className="size-3.5 text-muted-foreground" />
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span>{label}</span>
    </motion.button>
  );
}

export function FiltersBar() {
  const { t } = useLanguage();
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const type = search.get("type") || "";
  const categoryId = search.get("categoryId") || "";

  const { data: categories } = useApiGet<Category[] | Category>(
    ["categories"],
    "/categories"
  );
  const cats: Category[] = Array.isArray(categories)
    ? categories
    : categories
      ? [categories]
      : [];

  const onType = (next: string) => {
    const q = setParam(search, "type", next === type ? null : next);
    q.delete("page");
    q.delete("id");
    router.push(`${pathname}?${q.toString()}`);
  };
  const onCategory = (id: string) => {
    const isSame = id === categoryId;
    const q = setParam(search, "categoryId", isSame ? null : id);
    q.delete("page");
    q.delete("id");
    router.push(`${pathname}?${q.toString()}`);
  };

  const activeCount = (type ? 1 : 0) + (categoryId ? 1 : 0);

  return (
    <>
      {/* Mobile trigger */}
      <div className="flex items-center gap-[var(--space-gap)] sm:hidden">
        <Button
          type="button"
          variant="primary"
          LeftIcon={SlidersHorizontal}
          onClick={() => setOpen(true)}
          className="relative min-h-[var(--ctrl-h)] h-[var(--ctrl-h)] px-4"
        >
          <span className="app-text-label font-semibold">
            {(t as any)("filters") || "Filters"}
          </span>
          {activeCount > 0 && (
            <span className="size-5 rounded-full bg-background/20 app-text-caption font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="app-text-caption text-primary font-medium"
          >
            {activeCount} {(t as any)("filtersActive") || "active"}
          </motion.span>
        )}
      </div>

      {/* Desktop pill chips */}
      <div className="hidden sm:flex flex-wrap items-center gap-[var(--space-gap)]">
        {/* Divider label */}
        <span className="app-text-caption uppercase tracking-widest font-semibold text-foreground/35 mr-1">
          {t("typeLabel")}
        </span>
        <Chip label={t("all")} active={type === ""} onClick={() => onType("")} id="type-all" Icon={Home} />
        <Chip label={t("rent")} active={type === "RENT"} onClick={() => onType("RENT")} id="type-rent" Icon={Home} />
        <Chip label={t("sale")} active={type === "SALE"} onClick={() => onType("SALE")} id="type-sale" Icon={Tag} />

        {/* Divider */}
        <div className="mx-2 h-5 w-px rounded-full bg-border/50" />

        <span className="app-text-caption uppercase tracking-widest font-semibold text-foreground/35 mr-1">
          {t("categoryLabel")}
        </span>
        <Chip label={t("all")} active={categoryId === ""} onClick={() => onCategory("")} id="category-all" Icon={Box} />
        {cats.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            active={categoryId === String(c.id)}
            onClick={() => onCategory(String(c.id))}
            id={`category-${c.id}`}
            Icon={Box}
          />
        ))}
      </div>

      {/* Bottom sheet for mobile */}
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={(t as any)("filters") || "Filters"}
      >
        <div className="p-[var(--space-card)] space-y-[var(--space-section)]">
          <div>
            <p className="app-text-caption uppercase tracking-widest font-semibold text-foreground/40 mb-3">
              {t("typeLabel")}
            </p>
            <div className="flex flex-wrap gap-[var(--space-gap)]">
              <Chip label={t("all")} active={type === ""} onClick={() => onType("")} id="m-type-all" Icon={Home} />
              <Chip label={t("rent")} active={type === "RENT"} onClick={() => onType("RENT")} id="m-type-rent" Icon={Home} />
              <Chip label={t("sale")} active={type === "SALE"} onClick={() => onType("SALE")} id="m-type-sale" Icon={Tag} />
            </div>
          </div>
          <div>
            <p className="app-text-caption uppercase tracking-widest font-semibold text-foreground/40 mb-3">
              {t("categoryLabel")}
            </p>
            <div className="flex flex-wrap gap-[var(--space-gap)] max-h-60 overflow-y-auto pr-1">
              <Chip label={t("all")} active={categoryId === ""} onClick={() => onCategory("")} id="m-cat-all" Icon={Box} />
              {cats.map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  active={categoryId === String(c.id)}
                  onClick={() => onCategory(String(c.id))}
                  id={`m-cat-${c.id}`}
                  Icon={Box}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button variant="accent" size="sm" onClick={() => setOpen(false)}>
              {t("close") || "Close"}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
