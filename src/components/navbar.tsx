"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Search,
  Menu,
  Home,
  Info,
  Phone,
  List,
  Bell as BellIcon,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/lib/use-auth";

export function Navbar() {
  const [drawer, setDrawer] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { roles } = useAuth();
  const canSeeMobileSidebar = roles.includes("ADMIN");

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-[hsl(var(--border))]">
        <div className="container-padded h-16 flex items-center justify-between">
          <div className="group flex items-center gap-3">
            {canSeeMobileSidebar && (
              <button
                className="sm:hidden glass size-8 rounded-xl flex items-center justify-center font-bold transition-transform hover:-translate-y-0.5"
                onClick={() => setDrawer(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            )}
            <div className="size-8 rounded-xl glass hidden sm:flex items-center justify-center font-bold transition-transform group-hover:-translate-y-0.5">
              M
            </div>
            <span className="font-semibold">Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 glass rounded-2xl px-3 h-10 transition-colors hover:bg-white/15">
              <Search className="size-4 text-foreground/60" />
              <input
                className="bg-transparent outline-none text-sm"
                placeholder="Search"
              />
            </div>
            <nav className="hidden sm:flex items-center gap-3">
              <a
                href="/listings"
                className="text-sm subtle hover:text-foreground flex items-center gap-2"
              >
                <Home className="size-4" />
                <span>Home</span>
              </a>
              <a
                href="/about"
                className="text-sm subtle hover:text-foreground flex items-center gap-2"
              >
                <Info className="size-4" />
                <span>About</span>
              </a>
              <a
                href="/contact"
                className="text-sm subtle hover:text-foreground flex items-center gap-2"
              >
                <Phone className="size-4" />
                <span>Contact</span>
              </a>
              <a
                href="/my-listings"
                className="hidden md:inline-flex text-sm subtle hover:text-foreground transition-colors items-center gap-2"
              >
                <List className="size-4" />
                <span>My listings</span>
              </a>
              <a
                href="/notifications"
                aria-label="Notifications"
                className="relative glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20"
              >
                <BellIcon className="size-4" />
              </a>
            </nav>
            <ThemeToggle />

            {/* Mobile menu button (non-admin mobile sidebar) */}
            <button
              className="sm:hidden glass size-8 rounded-xl flex items-center justify-center font-bold transition-transform hover:-translate-y-0.5 ml-1"
              aria-label="Open mobile menu"
              onClick={() => setMobileMenu((v) => !v)}
            >
              {mobileMenu ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>
      </header>
      {canSeeMobileSidebar && (
        <Sidebar
          isOpen={drawer}
          onClose={() => setDrawer(false)}
          showDesktop={false}
        />
      )}

      {/* Mobile slide-over menu for smaller screens (links with icons) */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="sm:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            key="mobile-overlay"
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenu(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />

            <motion.div
              className="absolute left-0 top-0 h-full w-80 bg-background/95 border-r border-[hsl(var(--border))] p-4"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-2xl bg-gradient-to-br from-primary/80 to-fuchsia-500/60 text-background grid place-items-center font-bold">
                    M
                  </div>
                  <span className="font-semibold">Marketplace</span>
                </div>
                <button
                  className="glass size-8 rounded-xl grid place-items-center"
                  onClick={() => setMobileMenu(false)}
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                <a
                  href="/listings"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <Home className="size-5" />
                  <span>Home</span>
                </a>
                <a
                  href="/about"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <Info className="size-5" />
                  <span>About</span>
                </a>
                <a
                  href="/contact"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <Phone className="size-5" />
                  <span>Contact</span>
                </a>
                <a
                  href="/my-listings"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <List className="size-5" />
                  <span>My listings</span>
                </a>
                <a
                  href="/notifications"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <BellIcon className="size-5" />
                  <span>Notifications</span>
                </a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
