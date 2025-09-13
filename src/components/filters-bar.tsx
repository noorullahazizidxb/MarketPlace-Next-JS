"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
    router.push(`${pathname}?${q.toString()}`);
  };
  const onCategory = (id: string) => {
    const isSame = id === categoryId;
    const q = setParam(search, "categoryId", isSame ? null : id);
    q.delete("page");
    router.push(`${pathname}?${q.toString()}`);
  };

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <motion.button
      key={label}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "px-3 h-9 rounded-xl border text-sm",
        active
          ? "bg-primary/15 border-primary/40 text-foreground"
          : "glass border-white/10 hover:bg-white/10"
      )}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="mr-2 font-medium text-sm">Type:</div>
      {chip("All", type === "", () => onType(""))}
      {chip("Rent", type === "RENT", () => onType("RENT"))}
      {chip("Sale", type === "SALE", () => onType("SALE"))}
      <div className="mx-3 h-6 w-px bg-white/10" />
      <div className="mr-2 font-medium text-sm">Category:</div>
      {chip("All", categoryId === "", () => onCategory(""))}
      {cats
        .slice(0, 10)
        .map((c) =>
          chip(c.name, categoryId === String(c.id), () =>
            onCategory(String(c.id))
          )
        )}
    </div>
  );
}
