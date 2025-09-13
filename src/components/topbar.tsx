"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  LogOut,
  User2,
  LayoutGrid,
  Stars,
  Menu,
  Home,
  Info,
  Phone,
  List,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import { adminNavItems } from "@/components/admin-nav";
import { Sidebar } from "@/components/sidebar";

export function Topbar() {
  const { user, counts, roles } = useAuth();
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const avatar =
    (user as any)?.photo || (user as any)?.avatarUrl || "/favicon.svg";
  const name =
    (user as any)?.name || (user as any)?.fullName || user?.email || "You";
  const canSeeMobileSidebar = roles.includes("ADMIN");

  return (
    <header className="sticky top-0 z-50">
      <div className="relative overflow-visible">
        <div className="absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_0%,#000_30%,transparent_80%)]">
          <div className="absolute -inset-x-20 -top-32 h-56 bg-gradient-to-r from-primary/30 via-fuchsia-500/20 to-cyan-400/30 blur-3xl" />
        </div>
        <div className="container-padded h-16 flex items-center justify-between backdrop-blur-xl bg-background/70 border-b border-[hsl(var(--border))] rounded-b-2xl">
          <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center gap-2"
          >
            <div className="size-9 rounded-2xl bg-gradient-to-br from-primary/80 to-fuchsia-500/60 text-background grid place-items-center font-bold shadow-[inset_0_-6px_20px_rgba(0,0,0,.2)]">
              <Stars className="size-5" />
            </div>
            <span className="font-semibold tracking-tight">Marketplace</span>
          </motion.div>
          <nav className="flex items-center gap-4">
            {/* Admin sidebar toggle (only visible on small screens) */}
            {canSeeMobileSidebar && (
              <button
                className="sm:hidden glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20"
                aria-label="Open admin sidebar"
                onClick={() => setDrawer(true)}
              >
                <Menu className="size-4" />
              </button>
            )}

            {/* Mobile menu toggle (visible on small screens) */}
            <button
              className="sm:hidden glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20"
              aria-label="Open mobile menu"
              onClick={() => setMobileMenu((v) => !v)}
            >
              {mobileMenu ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>

            {/* Inline links: hidden on small screens */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/listings"
                className="text-sm subtle hover:text-foreground flex items-center gap-2"
              >
                <Home className="size-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/about"
                className="text-sm subtle hover:text-foreground flex items-center gap-2"
              >
                <Info className="size-4" />
                <span>About</span>
              </Link>
              <Link
                href="/contact"
                className="text-sm subtle hover:text-foreground flex items-center gap-2"
              >
                <Phone className="size-4" />
                <span>Contact</span>
              </Link>
              <Link
                href="/my-listings"
                className="hidden md:inline-flex text-sm subtle hover:text-foreground transition-colors items-center gap-2"
              >
                <List className="size-4" />
                <span>My listings</span>
              </Link>
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20"
              >
                <Bell className="size-4" />
                {!!counts?.notifications && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] text-white grid place-items-center border border-white/30">
                    {counts.notifications}
                  </span>
                )}
              </Link>
              <ThemeToggle />
            </div>

            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="relative glass rounded-2xl pl-2 pr-3 h-10 flex items-center gap-2 hover:ring-1 ring-white/20"
              >
                <Image
                  src={avatar}
                  alt="avatar"
                  width={24}
                  height={24}
                  className="rounded-xl"
                />
                <span className="hidden sm:block text-sm font-medium">
                  {name}
                </span>
              </button>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[calc(100%+8px)] z-[70] w-64 glass rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-2xl"
                >
                  <div className="p-3 border-b border-white/10 flex items-center gap-3">
                    <Image
                      src={avatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-xl"
                    />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">
                        {(user as any)?.name || name}
                      </p>
                      <p className="text-xs subtle">{user?.email || ""}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 h-11 hover:bg-white/10"
                    >
                      <User2 className="size-4" />
                      <span className="text-sm">Profile</span>
                    </Link>
                    <Link
                      href="/my-listings"
                      className="flex items-center gap-3 px-3 h-11 hover:bg-white/10"
                    >
                      <LayoutGrid className="size-4" />
                      <span className="text-sm">My listings</span>
                      {!!counts?.listings && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-white/10">
                          {counts.listings}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-3 px-3 h-11 hover:bg-white/10"
                    >
                      <Bell className="size-4" />
                      <span className="text-sm">Notifications</span>
                      {!!counts?.notifications && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded bg-white/10">
                          {counts.notifications}
                        </span>
                      )}
                    </Link>
                    <button className="flex w-full items-center gap-3 px-3 h-11 hover:bg-white/10 text-left">
                      <LogOut className="size-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </nav>
        </div>
      </div>
      {/* Mobile off-canvas sidebar using Sidebar component */}
      {canSeeMobileSidebar && (
        <Sidebar
          isOpen={drawer}
          onClose={() => setDrawer(false)}
          showDesktop={false}
        />
      )}

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="sm:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            key="topbar-mobile-overlay"
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
                <Link
                  href="/listings"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <Home className="size-5" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <Info className="size-5" />
                  <span>About</span>
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <Phone className="size-5" />
                  <span>Contact</span>
                </Link>
                <Link
                  href="/my-listings"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <List className="size-5" />
                  <span>My listings</span>
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                  onClick={() => setMobileMenu(false)}
                >
                  <Bell className="size-5" />
                  <span>Notifications</span>
                </Link>
                <div className="pt-2">
                  <ThemeToggle />
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
