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

  const items = [
    { href: "/", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/listings", label: "Listings", Icon: Layers3 },
    { href: "/pendings", label: "Pending Lists", Icon: List },
    { href: "/listings/create", label: "New Listing", Icon: PlusCircle },
    { href: "/profile", label: "Profile", Icon: User },
    // keep Settings in the nav but render children below
    { href: "/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      {showDesktop && (
        <aside className="hidden md:flex flex-col gap-3 p-4 border-r border-[hsl(var(--border))] sticky top-0 h-screen bg-[hsl(var(--background))]">
          <div className="relative">
            <div className="glass rounded-2xl p-3 border border-[hsl(var(--border))] flex items-center gap-3">
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center bg-transparent hover:bg-foreground/5 gap-3"
              >
                <Image
                  src={asset(avatar)}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
                <div>
                  <div className="text-sm font-medium line-clamp-1">{name}</div>
                  <div className="text-xs subtle">
                    {user?.roles?.map((r: any) => r.role).join(", ")}
                  </div>
                </div>
              </button>
            </div>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-3 top-[78px] z-[70] w-56 glass rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-2xl"
              >
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <User2 className="size-4" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link
                    href="/my-listings"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <LayoutGrid className="size-4" />
                    <span className="text-sm">My listings</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <Bell className="size-4" />
                    <span className="text-sm">Notifications</span>
                  </Link>
                  <Link
                    href="/profile/roles"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <List className="size-4" />
                    <span className="text-sm">Roles</span>
                  </Link>
                  <Link
                    href="/profile/sent-notifications"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <Bell className="size-4" />
                    <span className="text-sm">Sent Notifications</span>
                  </Link>
                  <Link
                    href="/profile/approved-listings"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <LayoutGrid className="size-4" />
                    <span className="text-sm">Approved Listings</span>
                  </Link>
                  <Link
                    href="/profile/audit-logs"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <List className="size-4" />
                    <span className="text-sm">Audit Logs</span>
                  </Link>
                  <Link
                    href="/profile/feedbacks"
                    className="flex items-center gap-3 px-3 h-10 rounded-xl link"
                  >
                    <Info className="size-4" />
                    <span className="text-sm">Feedbacks</span>
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await logout.mutateAsync({});
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
                    className="flex w-full items-center gap-3 px-3 h-10 hover:bg-white/5 text-left"
                  >
                    <LogOut className="size-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          <nav className="space-y-2">
            {items.map(({ href, label, Icon }) => (
              <div key={href}>
                {label === "Settings" ? (
                  <div
                    onClick={() => setSettingsOpen((v) => !v)}
                    className={
                      "flex items-center gap-3 px-3 h-11 rounded-xl glass transition-all hover:translate-x-0.5 border border-[hsl(var(--border))] cursor-pointer " +
                      (pathname === href
                        ? "ring-1 ring-primary/40 bg-gradient-to-r from-primary/10 to-transparent"
                        : "")
                    }
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{label}</span>
                    <ChevronDown
                      className={`ml-auto transition-transform ${
                        settingsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                ) : (
                  <Link
                    href={href}
                    onClick={() => onClose?.()}
                    className={
                      "flex items-center gap-3 px-3 h-11 rounded-xl glass transition-all hover:translate-x-0.5 border border-[hsl(var(--border))] " +
                      (pathname === href
                        ? "ring-1 ring-primary/40 bg-gradient-to-r from-primary/10 to-transparent"
                        : "")
                    }
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                )}

                {label === "Settings" && (
                  <AnimatePresence>
                    {settingsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-8 pr-3 overflow-hidden"
                      >
                        <Link
                          href="/settings/themes"
                          onClick={() => onClose?.()}
                          className="flex items-center gap-3 h-10 text-sm"
                        >
                          <Layers className="size-4" />
                          <span>Configure Themes</span>
                        </Link>
                        <Link
                          href="/settings/notifications"
                          onClick={() => onClose?.()}
                          className="flex items-center gap-3 h-10 text-sm"
                        >
                          <Bell className="size-4" />
                          <span>Notifications</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Mobile off-canvas sidebar when isOpen is true */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
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
            className="absolute left-0 top-0 h-full w-72 bg-[hsl(var(--background))] border-r border-[hsl(var(--border))] shadow-xl p-4"
          >
            <div className="glass rounded-2xl p-3 border border-[hsl(var(--border))] mb-3 flex items-center gap-3">
              <Image
                src={avatar}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs subtle">
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
                      className="flex items-center gap-3 px-3 h-11 rounded-xl glass transition-all hover:translate-x-0.5 border border-[hsl(var(--border))] cursor-pointer"
                    >
                      <Icon className="size-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ) : (
                    <Link
                      href={href}
                      onClick={() => onClose?.()}
                      className="flex items-center gap-3 px-3 h-11 rounded-xl glass transition-all hover:translate-x-0.5 border border-[hsl(var(--border))] cursor-pointer"
                    >
                      <Icon className="size-4" />
                      <span className="text-sm font-medium">{label}</span>
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
                            href="/settings/themes"
                            onClick={() => onClose?.()}
                            className="flex items-center gap-3 h-10 text-sm"
                          >
                            <Layers className="size-4" />
                            <span>Configure Themes</span>
                          </Link>
                          <Link
                            href="/settings/notifications"
                            onClick={() => onClose?.()}
                            className="flex items-center gap-3 h-10 text-sm"
                          >
                            <Bell className="size-4" />
                            <span>Notifications</span>
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
