"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  BriefcaseBusiness,
  Car,
  Check,
  Home,
  Laptop,
  Layers3,
  RotateCcw,
  Shirt,
  SlidersHorizontal,
  Tag,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useApiGet } from "@/lib/api-hooks";
import { cn } from "@/lib/cn";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

type Category = {
  id: number;
  name: string;
  slug: string;
  listings?: unknown[];
  _count?: { listings?: number };
  _counts?: { listings?: number };
};

function categoryIcon(slug: string) {
  const value = slug.toLowerCase();
  if (/car|auto|motor|vehicle/.test(value)) return Car;
  if (/home|house|property|estate|apartment|land/.test(value)) return Home;
  if (/electronic|phone|computer|tech/.test(value)) return Laptop;
  if (/fashion|cloth|apparel|shoe/.test(value)) return Shirt;
  if (/job|career|employment/.test(value)) return BriefcaseBusiness;
  if (/service|repair|maintenance/.test(value)) return Wrench;
  return Box;
}

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
      layout
      layoutId={undefined}
      key={id}
      whileTap={{ scale: 0.95 }}
      animate={{ opacity: 1 }}
      onClick={onClick}
      className={cn(
        "relative min-h-[var(--ctrl-h-sm)] shrink-0 overflow-hidden rounded-full border px-3.5 app-text-label font-medium inline-flex items-center gap-1.5 transition-all duration-200 select-none",
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
            {(t as any)("filters") || "Filters"}
          </span>
          {activeCount > 0 && (
            <span className="size-5 rounded-full bg-background/20 app-text-caption font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
        <span className="app-text-caption text-muted-foreground">
          {activeCount > 0
            ? `${activeCount} ${(t as any)("filtersActive") || "active"}`
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
              Narrow the marketplace by offer type and category.
            </p>
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 app-text-label font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3.5" /> Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="mr-1 shrink-0 app-text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t("typeLabel")}
          </span>
          <Chip label={t("all")} active={type === ""} onClick={() => onType("")} id="type-all" Icon={Layers3} />
          <Chip label={t("rent")} active={type === "RENT"} onClick={() => onType("RENT")} id="type-rent" Icon={Home} />
          <Chip label={t("sale")} active={type === "SALE"} onClick={() => onType("SALE")} id="type-sale" Icon={Tag} />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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
                Clear
              </Button>
            )}
            <Button variant="accent" size="sm" onClick={() => setOpen(false)} className="flex-1">
              Show results
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
