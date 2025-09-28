"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Bell,
  LogOut,
  User2,
  LayoutGrid,
  Stars,
  Mail,
  Menu,
  Home,
  Info,
  Phone,
  List,
  X,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/search-box";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import { adminNavItems } from "@/components/admin-nav";
import { useUIStore } from "@/store/ui.store";
import { useNotificationsRealtime } from "@/lib/use-notifications-realtime";
import { useNotificationsStore } from "@/store/notifications.store";
import { NotificationsPanel } from "@/components/notifications-panel";
import { asset } from "@/lib/assets";

export function Topbar() {
  const { user, counts, roles } = useAuth();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const [notifOpen, setNotifOpen] = useState(false);
  useNotificationsRealtime(!!user);
  const [open, setOpen] = useState(false);
  const mobileMenu = useUIStore((s) => s.mobileMenuOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const avatar =
    (user as any)?.photo || (user as any)?.avatarUrl || "/favicon.svg";
  const name =
    (user as any)?.name || (user as any)?.fullName || user?.email || "You";
  const canSeeMobileSidebar = roles.includes("ADMIN");
  const pathname = usePathname();
  const isActive = (href: string) => (pathname || "").startsWith(href);
  const mobileMenuItems = useMemo(() => {
    const items = [
      { href: "/listings", label: "Home", Icon: Home },
      { href: "/about", label: "About", Icon: Info },
      { href: "/contact", label: "Contact", Icon: Phone },
    ];
    if (!user) {
      items.push({ href: "/sign-in", label: "Sign In", Icon: LogIn });
    }
    return items;
  }, [user]);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="app-navbar fixed top-1 left-0 right-0 z-[500] mx-4 sm:mx-8 lg:mx-14 xl:mx-24 rounded-2xl"
      >
        <div className="relative overflow-visible">
          <div className="absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_0%,#000_30%,transparent_80%)]">
            <div className="absolute -inset-x-20 -top-32 h-56 bg-gradient-to-r from-primary/30 via-fuchsia-500/20 to-cyan-400/30 blur-3xl" />
          </div>
          <div className="relative w-full rounded-2xl glass border border-[hsl(var(--border))] bg-[hsl(var(--background))]/85 supports-[backdrop-filter]:bg-[hsl(var(--background))]/70 shadow-[0_0_0_1px_hsl(var(--border))] before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_0_1px_hsl(var(--border)),inset_0_0_0_1px_rgba(0,0,0,0.15)]">
            <div className="container-padded h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center gap-2"
              >
                <ThemeToggle iconOnly className="hidden sm:grid" />
                <div className="size-9 rounded-2xl bg-gradient-to-br from-primary/80 to-fuchsia-500/60 text-background grid place-items-center font-bold shadow-[inset_0_-6px_20px_rgba(0,0,0,.2)]">
                  <Stars className="size-5" />
                </div>
                <span className="font-semibold tracking-tight">
                  Marketplace
                </span>
              </motion.div>
              <nav className="hidden sm:flex items-center justify-center gap-5">
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/listings"
                    className="relative text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full "
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
                    className="relative text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full "
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
                    className="relative text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full "
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

              <div className="flex items-center justify-end gap-2 pr-12 sm:pr-2">
                <div className="flex items-center gap-2 sm:hidden">
                  <SearchBox className="w-full" placeholder="Search" />
                </div>
                {/* Notifications */}
                {user && (
                  <>
                    <button
                      className="relative glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20"
                      aria-label="Toggle notifications"
                      onClick={() => {
                        try {
                          console.log(
                            "[notifications] bell clicked -> toggle panel"
                          );
                        } catch {}
                        setNotifOpen((v) => !v);
                      }}
                    >
                      <Bell className="size-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold grid place-items-center">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>
                    <NotificationsPanel
                      isOpen={notifOpen}
                      onClose={() => setNotifOpen(false)}
                      fetchUrl="/notifications"
                    />
                  </>
                )}
                <div className="hidden md:flex items-center gap-2">
                  <SearchBox placeholder="Search" />
                </div>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setOpen((v) => !v)}
                      className="relative glass rounded-2xl pl-2 pr-3 h-10 flex items-center gap-2 hover:ring-1 ring-white/20"
                    >
                      <Image
                        src={asset(avatar)}
                        alt="avatar"
                        width={24}
                        height={24}
                        className="rounded-xl"
                      />
                      <span className="hidden sm:block text-sm font-medium">
                        {name}
                      </span>
                      {counts?.listings > 0 && (
                        <span
                          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-5 px-1 rounded-full bg-red-600 text-white text-xs font-semibold"
                          aria-hidden
                        >
                          {counts.listings > 99 ? "99+" : counts.listings}
                        </span>
                      )}
                    </button>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-[calc(100%+8px)] z-1000 w-64 rounded-2xl overflow-hidden border border-[hsl(var(--card-border, var(--border)))] text-[hsl(var(--card-fg, var(--foreground)))] shadow-2xl"
                        style={{
                          backgroundColor: `hsl(var(--card-bg, var(--card)))`,
                        }}
                      >
                        <div className="p-3 border-b border-white/10 flex items-center gap-3">
                          <Image
                            src={asset(avatar)}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="rounded-xl"
                          />
                          <div>
                            <p className="text-sm font-medium line-clamp-1">
                              {(user as any)?.name || name}
                            </p>
                            <p className="text-xs subtle">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-3 h-11 rounded-xl "
                          >
                            <User2 className="size-4" />
                            <span className="text-sm">Profile</span>
                          </Link>
                          <Link
                            href="/my-listings"
                            className="flex items-center gap-3 px-3 h-11 rounded-xl "
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
                            href="/profile/approved-listings"
                            className="flex items-center gap-3 px-3 h-11 rounded-xl "
                          >
                            <LayoutGrid className="size-4" />
                            <span className="text-sm">Approved Listings</span>
                          </Link>
                          <Link
                            href="/profile/audit-logs"
                            className="flex items-center gap-3 px-3 h-11 rounded-xl "
                          >
                            <List className="size-4" />
                            <span className="text-sm">Audit Logs</span>
                          </Link>
                          <Link
                            href="/profile/feedbacks"
                            className="flex items-center gap-3 px-3 h-11 rounded-xl "
                          >
                            <Info className="size-4" />
                            <span className="text-sm">Feedbacks</span>
                          </Link>
                          {/* Roles, Sent Notifications and Notifications removed per request */}
                          <button
                            onClick={async () => {
                              try {
                                await fetch("/api/logout", { method: "POST" });
                              } catch {}
                              try {
                                const { setCachedToken } = await import(
                                  "@/lib/axiosClient"
                                );
                                const { useAuthStore } = await import(
                                  "@/store/auth.store"
                                );
                                const { useListingsStore } = await import(
                                  "@/store/listings.store"
                                );
                                const { useNotificationsStore } = await import(
                                  "@/store/notifications.store"
                                );
                                setCachedToken(null);
                                useAuthStore.getState().clear();
                                useListingsStore.getState().clear();
                                useNotificationsStore.getState().clear();
                              } catch {}
                              window.location.href = "/sign-in";
                            }}
                            className="flex w-full items-center gap-3 px-3 h-11 hover:bg-white/10 text-left"
                          >
                            <LogOut className="size-4" />
                            <span className="text-sm">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Desktop Sign In */}
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
                  </>
                )}
                <button
                  className="sm:hidden glass size-8 rounded-xl flex items-center justify-center font-bold transition-transform hover:-translate-y-0.5 absolute right-4 top-1/2 -translate-y-1/2 z-50"
                  aria-label="Open mobile menu"
                  onClick={toggleMobileMenu}
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
      </motion.header>
      {/* Spacer to offset fixed navbar height */}
      <div className="h-16" />
    </>
  );
}
