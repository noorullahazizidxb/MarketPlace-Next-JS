"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, LogOut, User2, LayoutGrid, Stars, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import { adminNavItems } from "@/components/admin-nav";
import { Sidebar } from "@/components/sidebar";

export function Topbar() {
  const { user, counts } = useAuth();
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const avatar = user?.avatarUrl || "/favicon.svg";
  const name = user?.fullName || user?.email || "You";

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
            {/* Mobile sidebar toggle (only visible on small screens) */}
            <button
              className="sm:hidden glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20"
              aria-label="Open menu"
              onClick={() => setDrawer(true)}
            >
              <Menu className="size-4" />
            </button>
            <Link
              href="/listings"
              className="text-sm subtle hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm subtle hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm subtle hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/my-listings"
              className="hidden sm:inline-flex text-sm subtle hover:text-foreground transition-colors"
            >
              My listings
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
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-medium line-clamp-1">
                      {user?.name || name}
                    </p>
                    <p className="text-xs subtle">{user?.email || ""}</p>
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
      <Sidebar
        isOpen={drawer}
        onClose={() => setDrawer(false)}
        showDesktop={false}
      />
    </header>
  );
}
