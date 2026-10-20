"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ThemeLogo } from "@/components/ui/atoms/theme-logo";
import { ThemeToggle } from "@/components/ui/molecules/theme-toggle";
import { SearchBox } from "@/components/ui/molecules/search-box";
import { Menu } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { LanguageDropdown } from "@/components/ui/molecules/language-dropdown";
import { useLanguage } from "@/components/providers/language-provider";
import { Tooltip } from "@/components/ui/molecules/tooltip";
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
            aria-label="DevMinds home"
          >
            <ThemeLogo
              priority
              alt="DevMinds Marketplace"
              className="h-12 sm:h-14 w-auto shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <div className="min-w-0 hidden xs:block sm:block">
              <span className="block font-semibold app-text-body sm:app-text-heading-sm tracking-tight truncate leading-tight">
                {t("marketplace")}
              </span>
              <span className="block app-text-caption text-muted-foreground truncate">
                DevMinds
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
