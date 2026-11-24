"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { swap, tapPress } from "@/lib/motion";
import {
  Box,
  Check,
  Home,
  Layers3,
  RotateCcw,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { categoryIcon } from "@/lib/category-icons";
import { useApiGet } from "@/lib/api-hooks";
import { cn } from "@/lib/cn";
import { BottomSheet } from "@/components/ui/organisms/bottom-sheet";
import { Button } from "@/components/ui/molecules/button";

type Category = {
  id: number;
  name: string;
  slug: string;
  listings?: unknown[];
  _count?: { listings?: number };
  _counts?: { listings?: number };
};

function categoryCount(category: Category) {
  return (
    category._count?.listings ??
    category._counts?.listings ??
    category.listings?.length ??
    0
  );
}

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
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  id: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count?: number;
}) {
  return (
    <motion.button
      type="button"
      id={id}
      aria-pressed={active}
      whileTap={tapPress}
      onClick={onClick}
      className={cn(
        "relative min-h-10 shrink-0 overflow-hidden rounded-full border px-3.5 app-text-label font-medium inline-flex items-center gap-1.5 transition-[background-color,border-color,color,box-shadow] duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-primary border-primary/40 text-primary-foreground shadow-[0_2px_12px_-3px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
          : "bg-card/60 backdrop-blur-sm border-border/60 text-foreground/80 hover:border-primary/40 hover:text-foreground hover:bg-card"
      )}
    >
      {active && (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-overlay-light/30 to-transparent" />
      )}
      {(active || Icon) && (
        <span className="relative grid size-3.5 shrink-0 place-items-center" aria-hidden>
          <AnimatePresence initial={false} mode="popLayout">
            {active ? (
              <motion.span key="check" variants={swap} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 grid place-items-center">
                <Check className="size-3.5" />
              </motion.span>
            ) : Icon ? (
              <motion.span key="icon" variants={swap} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 grid place-items-center">
                <Icon className="size-3.5 text-muted-foreground" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
      )}
      <span>{label}</span>
      {typeof count === "number" && count > 0 && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 app-text-micro font-semibold tabular-nums",
            active ? "bg-background/18 text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
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
  const clearFilters = () => {
    const q = new URLSearchParams(search.toString());
    q.delete("type");
    q.delete("categoryId");
    q.delete("page");
    q.delete("id");
    router.push(q.size ? `${pathname}?${q.toString()}` : pathname);
  };

  return (
    <>
      {/* Mobile trigger */}
      <div className="flex items-center justify-between gap-[var(--space-gap)] sm:hidden">
        <Button
          type="button"
          variant="primary"
          LeftIcon={SlidersHorizontal}
          onClick={() => setOpen(true)}
          className="relative min-h-[var(--ctrl-h)] h-[var(--ctrl-h)] px-4"
        >
          <span className="app-text-label font-semibold">
            {t("filters")}
          </span>
          {activeCount > 0 && (
            <span className="size-5 rounded-full bg-background/20 app-text-caption font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
        <span className="app-text-caption text-muted-foreground">
          {activeCount > 0
            ? `${activeCount} ${t("filtersActive")}`
            : `${cats.length} ${t("categoryLabel")}`}
        </span>
      </div>

      {/* Desktop pill chips */}
      <div className="hidden space-y-4 sm:block">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 app-text-caption font-semibold uppercase tracking-[0.12em] text-primary">
              <Layers3 className="size-3.5" /> {t("categoryLabel")}
            </div>
            <p className="mt-1 app-text-body text-muted-foreground">
              {t("filtersHint")}
            </p>
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 app-text-label font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw className="size-3.5" aria-hidden /> {t("clearFilters")}
            </button>
          )}
        </div>

        <div role="group" aria-label={t("typeLabel")} className="flex items-center gap-2 overflow-x-auto p-1 no-scrollbar">
          <span className="me-1 shrink-0 app-text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("typeLabel")}
          </span>
          <Chip label={t("all")} active={type === ""} onClick={() => onType("")} id="type-all" Icon={Layers3} />
          <Chip label={t("rent")} active={type === "RENT"} onClick={() => onType("RENT")} id="type-rent" Icon={Home} />
          <Chip label={t("sale")} active={type === "SALE"} onClick={() => onType("SALE")} id="type-sale" Icon={Tag} />
        </div>

        <div role="group" aria-label={t("categoryLabel")} className="flex items-center gap-2 overflow-x-auto p-1 no-scrollbar">
          <Chip label={t("all")} active={categoryId === ""} onClick={() => onCategory("")} id="category-all" Icon={Layers3} />
          {cats.map((category) => {
            const Icon = categoryIcon(category.slug || category.name);
            return (
              <Chip
                key={category.id}
                label={category.name}
                count={categoryCount(category)}
                active={categoryId === String(category.id)}
                onClick={() => onCategory(String(category.id))}
                id={`category-${category.id}`}
                Icon={Icon}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom sheet for mobile */}
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={t("filters")}
      >
        <div className="p-[var(--space-card)] space-y-[var(--space-section)]">
          <div>
            <p id="m-filter-type" className="app-text-label font-semibold text-muted-foreground mb-3">
              {t("typeLabel")}
            </p>
            <div role="group" aria-labelledby="m-filter-type" className="flex flex-wrap gap-[var(--space-gap)]">
              <Chip label={t("all")} active={type === ""} onClick={() => onType("")} id="m-type-all" Icon={Layers3} />
              <Chip label={t("rent")} active={type === "RENT"} onClick={() => onType("RENT")} id="m-type-rent" Icon={Home} />
              <Chip label={t("sale")} active={type === "SALE"} onClick={() => onType("SALE")} id="m-type-sale" Icon={Tag} />
            </div>
          </div>
          <div>
            <p id="m-filter-category" className="app-text-label font-semibold text-muted-foreground mb-3">
              {t("categoryLabel")}
            </p>
            <div role="group" aria-labelledby="m-filter-category" className="flex flex-wrap gap-[var(--space-gap)] max-h-60 overflow-y-auto p-1">
              <Chip label={t("all")} active={categoryId === ""} onClick={() => onCategory("")} id="m-cat-all" Icon={Box} />
              {cats.map((category) => {
                const Icon = categoryIcon(category.slug || category.name);
                return (
                  <Chip
                    key={category.id}
                    label={category.name}
                    count={categoryCount(category)}
                    active={categoryId === String(category.id)}
                    onClick={() => onCategory(String(category.id))}
                    id={`m-cat-${category.id}`}
                    Icon={Icon}
                  />
                );
              })}
            </div>
          </div>
          <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-card/95 pt-3 backdrop-blur">
            {activeCount > 0 && (
              <Button variant="secondary" size="sm" onClick={clearFilters} className="flex-1">
                {t("clearFilters")}
              </Button>
            )}
            <Button variant="accent" size="sm" onClick={() => setOpen(false)} className="flex-1">
              {t("showResults")}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
