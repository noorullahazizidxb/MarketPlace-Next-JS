"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Home, Tag } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useApiGet } from "@/lib/api-hooks";
import { cn } from "@/lib/cn";

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
          ? "bg-primary/15 border-primary/40 text-foreground"
          : "glass border-white/10 hover:bg-white/10"
      )}
    >
      {Icon ? (
        <Icon className="size-4 text-[hsl(var(--muted-foreground))]" />
      ) : null}
      {label}
    </motion.button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="mr-2 font-medium text-sm">{t("typeLabel")}</div>
      {chip(t("all"), type === "", () => onType(""), "type", Home)}
      {chip(t("rent"), type === "RENT", () => onType("RENT"), "type", Home)}
      {chip(t("sale"), type === "SALE", () => onType("SALE"), "type", Tag)}
      <div className="mx-3 h-6 w-px bg-white/10" />
      <div className="mr-2 font-medium text-sm">{t("categoryLabel")}</div>
      {chip(t("all"), categoryId === "", () => onCategory(""), "category", Box)}
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
  );
}
