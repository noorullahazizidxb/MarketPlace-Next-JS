"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
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
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import { adminNavItems } from "@/components/admin-nav";
import { MobileMenu } from "@/components/mobile-menu";

export function Topbar() {
  const { user, counts, roles } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const avatar =
    (user as any)?.photo || (user as any)?.avatarUrl || "/favicon.svg";
  const name =
    (user as any)?.name || (user as any)?.fullName || user?.email || "You";
  const canSeeMobileSidebar = roles.includes("ADMIN");
  const pathname = usePathname();
  const isActive = (href: string) => (pathname || "").startsWith(href);

  return (
    <header className="app-navbar rounded-b-2xl">
      <div className="relative overflow-visible">
        <div className="absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_0%,#000_30%,transparent_80%)]">
          <div className="absolute -inset-x-20 -top-32 h-56 bg-gradient-to-r from-primary/30 via-fuchsia-500/20 to-cyan-400/30 blur-3xl" />
        </div>
        <div className="w-full rounded-b-2xl glass border border-[hsl(var(--border))]/60">
          <div className="container-padded h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-2"
            >
              <ThemeToggle iconOnly className="hidden sm:grid" />
              <div className="size-9 rounded-2xl bg-gradient-to-br from-primary/80 to-fuchsia-500/60 text-background grid place-items-center font-bold shadow-[inset_0_-6px_20px_rgba(0,0,0,.2)]">
                <Stars className="size-5" />
              </div>
              <span className="font-semibold tracking-tight">Marketplace</span>
            </motion.div>
            <nav className="hidden sm:flex items-center justify-center gap-5">
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/listings"
                  className="relative text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5"
                >
                  <Home className="size-4" />
                  <span>Home</span>
                  {isActive("/listings") && (
                    <motion.span
                      layoutId="top-underline"
                      className="absolute left-3 right-3 -bottom-1 h-0.5 rounded-full bg-[hsl(var(--accent))]"
                    />
                  )}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/about"
                  className="relative text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5"
                >
                  <Info className="size-4" />
                  <span>About</span>
                  {isActive("/about") && (
                    <motion.span
                      layoutId="top-underline"
                      className="absolute left-3 right-3 -bottom-1 h-0.5 rounded-full bg-[hsl(var(--accent))]"
                    />
                  )}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/contact"
                  className="relative text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5"
                >
                  <Phone className="size-4" />
                  <span>Contact</span>
                  {isActive("/contact") && (
                    <motion.span
                      layoutId="top-underline"
                      className="absolute left-3 right-3 -bottom-1 h-0.5 rounded-full bg-[hsl(var(--accent))]"
                    />
                  )}
                </Link>
              </motion.div>
              {/* My listings removed from top nav to avoid duplicate links (profile menu has it) */}
            </nav>

            <div className="flex items-center justify-end gap-2 pr-2">
              <div className="flex items-center gap-2 sm:hidden">
                <div className="glass rounded-2xl px-3 h-10 flex items-center gap-2">
                  <svg
                    className="size-4 text-foreground/60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    className="bg-transparent outline-none text-sm"
                    placeholder="Search"
                  />
                </div>
              </div>
              {/* Notifications removed; ThemeToggle moved to left */}
              <div className="hidden md:flex items-center gap-2 glass rounded-2xl px-3 h-10 transition-colors hover:bg-white/15">
                <svg
                  className="size-4 text-foreground/60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="bg-transparent outline-none text-sm"
                  placeholder="Search"
                />
              </div>
              {user ? (
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
              ) : (
                <div className="hidden sm:block">
                  <Button asChild variant="primary">
                    <Link
                      href="/sign-in"
                      className="flex items-center gap-2 px-3"
                    >
                      <LogIn className="size-4" />
                      <span>Sign In</span>
                    </Link>
                  </Button>
                </div>
              )}
              <button
                className="sm:hidden glass size-8 rounded-xl flex items-center justify-center font-bold transition-transform hover:-translate-y-0.5 ml-1 order-last"
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
        </div>
      </div>
      <MobileMenu
        isOpen={mobileMenu}
        onClose={() => setMobileMenu(false)}
        items={[
          { href: "/listings", label: "Home", Icon: Home },
          { href: "/about", label: "About", Icon: Info },
          { href: "/contact", label: "Contact", Icon: Phone },
        ]}
      />
    </header>
  );
}
