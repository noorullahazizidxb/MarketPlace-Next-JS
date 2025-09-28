"use client";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBox } from "@/components/search-box";
import { Search, Menu, Bell as BellIcon } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useUIStore } from "@/store/ui.store";

export function Navbar() {
  const mobileOpen = useUIStore((s) => s.mobileMenuOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const { roles } = useAuth();
  const canSeeMobileSidebar = roles.includes("ADMIN");

  return (
    <>
      <header className="app-navbar">
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
            <span className="font-semibold">Marketplace</span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="hidden md:flex items-center gap-2">
              <SearchBox placeholder="Search" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
