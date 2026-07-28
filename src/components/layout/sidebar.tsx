"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  Layers3,
  PlusCircle,
  User,
  ChevronDown,
  Layers,
  Bell,
  Megaphone,
  User2,
  LogOut,
  LayoutGrid,
  List,
  Info,
  Mail,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useLocalMutation } from "@/lib/api-hooks";
import { asset } from "@/lib/assets";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
export function Sidebar({
  isOpen,
  onClose,
  showDesktop = true,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  showDesktop?: boolean;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const logout = useLocalMutation("post", "/api/logout");
  const avatar = user?.avatarUrl || user?.photo || "/favicon.svg";
  const name = user?.fullName || user?.name || user?.email || "You";

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { t, locale, isRtl } = useLanguage();
  const items = [
    { href: "/admin", label: t("dashboard"), Icon: LayoutDashboard },
    { href: "/listings", label: t("listings"), Icon: Layers3 },
    { href: "/blogs", label: "Blogs", Icon: Info },
    { href: "/admin/notifications", label: t("notifications"), Icon: Bell },
    { href: "/admin/ads", label: t("advertisements"), Icon: Megaphone },
    { href: "/admin/contacts", label: t("contacts"), Icon: Mail },
    { href: "/admin/users", label: t("usersManagement"), Icon: User }, { href: "/admin/categories", label: t("categories") || "Categories", Icon: Layers }, { href: "/pendings", label: t("pendingLists"), Icon: List },
    { href: "/admin/manage-content-status", label: "Content Status", Icon: LayoutGrid },
    { href: "/listings/create", label: t("newListing"), Icon: PlusCircle },
    { href: "/admin/stories", label: t("stories"), Icon: Megaphone },
    { href: "/settings/appearance", label: t("themes"), Icon: Layers },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      {showDesktop && (
        <aside
          dir={isRtl ? "rtl" : "ltr"}
          data-app-page="shell-sidebar"
          className={
            (isRtl ? "hidden md:flex flex-col " : "hidden md:flex flex-col ") +
            " sticky top-0 h-screen bg-transparent border-r border-border liquid-glass"
          }
        >
          <div className="relative p-[var(--space-filter)]">
            <div className="liquid-glass glass-hover rounded-full p-[var(--space-filter)] flex items-center justify-center gap-[var(--space-gap)]">
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center rounded-2xl  bg-transparent hover:bg-foreground/5 gap-[var(--space-gap)]"
              >
                <Image
                  src={asset(avatar)}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
                <div>
                  <div className="app-text-body font-medium line-clamp-1">{name}</div>
                  <div className="app-text-caption subtle">
                    {user?.roles?.map((r: any) => r.role).join(", ")}
                  </div>
                </div>
              </button>
            </div>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-7 top-[78px] z-[70] w-56 rounded-2xl overflow-hidden bg-card border border-border"
              >
                <div className="p-[var(--space-card)]">
                  <Link
                    href="/profile"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl "
                  >
                    <User2 className="app-icon-sm" />
                    <span className="app-text-body">{t("profile")}</span>
                  </Link>
                  <Link
                    href="/my-listings"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl "
                  >
                    <LayoutGrid className="app-icon-sm" />
                    <span className="app-text-body">{t("myListings")}</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl"
                  >
                    <Bell className="app-icon-sm" />
                    <span className="app-text-body">{t("notifications")}</span>
                  </Link>
                  <Link
                    href="/profile/roles"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl"
                  >
                    <List className="app-icon-sm" />
                    <span className="app-text-body">{t("roles")}</span>
                  </Link>
                  <Link
                    href="/profile/sent-notifications"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl"
                  >
                    <Bell className="app-icon-sm" />
                    <span className="app-text-body">{t("sentNotifications")}</span>
                  </Link>
                  <Link
                    href="/profile/approved-listings"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl"
                  >
                    <LayoutGrid className="app-icon-sm" />
                    <span className="app-text-body">{t("approvedListings")}</span>
                  </Link>
                  <Link
                    href="/profile/audit-logs"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl"
                  >
                    <List className="app-icon-sm" />
                    <span className="app-text-body">{t("auditLogs")}</span>
                  </Link>
                  <Link
                    href="/profile/feedbacks"
                    className="flex items-center gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] rounded-xl"
                  >
                    <Info className="app-icon-sm" />
                    <span className="app-text-body">{t("feedbacks")}</span>
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await logout.mutateAsync({});
                      } catch { }
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
                      } catch { }
                      window.location.href = "/sign-in";
                    }}
                    className="flex w-full items-center rounded-2xl gap-[var(--space-gap)] px-3 h-[var(--ctrl-h)] hover:bg-white/5 text-left"
                  >
                    <LogOut className="app-icon-sm" />
                    <span className="app-text-body">{t("logout")}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          <nav className="space-y-2 p-[var(--space-card)]">
            {items.map(({ href, label, Icon }) => (
              <div key={href}>
                {label === "Settings" ? (
                  <div
                    onClick={() => setSettingsOpen((v) => !v)}
                    className={
                      "flex items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] rounded-xl liquid-glass glass-hover transition-all hover:translate-x-0.5 cursor-pointer " +
                      (pathname === href
                        ? "ring-1 ring-primary/40 bg-gradient-to-r from-primary/10 to-transparent"
                        : "")
                    }
                  >
                    <Icon className="app-icon-sm" />
                    <span className="app-text-body font-medium">{label}</span>
                    <ChevronDown
                      className={`ml-auto transition-transform ${settingsOpen ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                ) : (
                  <Link
                    href={href}
                    onClick={() => onClose?.()}
                    className={
                      "flex items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] rounded-xl liquid-glass glass-hover transition-all hover:translate-x-0.5 " +
                      (pathname === href
                        ? "ring-1 ring-primary/40 bg-gradient-to-r from-primary/10 to-transparent"
                        : "")
                    }
                  >
                    <Icon className="app-icon-sm" />
                    <span className="app-text-body font-medium">{label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Mobile off-canvas sidebar when isOpen is true */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60]"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={() => onClose?.()}
          />
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            data-app-page="shell-sidebar"
            className={
              "absolute top-0 h-full w-72 bg-background shadow-xl p-[var(--space-filter)] " +
              (isRtl
                ? "right-0 border-l border-border"
                : "left-0 border-r border-border")
            }
          >
            <div className="liquid-glass glass-hover rounded-2xl p-[var(--space-filter)] mb-3 flex items-center gap-[var(--space-gap)]">
              <Image
                src={avatar}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <div className="app-text-body font-medium">{name}</div>
                <div className="app-text-caption subtle">
                  {user?.roles?.map((r: any) => r.role).join(", ")}
                </div>
              </div>
            </div>
            <nav className="space-y-2">
              {items.map(({ href, label, Icon }) => (
                <div key={href}>
                  {label === "Settings" ? (
                    <div
                      onClick={() => setSettingsOpen((v) => !v)}
                      className="flex items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] rounded-xl glass transition-all hover:translate-x-0.5 border border-border cursor-pointer"
                    >
                      <Icon className="app-icon-sm" />
                      <span className="app-text-body font-medium">{label}</span>
                    </div>
                  ) : (
                    <Link
                      href={href}
                      onClick={() => onClose?.()}
                      className="flex items-center gap-[var(--space-gap)] px-3 min-h-[var(--ctrl-h)] rounded-xl glass transition-all hover:translate-x-0.5 border border-border cursor-pointer"
                    >
                      <Icon className="app-icon-sm" />
                      <span className="app-text-body font-medium">{label}</span>
                    </Link>
                  )}
                  {label === "Settings" && (
                    <AnimatePresence>
                      {settingsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-6 pr-3 overflow-hidden"
                        >
                          <Link
                            href="/settings/appearance"
                            onClick={() => onClose?.()}
                            className="flex items-center gap-[var(--space-gap)] h-[var(--ctrl-h)] app-text-body"
                          >
                            <Layers className="app-icon-sm" />
                            <span>{t("configureThemes")}</span>
                          </Link>
                          <Link
                            href="/settings/notifications"
                            onClick={() => onClose?.()}
                            className="flex items-center gap-[var(--space-gap)] h-[var(--ctrl-h)] app-text-body"
                          >
                            <Bell className="app-icon-sm" />
                            <span>{t("notifications")}</span>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>
          </motion.aside>
        </div>
      )}
    </>
  );
}
