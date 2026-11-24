"use client";

import Image from "next/image";
import { ThemeLogo } from "@/components/ui/atoms/theme-logo";
import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { NavbarCategories } from "@/components/layout/navbar-categories";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/shadcn/dropdown-menu";
import { hoverLift, spring, tapPress } from "@/lib/motion";
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

const NAV_ITEMS = [
  { href: "/listings", labelKey: "home", Icon: Home },
  { href: "/blogs", labelKey: "blogs", Icon: Newspaper },
  { href: "/about", labelKey: "about", Icon: Info },
  { href: "/contact", labelKey: "contact", Icon: Phone },
] as const;

const ACCOUNT_ITEM_CLASS =
  "flex min-h-10 cursor-pointer items-center gap-[var(--space-gap)] rounded-xl px-3";

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
        <div className="modern-navbar-pill relative overflow-visible">
          <div
            className="relative w-full liquid-glass liquid-glass--borderless"
          >
            <div className="modern-navbar-grid">
              <div className="flex items-center gap-[var(--space-gap)]">
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
              </div>
              <nav className="app-nav-tray hidden items-center justify-center gap-[var(--space-gap)] lg:flex">
                {NAV_ITEMS.map(({ href, labelKey, Icon }) => {
                  const active = isActive(href);
                  return (
                    <motion.div key={href} whileHover={hoverLift} whileTap={tapPress}>
                      <Tooltip content={t(labelKey)} side="bottom">
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={`app-nav-link ${active ? "is-active" : ""}`}
                        >
                          <Icon className="size-4" aria-hidden />
                          <span>{t(labelKey)}</span>
                          {active && <ActiveNavUnderline />}
                        </Link>
                      </Tooltip>
                    </motion.div>
                  );
                })}
                {/* My listings removed from top nav to avoid duplicate links (profile menu has it) */}
              </nav>

              <div className="flex items-center justify-end gap-[var(--space-gap)]">
                {/* Notifications */}
                {user && !preview && (
                  <>
                    <Tooltip
                      content={
                        unreadCount > 0
                          ? `${unreadCount} ${t("notifications")}`
                          : t("notifications")
                      }
                      side="bottom"
                    >
                      <button
                        type="button"
                        className="relative glass size-10 rounded-xl grid place-items-center hover:ring-1 ring-ring/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={unreadCount > 0 ? `${t("notifications")} (${unreadCount})` : t("notifications")}
                        aria-expanded={notifOpen}
                        onClick={() => setNotifOpen((v) => !v)}
                      >
                        <Bell className="size-4" aria-hidden />
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
                  <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={t("accountMenu")}
                        className="relative glass rounded-2xl ps-2 pe-3 h-[var(--ctrl-h)] min-h-10 flex items-center gap-[var(--space-gap)] hover:ring-1 ring-ring/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Image
                          src={asset(avatar)}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-xl"
                        />
                        <span className="hidden sm:block app-text-body font-medium">
                          {name}
                        </span>
                        {counts?.listings > 0 && (
                          <span
                            className="absolute -top-1 -end-1 flex items-center justify-center min-w-[18px] h-5 px-1 rounded-full bg-destructive text-destructive-foreground app-text-caption font-semibold"
                            aria-hidden
                          >
                            {counts.listings > 99 ? "99+" : counts.listings}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="z-[1000] w-64 rounded-2xl border-border bg-card p-0 text-card-foreground shadow-2xl"
                    >
                      <DropdownMenuLabel className="flex items-center gap-[var(--space-gap)] border-b border-border/40 p-[var(--space-filter)] font-normal">
                        <Image
                          src={asset(avatar)}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-xl"
                        />
                        <span className="min-w-0">
                          <span className="block app-text-body font-medium line-clamp-1">
                            {name}
                          </span>
                          <span className="block app-text-caption subtle truncate">
                            {user?.email || ""}
                          </span>
                        </span>
                      </DropdownMenuLabel>
                      <div className="p-1">
                        <DropdownMenuItem asChild className={ACCOUNT_ITEM_CLASS}>
                          <Link href="/profile">
                            <User2 className="size-4" aria-hidden />
                            <span className="app-text-body">{t("profile")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className={ACCOUNT_ITEM_CLASS}>
                          <Link href="/my-listings">
                            <LayoutGrid className="size-4" aria-hidden />
                            <span className="app-text-body">{t("myListings")}</span>
                            {!!counts?.listings && (
                              <span className="ms-auto app-text-caption px-2 py-0.5 rounded-md bg-muted tabular-nums">
                                {counts.listings}
                              </span>
                            )}
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem asChild className={ACCOUNT_ITEM_CLASS}>
                            <Link href="/admin">
                              <ShieldCheck className="size-4" aria-hidden />
                              <span className="app-text-body">{t("admin")}</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <LogoutItem />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
        </div>
      </header>
    </>
  );
}

/** Animated underline for the active top-nav item; uses the accent design token in light & dark themes. */
function ActiveNavUnderline() {
  return (
    <motion.span
      layoutId="top-underline"
      transition={spring.indicator}
      aria-hidden
      className="absolute left-3 right-3 -bottom-1 h-0.5 rounded-full bg-accent"
    />
  );
}

function LogoutItem() {
  const { t } = useLanguage();
  const { signOut, isPending } = useSignOut();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onSelect={(event) => {
        event.preventDefault();
        void signOut();
      }}
      className={ACCOUNT_ITEM_CLASS}
    >
      {isPending ? (
        <span className="size-4 rounded-full border-2 border-border border-t-current animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-4" aria-hidden />
      )}
      <span className="app-text-body">{t("logout")}</span>
    </DropdownMenuItem>
  );
}
