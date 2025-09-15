"use client";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Menu, Bell as BellIcon } from "lucide-react";
import { MobileMenu } from "@/components/mobile-menu";
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
            <div className="hidden md:flex items-center gap-2 glass rounded-2xl px-3 h-10 transition-colors hover:bg-white/15">
              <Search className="size-4 text-foreground/60" />
              <input
                className="bg-transparent outline-none text-sm"
                placeholder="Search"
              />
            </div>
            <a
              href="/notifications"
              aria-label="Notifications"
              className="relative glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20"
            >
              <BellIcon className="size-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobileMenu}
        items={[
          { href: "/", label: "Dashboard" },
          { href: "/listings", label: "Listings" },
          { href: "/listings/create", label: "New Listing" },
          { href: "/profile", label: "Profile" },
          { href: "/settings", label: "Settings" },
        ]}
      />
    </>
  );
}
