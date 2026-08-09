"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Info,
  Phone,
  Bell,
  User2,
  User,
  LogIn,
  LayoutDashboard,
  Layers3,
  Megaphone,
  List,
  PlusCircle,
  X,
  Layers,
  Search,
  Palette,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { useLocalMutation } from "@/lib/api-hooks";
import { ThemeToggle } from "../../theme/theme-toggle";
import { SearchBox } from "@/components/ui/search-box";
import { NotificationsPanel } from "@/components/ui/notifications-panel";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/store/notifications.store";
import { asset } from "@/lib/assets";
import { useUIStore } from "@/store/ui.store";

/**
 * Bottom navigation item descriptor.
 */
export interface BottomNavDescriptor {
  key: string;
  label: string;
  href?: string; // If undefined, it's a toggle / action item
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  show?: (ctx: { isAuthed: boolean; isAdmin: boolean }) => boolean;
  onClick?: () => void; // Optional custom click
}

interface BottomNavigationProps {
  /** Optional explicit role flags (otherwise derived from useAuth) */
  isAdmin?: boolean;
  className?: string;
  /** Override default items (they'll still be filtered for adminOnly & show) */
  items?: BottomNavDescriptor[];
  /** When true forces the bar visible (ignores scroll hide) */
  forceVisible?: boolean;
}

/**
 * Individual navigation item component.
 * Handles active state, hover / tap animations, and accessibility.
 */
const BottomNavItem: React.FC<{
  item: BottomNavDescriptor;
  active: boolean;
  compactLabels: boolean;
  onNavigate: (href?: string, override?: () => void) => void;
  index: number;
}> = ({ item, active, compactLabels, onNavigate, index }) => {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      initial={{ y: 16, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        delay: 0.05 + index * 0.05,
        type: "spring",
        stiffness: 320,
        damping: 28,
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.92 }}
      aria-label={item.label}
      onClick={() => onNavigate(item.href, item.onClick)}
      className={
        "relative flex flex-col items-center hover:bg-foreground/5 justify-center gap-0.5 min-w-[40px] px-2 py-2 rounded-2xl app-text-caption font-medium transition-colors focus:outline-none focus-visible:ring-2 ring-primary/40 " +
        (active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground")
      }
    >
      <span
        className={
          "grid place-items-center relative size-9 rounded-xl transition-all shadow-token-lg " +
          (active
            ? "bg-gradient-to-br from-primary/30 via-primary/30 to-info/30 text-foreground ring-1 ring-primary/50"
            : "bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/35")
        }
      >
        <Icon className="size-4" />
        {active && (
          <motion.span
            layoutId="bottom-nav-active"
            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/25 to-transparent blur-4"
          />
        )}
      </span>
      <span
        className={
          "leading-none transition-all " +
          (active
            ? ""
            : " text-muted-foreground")
        }
      >
        {item.label}
      </span>
    </motion.button>
  );
};

/**
 * Drop-up menu for extended admin actions.
 */
interface CenterOverlayProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const CenterOverlay: React.FC<CenterOverlayProps> = ({
  open,
  onClose,
  title,
  children,
  className = "",
}) => {
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[850] flex items-center justify-center p-[var(--space-page-x)]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={
              "relative w-full max-w-md rounded-3xl bg-background/85 backdrop-blur-xl border border-border shadow-token-lg p-[var(--space-card)] flex flex-col gap-[var(--space-gap)] " +
              className
            }
          >
            <div className="flex items-center justify-between">
              <p className="app-text-body font-semibold tracking-wide">{title}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="size-8 p-0"
                aria-label={t("close")}
              >
                <X className="size-4" />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * BottomNavigation – a gorgeous animated mobile-only navigation bar.
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  isAdmin: isAdminProp,
  className = "",
  items: overrideItems,
  forceVisible,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, roles, counts } = useAuth();
  const { t } = useLanguage();
  const isAuthed = !!user;
  const isAdmin = isAdminProp ?? roles.includes("ADMIN");
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const density = useUIStore((s) => s.density);
  const toggleDensity = useUIStore((s) => s.toggleDensity);

  // Overlays state
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Navigation always visible now; scroll hide removed
  const visible = true;

  // Build role-specific nav sets
  const computedItems = useMemo<BottomNavDescriptor[]>(() => {
    if (isAdmin) {
      // Admin: Bottom nav limited to Home, About, Contact, Search, User Panel
      return [
        { key: "home", label: t("home"), href: "/listings", icon: Home },
        { key: "about", label: t("about"), href: "/about", icon: Info },
        { key: "contact", label: t("contact"), href: "/contact", icon: Phone },
        {
          key: "search",
          label: t("search"),
          icon: Search,
          onClick: () => setSearchOpen(true),
        },
        {
          key: "user",
          label: t("you"),
          icon: User2,
          onClick: () => setUserOpen(true),
        },
      ];
    }
    if (!isAuthed) {
      // Guest: Home, Blog, About, Contact, Search, User Panel (opens sign-in)
      return [
        { key: "home", label: t("home"), href: "/listings", icon: Home },
        { key: "blogs", label: t("blogs"), href: "/blogs", icon: Megaphone },
        { key: "about", label: t("about"), href: "/about", icon: Info },
        { key: "contact", label: t("contact"), href: "/contact", icon: Phone },
        {
          key: "search",
          label: t("search"),
          icon: Search,
          onClick: () => setSearchOpen(true),
        },
        {
          key: "user",
          label: t("you"),
          icon: User2,
          onClick: () => router.push("/sign-in"),
        },
      ];
    }
    // Normal authed user (non-admin): Home, Blog, About, Contact, Search, User Panel
    return [
      { key: "home", label: t("home"), href: "/listings", icon: Home },
      { key: "blogs", label: t("blogs"), href: "/blogs", icon: Megaphone },
      { key: "about", label: t("about"), href: "/about", icon: Info },
      { key: "contact", label: t("contact"), href: "/contact", icon: Phone },
      {
        key: "search",
        label: t("search"),
        icon: Search,
        onClick: () => setSearchOpen(true),
      },
      {
        key: "user",
        label: t("you"),
        icon: User2,
        onClick: () => setUserOpen(true),
      },
    ];
  }, [isAdmin, isAuthed, t, router]);

  const onNavigate = useCallback(
    (href?: string, override?: () => void) => {
      if (override) {
        override();
        return;
      }
      if (!href) return;
      if (href === pathname) return; // no-op if already there
      router.push(href);
    },
    [router, pathname]
  );

  const activeCheck = useCallback(
    (item: BottomNavDescriptor) => {
      if (!item.href) return false;
      // active if pathname starts with href (except root '/').
      if (item.href === "/") return pathname === "/";
      return (pathname || "").startsWith(item.href);
    },
    [pathname]
  );

  // Determine if labels should compact based on count
  const compactLabels = computedItems.length > 5;

  return (
    <>
      <AnimatePresence>
        {(forceVisible || visible) && (
          <motion.nav
            initial={
              prefersReducedMotion ? { opacity: 0 } : { y: 80, opacity: 0 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }
            }
            exit={prefersReducedMotion ? { opacity: 0 } : { y: 80, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 260, damping: 26 }
            }
            className={
              "md:hidden fixed bottom-3 left-0 right-0 z-[700] flex justify-center pointer-events-none " +
              className
            }
            aria-label={t("bottomNavigationAria")}
          >
            <div className="pointer-events-auto w-[min(94%,640px)] mx-auto relative">
              {/* Ambient blurred blob */}
              <div className="absolute -inset-6 -z-10">
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-[color-mix(in oklab, var(--primary) 25%, transparent)] via-[color-mix(in oklab, var(--secondary) 15%, transparent)] to-[color-mix(in oklab, var(--accent) 25%, transparent)] blur-2xl opacity-70" />
              </div>
              <motion.div
                layout
                className="group relative flex justify-around gap-1 rounded-[32px] px-2 py-2 glass border border-border bg-background/75 supports-[backdrop-filter]:bg-background/55 shadow-token-lg before:absolute before:inset-0 before:rounded-[32px] before:shadow-token-lg overflow-hidden"
              >
                {computedItems.map((item, i) => {
                  const active = activeCheck(item);
                  return (
                    <div key={item.key} className="relative">
                      <BottomNavItem
                        item={item}
                        active={active}
                        compactLabels={compactLabels}
                        onNavigate={onNavigate}
                        index={i}
                      />
                      {item.key === "notifications" && unreadCount > 0 && (
                        <span className="absolute top-0.5 right-2 min-w-[18px] h-5 px-1 rounded-full bg-accent/90 text-accent-foreground app-text-micro font-semibold grid place-items-center badge-pop">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* Notifications Panel (only non-admin uses panel; admin navigates) */}
      {isAuthed && (
        <NotificationsPanel
          isOpen={notifOpen}
          onClose={() => setNotifOpen(false)}
          fetchUrl="/notifications"
          anchor="center"
        />
      )}

      {/* Admin Quick Actions Bottom Sheet */}
      <BottomSheet
        open={adminOpen}
        onOpenChange={setAdminOpen}
        title={t("adminHub")}
        snapPoints={[0.5, 0.8, 1]}
        initialSnap={0}
      >
        <div className="pb-4">
          <AdminUserHeader user={user} />
        </div>
        <div className="grid grid-cols-3 gap-[var(--space-gap)]">
          {/* Requested admin quick actions */}
          <ActionTile
            icon={Bell}
            label={t("notifications")}
            onClick={() => setNotifOpen(true)}
          />
          <ActionTile
            icon={Megaphone}
            label={t("advertisements")}
            onClick={() => onNavigate("/admin/ads")}
          />
          <ActionTile
            icon={User}
            label={t("usersManagement")}
            onClick={() => onNavigate("/admin/users")}
          />
          <ActionTile
            icon={List}
            label={t("pendingLists")}
            onClick={() => onNavigate("/pendings")}
          />
          <ActionTile
            icon={PlusCircle}
            label={t("newListing")}
            onClick={() => onNavigate("/listings/create")}
          />
          <ActionTile
            icon={Settings}
            label={t("settings")}
            onClick={() => onNavigate("/settings")}
          />
          <ActionTile
            icon={Megaphone}
            label={t("stories")}
            onClick={() => onNavigate("/admin/stories")}
          />

          {/* Existing tiles (kept for convenience) */}
          <ActionTile
            icon={Layers3}
            label={t("listings")}
            onClick={() => onNavigate("/listings")}
          />
          <ActionTile
            icon={Layers}
            label={t("themes")}
            onClick={() => onNavigate("/settings/appearance")}
          />
          <ActionTile
            icon={User2}
            label={t("profile")}
            onClick={() => onNavigate("/profile")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label={t("dashboard")}
            onClick={() => onNavigate("/")}
          />
          <ActionTile
            icon={List}
            label={t("audit")}
            onClick={() => onNavigate("/profile/audit-logs")}
          />
          <ActionTile
            icon={Info}
            label={t("feedbacks")}
            onClick={() => onNavigate("/profile/feedbacks")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label={t("myListings")}
            onClick={() => onNavigate("/my-listings")}
          />
          <div className="flex flex-col gap-2 items-center justify-center">
            <ThemeToggle />
            <span className="app-text-micro subtle">{t("theme")}</span>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleDensity}
              className="size-10 p-0 app-text-micro"
            >
              {density === "comfort" ? "Co" : "Cm"}
            </Button>
            <span className="app-text-micro subtle">{t("density")}</span>
          </div>
        </div>
        <ButtonRowLogout onDone={() => setAdminOpen(false)} />
      </BottomSheet>

      {/* User Quick Actions Bottom Sheet */}
      <BottomSheet
        open={userOpen}
        onOpenChange={setUserOpen}
        title={t("quickMenu")}
        snapPoints={[0.45, 0.75]}
      >
        <div className="pb-4">
          <AdminUserHeader user={user} />
        </div>
        <div className="grid grid-cols-3 gap-[var(--space-gap)]">
          <ActionTile
            icon={Bell}
            label={t("notifications")}
            onClick={() => setNotifOpen(true)}
          />
          <ActionTile
            icon={User2}
            label={t("profile")}
            onClick={() => onNavigate("/profile")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label={t("myListings")}
            onClick={() => onNavigate("/my-listings")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label={t("approvedShort")}
            onClick={() => onNavigate("/profile/approved-listings")}
          />
          <ActionTile
            icon={List}
            label={t("audit")}
            onClick={() => onNavigate("/profile/audit-logs")}
          />
          <ActionTile
            icon={Info}
            label={t("feedbacks")}
            onClick={() => onNavigate("/profile/feedbacks")}
          />
          <div className="flex flex-col gap-2 items-center justify-center">
            <ThemeToggle />
            <span className="app-text-micro subtle">{t("theme")}</span>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleDensity}
              className="size-10 p-0 app-text-micro"
            >
              {density === "comfort" ? "Co" : "Cm"}
            </Button>
            <span className="app-text-micro subtle">{t("density")}</span>
          </div>
        </div>
        <ButtonRowLogout onDone={() => setUserOpen(false)} />
      </BottomSheet>

      {/* Search Bottom Sheet */}
      <BottomSheet
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title={t("search")}
        snapPoints={[1]}
        initialSnap={0}
      >
        <div className="flex flex-col h-full">
          <SearchBox
            placeholder={t("searchListingsPlaceholder")}
            className="w-full flex-1 min-h-0"
            onSubmitClose={() => setSearchOpen(false)}
            mode="sheet"
          />
          <p className="app-text-caption subtle mt-3 px-1">{t("searchIntro")}</p>
        </div>
      </BottomSheet>
      {/* Edge swipe opener area (left 24px) */}
      <div
        className="fixed inset-y-0 left-0 w-6 z-[650] md:hidden"
        onPointerDown={(e) => {
          if (e.pointerType === "touch") {
            if (isAdmin) setAdminOpen(true);
            else if (isAuthed) setUserOpen(true);
            try {
              navigator.vibrate?.(10);
            } catch { }
          }
        }}
        aria-hidden
      />
      {/* Scroll spacer (not strictly needed) */}
      <div className="h-10 md:hidden" aria-hidden />
    </>
  );
};

export default BottomNavigation;

// Supporting small components (kept at bottom to avoid clutter)

const AdminUserHeader: React.FC<{ user: any }> = ({ user }) => {
  const { t } = useLanguage();
  if (!user) {
    return null;
  }
  const avatar = asset(user?.photo) || "/favicon.svg";
  const name = user?.fullName || user?.name || user?.email || t("you");
  return (
    <div className="flex items-center gap-[var(--space-gap)] p-2 -mt-1">
      <div className="relative size-12 rounded-2xl overflow-hidden border border-border">
        <Image
          src={avatar}
          alt="avatar"
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="app-text-body font-semibold line-clamp-1">{name}</p>
        {user?.email && (
          <p className="app-text-caption subtle line-clamp-1">{user.email}</p>
        )}
      </div>
    </div>
  );
};

interface ActionTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}
const ActionTile: React.FC<ActionTileProps> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <motion.button
    initial={{ scale: 0.85, opacity: 0, y: 8 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-[var(--space-filter)] rounded-2xl bg-background/5 hover:bg-background/10 active:scale-95 transition-all"
  >
    <span className="size-10 grid place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/25 text-accent shadow-inner">
      <Icon className="size-5" />
    </span>
    <span className="app-text-caption font-medium text-center leading-tight line-clamp-2">
      {label}
    </span>
  </motion.button>
);

const ButtonRowLogout: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const { t } = useLanguage();
  const { mutateAsync, isPending } = useLocalMutation("post", "/api/logout");
  const handleLogout = async () => {
    try {
      await mutateAsync({} as any);
    } catch { }
    try {
      const { setCachedToken } = await import("@/lib/axiosClient");
      const { useAuthStore } = await import("@/store/auth.store");
      const { useListingsStore } = await import("@/store/listings.store");
      const { useNotificationsStore } = await import(
        "@/store/notifications.store"
      );
      setCachedToken(null);
      useAuthStore.getState().clear();
      useListingsStore.getState().clear();
      useNotificationsStore.getState().clear();
    } catch { }
    onDone?.();
    window.location.href = "/sign-in";
  };
  return (
    <div className="pt-2 flex justify-end">
      <Button
        type="button"
        variant="ghost"
        onClick={handleLogout}
        disabled={isPending}
        loading={isPending}
        className="text-destructive hover:text-destructive hover:bg-destructive/15"
        LeftIcon={LogOut}
      >
        {t("logout")}
      </Button>
    </div>
  );
};

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return prefers;
}
