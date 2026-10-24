"use client";

import Image from "next/image";
import { ThemeLogo } from "@/components/ui/atoms/theme-logo";
import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { NavbarCategories } from "@/components/layout/navbar-categories";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Bell,
  LogOut,
  User2,
  LayoutGrid,
  Home,
  Info,
  Phone,
  LogIn,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/molecules/button";
import { useSignOut } from "@/lib/auth/use-sign-out";
import { SearchBox } from "@/components/ui/molecules/search-box";
import { ThemeToggle } from "@/components/ui/molecules/theme-toggle";
import { useAuth } from "@/lib/use-auth";
import Link from "next/link";
import { useNotificationsRealtime } from "@/lib/use-notifications-realtime";
import { Tooltip } from "@/components/ui/molecules/tooltip";
import { useNotificationsStore } from "@/store/notifications.store";
import { NotificationsPanel } from "@/components/ui/organisms/notifications-panel";
import { asset } from "@/lib/assets";
import { LanguageDropdown } from "@/components/ui/molecules/language-dropdown";
import { useLanguage } from "@/components/providers/language-provider";
import { useComponentVariants } from "@/hooks/use-component-variants";
import type { NavbarVariant } from "@/lib/theme/types";
import { DEFAULT_NAVBAR_OPACITY } from "@/store/component-variants.store";

export function Topbar({
  variantOverride,
  opacityOverride,
  preview = false,
}: {
  variantOverride?: NavbarVariant;
  /** Glass tint 0–100 used instead of the saved value (settings previews). */
  opacityOverride?: number;
  preview?: boolean;
}) {
  const { user, counts, isAdmin } = useAuth();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const { t, locale, isRtl } = useLanguage();
  const { variants } = useComponentVariants();
  const navbarVariant = variantOverride ?? variants.navbar;
  const glassAlpha =
    opacityOverride ??
    variants.navbarOpacity?.[navbarVariant] ??
    DEFAULT_NAVBAR_OPACITY[navbarVariant] ??
    80;
  const [notifOpen, setNotifOpen] = useState(false);
  useNotificationsRealtime(!!user && !preview);
  const [open, setOpen] = useState(false);
  const avatar =
    (user as any)?.photo || (user as any)?.avatarUrl || "/favicon.svg";
  const name =
    (user as any)?.name || (user as any)?.fullName || user?.email || "You";
  const pathname = usePathname();
  const isActive = (href: string) => (pathname || "").startsWith(href);

  // Keep the page offset equal to the real bar height (it differs per variant / wraps / density),
  // so content never sits under the bar or leaves a blank strip above it.
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el || preview || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const sync = () => root.style.setProperty("--modern-navbar-offset", `${Math.ceil(el.getBoundingClientRect().height)}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--modern-navbar-offset");
    };
  }, [preview, navbarVariant]);

  return (
    <>
      <header
        ref={headerRef}
        className={`modern-navbar nav-v-${navbarVariant}`}
        data-navbar-variant={navbarVariant}
        style={{ "--nav-glass-alpha": glassAlpha } as CSSProperties}
        dir={locale === "fa" ? "rtl" : "ltr"}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="modern-navbar-pill relative overflow-visible"
        >
          <div
            className="relative w-full liquid-glass liquid-glass--borderless"
          >
            <div className="modern-navbar-grid">
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center gap-[var(--space-gap)]"
              >
                {navbarVariant === "fullwidth" && (
                  <Tooltip
                    content={t("toggleTheme" as any) || "Toggle theme"}
                    side="bottom"
                  >
                    <ThemeToggle iconOnly className="hidden sm:grid" />
                  </Tooltip>
                )}
                <ThemeLogo alt="DevMinds Marketplace" className="h-10 w-auto shrink-0" />
                <span className="font-semibold tracking-tight">
                  {t("marketplace")}
                </span>
              </motion.div>
              <nav className="app-nav-tray hidden items-center justify-center gap-[var(--space-gap)] lg:flex">
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Tooltip content={t("home")} side="bottom">
                    <Link
                      href="/listings"
                      className={`app-nav-link ${isActive("/listings") ? "is-active" : ""}`}
                    >
                      <Home className="size-4" />
                      <span>{t("home")}</span>
                      {isActive("/listings") && (
                        <ActiveNavUnderline />
                      )}
                    </Link>
                  </Tooltip>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Tooltip content={t("blogs")} side="bottom">
                    <Link
                      href="/blogs"
                      className={`app-nav-link ${isActive("/blogs") ? "is-active" : ""}`}
                    >
                      <Newspaper className="size-4" />
                      <span>{t("blogs")}</span>
                      {isActive("/blogs") && (
                        <ActiveNavUnderline />
                      )}
                    </Link>
                  </Tooltip>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Tooltip content={t("about")} side="bottom">
                    <Link
                      href="/about"
                      className={`app-nav-link ${isActive("/about") ? "is-active" : ""}`}
                    >
                      <Info className="size-4" />
                      <span>{t("about")}</span>
                      {isActive("/about") && (
                        <ActiveNavUnderline />
                      )}
                    </Link>
                  </Tooltip>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Tooltip content={t("contact")} side="bottom">
                    <Link
                      href="/contact"
                      className={`app-nav-link ${isActive("/contact") ? "is-active" : ""}`}
                    >
                      <Phone className="size-4" />
                      <span>{t("contact")}</span>
                      {isActive("/contact") && (
                        <ActiveNavUnderline />
                      )}
                    </Link>
                  </Tooltip>
                </motion.div>
                {/* My listings removed from top nav to avoid duplicate links (profile menu has it) */}
              </nav>

              <div className="flex items-center justify-end gap-[var(--space-gap)]">
                {/* Notifications */}
                {user && !preview && (
                  <>
                    <Tooltip
                      content={
                        unreadCount > 0
                          ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                          : "Notifications"
                      }
                      side="bottom"
                    >
                      <button
                        className="relative glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-ring/30"
                        aria-label="Toggle notifications"
                        onClick={() => {
                          try {
                            console.log(
                              "[notifications] bell clicked -> toggle panel",
                            );
                          } catch {}
                          setNotifOpen((v) => !v);
                        }}
                      >
                        <Bell className="size-4" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 rounded-full bg-destructive text-destructive-foreground app-text-micro font-semibold grid place-items-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </button>
                    </Tooltip>
                    <NotificationsPanel
                      isOpen={notifOpen}
                      onClose={() => setNotifOpen(false)}
                      fetchUrl="/notifications"
                      anchor={isRtl ? "top-left" : "top-right"}
                    />
                  </>
                )}
                <div className="hidden md:flex items-center gap-[var(--space-gap)]">
                  <Tooltip content={t("search")} side="bottom">
                    <SearchBox placeholder={t("search")} />
                  </Tooltip>
                </div>
                {preview ? (
                  <Link
                    href="/sign-in"
                    className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 app-text-caption font-medium"
                  >
                    Sign In
                  </Link>
                ) : user ? (
                  <div className="relative">
                    <button
                      onClick={() => setOpen((v) => !v)}
                      className="relative glass rounded-2xl pl-2 pr-3 h-[var(--ctrl-h)] min-h-[var(--ctrl-h)] flex items-center gap-[var(--space-gap)] hover:ring-1 ring-ring/30"
                    >
                      <Image
                        src={asset(avatar)}
                        alt="avatar"
                        width={24}
                        height={24}
                        className="rounded-xl"
                      />
                      <span className="hidden sm:block app-text-body font-medium">
                        {name}
                      </span>
                      {counts?.listings > 0 && (
                        <span
                          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-5 px-1 rounded-full bg-destructive text-destructive-foreground app-text-caption font-semibold"
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
                        className="absolute right-0 top-[calc(100%+8px)] z-1000 w-64 rounded-2xl overflow-hidden border border-border bg-card text-card-foreground shadow-2xl"
                      >
                        <div className="p-[var(--space-filter)] border-b border-border/40 flex items-center gap-[var(--space-gap)]">
                          <Image
                            src={asset(avatar)}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="rounded-xl"
                          />
                          <div>
                            <p className="app-text-body font-medium line-clamp-1">
                              {(user as any)?.name || name}
                            </p>
                            <p className="app-text-caption subtle">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] rounded-xl"
                          >
                            <User2 className="size-4" />
                            <span className="app-text-body">
                              {t("profile")}
                            </span>
                          </Link>
                          <Link
                            href="/my-listings"
                            className="flex items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] rounded-xl"
                          >
                            <LayoutGrid className="size-4" />
                            <span className="app-text-body">
                              {t("myListings")}
                            </span>
                            {!!counts?.listings && (
                              <span className="ml-auto app-text-caption px-2 py-0.5 rounded bg-background/10">
                                {counts.listings}
                              </span>
                            )}
                          </Link>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] rounded-xl"
                            >
                              <ShieldCheck className="size-4" />
                              <span className="app-text-body">
                                Admin
                              </span>
                            </Link>
                          )}
                          <LogoutButton />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Desktop Sign In */}
                    <div className="hidden sm:block">
                      <Tooltip content={t("signIn")} side="bottom">
                        <Button asChild variant="primary">
                          <Link
                            href="/sign-in"
                            className="flex items-center gap-2 px-3"
                          >
                            <LogIn className="size-4" />
                            <span>{t("signIn")}</span>
                          </Link>
                        </Button>
                      </Tooltip>
                    </div>
                  </>
                )}
                <Tooltip content={t("language")} side="bottom">
                  <LanguageDropdown className="hidden sm:inline-flex" />
                </Tooltip>
                {navbarVariant !== "fullwidth" && (
                  <Tooltip content={t("toggleTheme" as any) || "Toggle theme"} side="bottom">
                    <ThemeToggle iconOnly className="app-nav-theme hidden sm:grid" />
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
          {/* Every navbar variant carries the marketplace category strip. */}
          <Suspense fallback={null}>
            <NavbarCategories />
          </Suspense>
        </motion.div>
      </header>
    </>
  );
}

/** Animated underline for the active top-nav item; uses the primary design token in light & dark themes. */
function ActiveNavUnderline() {
  return (
    <motion.span
      layoutId="top-underline"
      aria-hidden
      className="absolute left-3 right-3 -bottom-1 h-0.5 rounded-full bg-primary"
    />
  );
}

function LogoutButton() {
  const { t } = useLanguage();
  const { signOut, isPending } = useSignOut();
  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isPending}
      className="flex w-full items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] hover:bg-background/10 text-left"
    >
      {isPending ? (
        <span className="size-4 rounded-full border-2 border-border border-t-white animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      <span className="app-text-body">{t("logout")}</span>
    </button>
  );
}
