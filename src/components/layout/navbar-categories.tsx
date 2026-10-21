"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useApiGet } from "@/lib/api-hooks";
import { categoryIcon } from "@/lib/category-icons";
import { rootCategories, type CategoryNode } from "@/lib/category-tree";
import { cn } from "@/lib/cn";

type Category = CategoryNode & { id: number; name: string; slug: string };

/**
 * Category quick-links for the "Full width" navbar variant: centered row along the bottom edge,
 * primary-token styling, one lucide icon per category. Links filter /listings by categoryId
 * (parent categories include their sub-categories).
 */
export function NavbarCategories() {
  const { data } = useApiGet<Category[]>(["categories"], "/categories");
  const pathname = usePathname();
  const search = useSearchParams();
  const activeId = pathname?.startsWith("/listings") ? search.get("categoryId") : null;
  const categories = rootCategories(Array.isArray(data) ? data : []);
  if (!categories.length) return null;

  return (
    <nav
      aria-label="Marketplace categories"
      className="mt-1 hidden md:flex justify-center border-t border-primary/20 px-[var(--space-page-x)] py-1.5"
    >
      <ul className="flex max-w-full items-center justify-center gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map((category) => {
          const Icon = categoryIcon(category.slug || category.name);
          const active = activeId === String(category.id);
          return (
            <li key={category.id} className="shrink-0">
              <Link
                href={`/listings?categoryId=${encodeURIComponent(String(category.id))}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 app-text-caption font-medium transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/25 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon className="size-3.5" aria-hidden />
                <span>{category.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
