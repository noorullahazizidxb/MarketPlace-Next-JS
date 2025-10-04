"use client";
import { motion } from "framer-motion";
import { ThemeToggle } from "../../theme/theme-toggle";
import { SearchBox } from "./search-box";
import { Search, Menu, Bell as BellIcon } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useUIStore } from "@/store/ui.store";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useLanguage } from "@/components/providers/language-provider";

export function Navbar({ className = "" }: { className?: string }) {
  const mobileOpen = useUIStore((s) => s.mobileMenuOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const { roles } = useAuth();
  const canSeeMobileSidebar = roles.includes("ADMIN");
  const { t, locale } = useLanguage();

  return (
    <>
      <header
        className={`app-navbar liquid-glass glass-hover ${className}`}
        dir={locale === "fa" ? "rtl" : "ltr"}
      >
        <div className="container-padded h-16 grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden glass size-8 rounded-xl flex items-center justify-center font-bold transition-transform hover:-translate-y-0.5"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="size-8 rounded-xl glass hidden sm:flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-semibold">{t("marketplace")}</span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="hidden md:flex items-center gap-2">
              <SearchBox placeholder={t("search")} />
            </div>
            <LanguageDropdown className="hidden sm:inline-flex" />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
