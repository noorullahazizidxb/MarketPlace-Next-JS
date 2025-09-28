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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBox } from "@/components/search-box";
import { NotificationsPanel } from "@/components/notifications-panel";
import { useNotificationsStore } from "@/store/notifications.store";
import { asset } from "@/lib/assets";

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
        "relative flex flex-col items-center hover:bg-[var(--foreground)] justify-center gap-1 min-w-[58px] px-2 py-1.5 rounded-2xl text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 ring-primary/40 " +
        (active
          ? "text-[var(--foreground)]"
          : "text-[hsl(var(--muted-foreground,var(--foreground)))] hover:text-[hsl(var(--foreground))]")
      }
    >
      <span
        className={
          "grid place-items-center relative size-9 rounded-xl transition-all shadow-[inset_0_0_0_1px_hsl(var(--border)),0_4px_12px_-3px_rgba(0,0,0,0.35)] " +
          (active
            ? "bg-gradient-to-br from-primary/30 via-fuchsia-500/30 to-cyan-500/30 text-[hsl(var(--accent))] ring-1 ring-primary/50"
            : "bg-[hsl(var(--background))]/50 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/35")
        }
      >
        <Icon className="size-4" />
        {active && (
          <motion.span
            layoutId="bottom-nav-active"
            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/25 to-transparent"
            style={{ filter: "blur(4px)" }}
          />
        )}
      </span>
      <span
        className={
          "leading-none transition-all " +
          (compactLabels ? "max-[390px]:sr-only" : "") +
          (active
            ? ""
            : " text-[hsl(var(--muted-foreground,var(--foreground)))]")
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
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[850] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className={
            "relative w-full max-w-md rounded-3xl bg-[hsl(var(--background))]/85 backdrop-blur-xl border border-[hsl(var(--border))] shadow-[0_8px_50px_-10px_rgba(0,0,0,0.55),0_0_0_1px_hsl(var(--border))] p-5 flex flex-col gap-4 " +
            className
          }
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold tracking-wide">{title}</p>
            <button
              onClick={onClose}
              className="size-8 rounded-xl bg-white/5 hover:bg-white/10 grid place-items-center"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

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
  const isAuthed = !!user;
  const isAdmin = isAdminProp ?? roles.includes("ADMIN");
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  // Overlays state
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Navigation always visible now; scroll hide removed
  const visible = true;

  // Build role-specific nav sets
  const computedItems = useMemo<BottomNavDescriptor[]>(() => {
    if (isAdmin) {
      return [
        { key: "home", label: "Home", href: "/listings", icon: Home },
        {
          key: "search",
          label: "Search",
          icon: Search,
          onClick: () => setSearchOpen(true),
        },
        { key: "pendings", label: "Pendings", href: "/pendings", icon: List },
        {
          key: "create",
          label: "Create",
          href: "/listings/create",
          icon: PlusCircle,
        },
        {
          key: "admin",
          label: "Admin",
          icon: LayoutDashboard,
          onClick: () => setAdminOpen(true),
        },
        {
          key: "notifications",
          label: "Alerts",
          href: "/admin/notifications",
          icon: Bell,
        },
        { key: "ads", label: "Ads", href: "/admin/ads", icon: Megaphone },
      ];
    }
    if (!isAuthed) {
      return [
        { key: "home", label: "Home", href: "/listings", icon: Home },
        { key: "about", label: "About", href: "/about", icon: Info },
        {
          key: "search",
          label: "Search",
          icon: Search,
          onClick: () => setSearchOpen(true),
        },
        { key: "contact", label: "Contact", href: "/contact", icon: Phone },
        {
          key: "theme",
          label: "Theme",
          icon: Palette,
          onClick: () => setSearchOpen(false),
        },
        { key: "sign-in", label: "Sign In", href: "/sign-in", icon: LogIn },
      ];
    }
    // Normal authed user (non-admin)
    return [
      { key: "home", label: "Home", href: "/listings", icon: Home },
      { key: "about", label: "About", href: "/about", icon: Info },
      {
        key: "search",
        label: "Search",
        icon: Search,
        onClick: () => setSearchOpen(true),
      },
      {
        key: "create",
        label: "Create",
        href: "/listings/create",
        icon: PlusCircle,
      },
      { key: "contact", label: "Contact", href: "/contact", icon: Phone },
      {
        key: "user",
        label: "You",
        icon: User2,
        onClick: () => setUserOpen(true),
      },
      {
        key: "notifications",
        label: "Alerts",
        icon: Bell,
        onClick: () => setNotifOpen((v) => !v),
      },
    ];
  }, [isAdmin, isAuthed]);

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
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={
              "md:hidden fixed bottom-3 left-0 right-0 z-[700] flex justify-center pointer-events-none " +
              className
            }
            aria-label="Bottom navigation"
          >
            <div className="pointer-events-auto w-[min(94%,640px)] mx-auto relative">
              {/* Ambient blurred blob */}
              <div className="absolute -inset-6 -z-10">
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-primary/25 via-fuchsia-500/15 to-cyan-400/25 blur-2xl opacity-70" />
              </div>
              <motion.div
                layout
                className="group relative flex justify-around gap-1 rounded-[32px] px-2 py-2 glass border border-[hsl(var(--border))] bg-[hsl(var(--background))]/75 supports-[backdrop-filter]:bg-[hsl(var(--background))]/55 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.4),0_12px_40px_-8px_rgba(0,0,0,0.55),0_0_0_1px_hsl(var(--border))] before:absolute before:inset-0 before:rounded-[32px] before:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(0,0,0,0.35)] overflow-hidden"
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
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold grid place-items-center">
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
      {isAuthed && !isAdmin && (
        <NotificationsPanel
          isOpen={notifOpen}
          onClose={() => setNotifOpen(false)}
          fetchUrl="/notifications"
          anchor="bottom-center"
        />
      )}

      {/* Admin Quick Actions Centered */}
      <CenterOverlay
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        title="Admin Hub"
      >
        <AdminUserHeader user={user} />
        <div className="grid grid-cols-3 gap-4 mt-2">
          <ActionTile
            icon={Layers3}
            label="Listings"
            onClick={() => onNavigate("/listings")}
          />
          <ActionTile
            icon={List}
            label="Pendings"
            onClick={() => onNavigate("/pendings")}
          />
          <ActionTile
            icon={PlusCircle}
            label="Create"
            onClick={() => onNavigate("/listings/create")}
          />
          <ActionTile
            icon={Megaphone}
            label="Ads"
            onClick={() => onNavigate("/admin/ads")}
          />
          <ActionTile
            icon={Layers}
            label="Themes"
            onClick={() => onNavigate("/settings/themes")}
          />
          <ActionTile
            icon={User2}
            label="Profile"
            onClick={() => onNavigate("/profile")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label="Dashboard"
            onClick={() => onNavigate("/")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label="Approved"
            onClick={() => onNavigate("/profile/approved-listings")}
          />
          <ActionTile
            icon={List}
            label="Audit"
            onClick={() => onNavigate("/profile/audit-logs")}
          />
          <ActionTile
            icon={Info}
            label="Feedbacks"
            onClick={() => onNavigate("/profile/feedbacks")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label="My Listings"
            onClick={() => onNavigate("/my-listings")}
          />
          <div className="flex flex-col gap-2 items-center justify-center">
            <ThemeToggle />
            <span className="text-[10px] subtle">Theme</span>
          </div>
        </div>
        <ButtonRowLogout onDone={() => setAdminOpen(false)} />
      </CenterOverlay>

      {/* User Quick Actions */}
      <CenterOverlay
        open={userOpen}
        onClose={() => setUserOpen(false)}
        title="Quick Menu"
      >
        <AdminUserHeader user={user} />
        <div className="grid grid-cols-3 gap-4 mt-2">
          <ActionTile
            icon={User2}
            label="Profile"
            onClick={() => onNavigate("/profile")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label="My Listings"
            onClick={() => onNavigate("/my-listings")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label="Approved"
            onClick={() => onNavigate("/profile/approved-listings")}
          />
          <ActionTile
            icon={List}
            label="Audit"
            onClick={() => onNavigate("/profile/audit-logs")}
          />
          <ActionTile
            icon={Info}
            label="Feedbacks"
            onClick={() => onNavigate("/profile/feedbacks")}
          />
          <div className="flex flex-col gap-2 items-center justify-center">
            <ThemeToggle />
            <span className="text-[10px] subtle">Theme</span>
          </div>
        </div>
        <ButtonRowLogout onDone={() => setUserOpen(false)} />
      </CenterOverlay>

      {/* Guest Search Modal */}
      <CenterOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search"
      >
        <SearchBox placeholder="Search listings..." className="w-full" />
        <p className="text-xs subtle">
          Start typing to find listings, ads, and more.
        </p>
      </CenterOverlay>
      {/* Scroll spacer (not strictly needed) */}
      <div className="h-4 md:hidden" aria-hidden />
    </>
  );
};

export default BottomNavigation;

// Supporting small components (kept at bottom to avoid clutter)

const AdminUserHeader: React.FC<{ user: any }> = ({ user }) => {
  if (!user) return null;
  const avatar = user?.avatarUrl || user?.photo || "/favicon.svg";
  const name = user?.fullName || user?.name || user?.email || "You";
  return (
    <div className="flex items-center gap-3 p-2 -mt-1">
      <div className="relative size-12 rounded-2xl overflow-hidden border border-[hsl(var(--border))]">
        <Image
          src={avatar}
          alt="avatar"
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold line-clamp-1">{name}</p>
        {user?.email && (
          <p className="text-xs subtle line-clamp-1">{user.email}</p>
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
    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
  >
    <span className="size-10 grid place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-fuchsia-500/25 text-[hsl(var(--accent))] shadow-inner">
      <Icon className="size-5" />
    </span>
    <span className="text-[11px] font-medium text-center leading-tight line-clamp-2">
      {label}
    </span>
  </motion.button>
);

const ButtonRowLogout: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
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
    } catch {}
    onDone?.();
    window.location.href = "/sign-in";
  };
  return (
    <div className="pt-2 flex justify-end">
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 text-sm font-medium"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </div>
  );
};
