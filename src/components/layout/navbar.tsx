"use client";
import Image from "next/image";
import { ThemeToggle } from "../../theme/theme-toggle";
import { SearchBox } from "../ui/search-box";
import { Menu } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useLanguage } from "@/components/providers/language-provider";
import { Tooltip } from "@/components/ui/tooltip";

export function Navbar({ className = "" }: { className?: string }) {
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const { t, locale } = useLanguage();

  return (
    <>
      <header
        className={`app-navbar liquid-glass glass-hover m-0 ${className}`}
        dir={locale === "fa" ? "rtl" : "ltr"}
      >
        <div className="container-padded h-16 grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="flex items-center gap-3">
            <Tooltip content={t("menu" as any) || "Menu"} side="bottom">
              <button
                className="sm:hidden glass size-8 rounded-xl flex items-center justify-center font-bold transition-transform hover:-translate-y-0.5"
                onClick={toggleMobileMenu}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </Tooltip>
            <div className="size-11 rounded-xl overflow-hidden bg-white shadow-sm hidden sm:flex shrink-0">
              <Image src="/logo/logo.png" alt="Dev Minds" width={44} height={44} sizes="44px" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold">{t("marketplace")}</span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Tooltip content={t("search")} side="bottom">
                <SearchBox placeholder={t("search")} />
              </Tooltip>
            </div>
            <Tooltip content={t("language")} side="bottom">
              <LanguageDropdown className="hidden sm:inline-flex" />
            </Tooltip>
            <Tooltip content={t("toggleTheme" as any) || "Toggle theme"} side="bottom">
              <ThemeToggle />
            </Tooltip>
          </div>
        </div>
      </header>
    </>
  );
}
