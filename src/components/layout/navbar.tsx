"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../theme/theme-toggle";
import { SearchBox } from "../ui/search-box";
import { Menu } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useLanguage } from "@/components/providers/language-provider";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/atoms/shadcn/button";
import { cn } from "@/lib/cn";

export function Navbar({ className = "" }: { className?: string }) {
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const { t, locale } = useLanguage();

  return (
    <header
      className={cn(
        "app-navbar liquid-glass glass-hover m-0 border-b border-border/40",
        className,
      )}
      dir={locale === "fa" ? "rtl" : "ltr"}
      style={{ "--navbar-height": "4.5rem" } as CSSProperties}
    >
      <div className="container-padded h-[4.5rem] grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Tooltip content={t("menu" as any) || "Menu"} side="bottom">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="sm:hidden glass size-10 shrink-0"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </Tooltip>

          <Link
            href="/admin"
            className="flex items-center gap-3 min-w-0 group"
            aria-label="Dev Minds home"
          >
            <div className="size-14 sm:size-16 rounded-squircle overflow-hidden bg-white/95 shadow-sm ring-1 ring-border/40 flex shrink-0 transition-transform duration-200 group-hover:scale-[1.03]">
              <Image
                src="/logo/logo.png"
                alt="Dev Minds"
                width={64}
                height={64}
                sizes="64px"
                priority
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="min-w-0 hidden xs:block sm:block">
              <span className="block font-semibold text-base sm:text-lg tracking-tight truncate leading-tight">
                {t("marketplace")}
              </span>
              <span className="block text-xs text-muted-foreground truncate">
                Dev Minds
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div className="hidden md:flex items-center min-w-[14rem] lg:min-w-[18rem]">
            <Tooltip content={t("search")} side="bottom">
              <div className="w-full">
                <SearchBox placeholder={t("search")} />
              </div>
            </Tooltip>
          </div>
          <Tooltip content={t("language")} side="bottom">
            <LanguageDropdown className="hidden sm:inline-flex" />
          </Tooltip>
          <Tooltip
            content={t("toggleTheme" as any) || "Toggle theme"}
            side="bottom"
          >
            <ThemeToggle />
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
