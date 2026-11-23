"use client";

import React, { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { NotificationsPanel } from "@/components/ui/organisms/notifications-panel";
import { useNotificationsStore } from "@/store/notifications.store";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/cn";
import { BottomNavItem } from "./bottom-nav-item";
import { BottomNavSheets } from "./bottom-nav-sheets";
import { useBottomNavItems } from "./use-bottom-nav-items";
import type { BottomNavDescriptor, BottomNavigationProps } from "./types";

export type { BottomNavDescriptor, BottomNavigationProps } from "./types";

/**
 * Mobile floating dock — glass shell, active pill, role-aware sheets.
 * Orchestrates items + sheets; presentation lives in sibling modules (SRP).
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  isAdmin: isAdminProp,
  className = "",
  items: overrideItems,
  forceVisible = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, roles } = useAuth();
  const { t } = useLanguage();
  const isAuthed = !!user;
  const isAdmin = isAdminProp ?? roles.includes("ADMIN");
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const onSearch = useCallback(() => setSearchOpen(true), []);
  const onYou = useCallback(() => {
    if (isAdmin) setAdminOpen(true);
    else if (isAuthed) setUserOpen(true);
    else router.push("/sign-in");
  }, [isAdmin, isAuthed, router]);

  const computedItems = useBottomNavItems({
    isAdmin,
    isAuthed,
    overrideItems,
    onSearch,
    onYou,
  });

  const onNavigate = useCallback(
    (href?: string, override?: () => void) => {
      if (override) {
        override();
        return;
      }
      if (!href || href === pathname) return;
      router.push(href);
    },
    [router, pathname],
  );

  const activeCheck = useCallback(
    (item: BottomNavDescriptor) => {
      if (!item.href) return false;
      if (item.href === "/") return pathname === "/";
      return (pathname || "").startsWith(item.href);
    },
    [pathname],
  );

  if (!forceVisible) return null;

  return (
    <>
      <nav
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-[700] md:hidden",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          className,
        )}
        aria-label={t("bottomNavigationAria")}
      >
        <div className="pointer-events-auto mx-auto w-[min(94%,28rem)] px-1">
          <motion.div
            initial={prefersReducedMotion ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 300, damping: 28 }
            }
            className={cn(
              "relative flex items-stretch gap-0.5 overflow-hidden rounded-[1.75rem]",
              "border border-white/10 bg-background/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.45)]",
              "backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55",
              "ring-1 ring-border/40",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
            {computedItems.map((item, i) => {
              const active = activeCheck(item);
              return (
                <div key={item.key} className="relative flex flex-1">
                  <BottomNavItem
                    item={item}
                    active={active}
                    onNavigate={onNavigate}
                    index={i}
                    reducedMotion={prefersReducedMotion}
                  />
                  {item.key === "notifications" && unreadCount > 0 && (
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 app-text-micro font-semibold text-accent-foreground">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </nav>

      {isAuthed && (
        <NotificationsPanel
          isOpen={notifOpen}
          onClose={() => setNotifOpen(false)}
          fetchUrl="/notifications"
          anchor="center"
        />
      )}

      <BottomNavSheets
        user={user}
        adminOpen={adminOpen}
        setAdminOpen={setAdminOpen}
        userOpen={userOpen}
        setUserOpen={setUserOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onNavigate={onNavigate}
        onOpenNotifications={() => setNotifOpen(true)}
      />

      <div
        className="fixed inset-y-0 left-0 z-[650] w-6 md:hidden"
        onPointerDown={(e) => {
          if (e.pointerType !== "touch") return;
          if (isAdmin) setAdminOpen(true);
          else if (isAuthed) setUserOpen(true);
          try {
            navigator.vibrate?.(10);
          } catch {
            /* ignore */
          }
        }}
        aria-hidden
      />
      <div className="h-16 md:hidden" aria-hidden />
    </>
  );
};

export default BottomNavigation;
