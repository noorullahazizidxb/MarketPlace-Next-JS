"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Home, Tag, SlidersHorizontal } from "lucide-react";
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

export function FiltersBar() {
  const { t } = useLanguage();
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const type = search.get("type") || ""; // "RENT" | "SALE" | ""
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

  const chip = (
    label: string,
    active: boolean,
    onClick: () => void,
    keyPrefix = "chip",
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ) => (
    <motion.button
      key={`${keyPrefix}-${label}`}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "px-3 h-9 rounded-xl border text-sm inline-flex items-center gap-2",
        active
          ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))/0.35] text-[hsl(var(--primary-foreground))]"
          : "bg-[hsl(var(--accent))] border-[hsl(var(--border))] text-[hsl(var(--accent-foreground))] hover:[background-color:hsl(var(--btn-accent-hover-bg,var(--primary)))] hover:[color:hsl(var(--btn-accent-hover-fg,var(--accent-foreground)))] focus:[background-color:hsl(var(--btn-accent-hover-bg,var(--primary)))]"
      )}
    >
      {Icon ? (
        <Icon className="size-4 text-[hsl(var(--muted-foreground))]" />
      ) : null}
      {label}
    </motion.button>
  );

  return (
    <>
      {/* Mobile trigger */}
      <div className="flex items-center gap-2 sm:hidden">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md active:scale-95"
        >
          <SlidersHorizontal className="size-4" />
          <span className="text-sm font-medium">
            {(t as any)("filters") || "Filters"}
          </span>
        </button>
        {type || categoryId ? (
          <span className="text-xs text-[hsl(var(--foreground))/0.65]">
            {(t as any)("filtersActive") || "Filters applied"}
          </span>
        ) : null}
      </div>

      {/* Desktop chips */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        <div className="mr-2 font-medium text-sm">{t("typeLabel")}</div>
        {chip(t("all"), type === "", () => onType(""), "type", Home)}
        {chip(t("rent"), type === "RENT", () => onType("RENT"), "type", Home)}
        {chip(t("sale"), type === "SALE", () => onType("SALE"), "type", Tag)}
        <div className="mx-3 h-6 w-px bg-white/10" />
        <div className="mr-2 font-medium text-sm">{t("categoryLabel")}</div>
        {chip(
          t("all"),
          categoryId === "",
          () => onCategory(""),
          "category",
          Box
        )}
        {cats.map((c) =>
          chip(
            c.name,
            categoryId === String(c.id),
            () => onCategory(String(c.id)),
            `category-${c.id}`,
            Box
          )
        )}
      </div>

      {/* Bottom sheet for mobile */}
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={(t as any)("filters") || "Filters"}
      >
        <div className="p-4 space-y-5">
          <div>
            <div className="text-sm font-semibold mb-2">{t("typeLabel")}</div>
            <div className="flex flex-wrap gap-2">
              {chip(t("all"), type === "", () => onType(""), "type", Home)}
              {chip(
                t("rent"),
                type === "RENT",
                () => onType("RENT"),
                "type",
                Home
              )}
              {chip(
                t("sale"),
                type === "SALE",
                () => onType("SALE"),
                "type",
                Tag
              )}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">
              {t("categoryLabel")}
            </div>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
              {chip(
                t("all"),
                categoryId === "",
                () => onCategory(""),
                "category",
                Box
              )}
              {cats.map((c) =>
                chip(
                  c.name,
                  categoryId === String(c.id),
                  () => onCategory(String(c.id)),
                  `category-${c.id}`,
                  Box
                )
              )}
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
