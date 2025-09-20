"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Info,
  Mail,
  AlertCircle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { useNotificationsStore } from "@/store/notifications.store";
import { api } from "@/lib/axiosClient";

type Recipient = {
  id: number;
  userId: string;
  readAt: string | null;
};

type Notification = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  title?: string;
  message?: string;
  channel?: string; // SYSTEM | EMAIL | etc
  targetType?: string;
  recipients?: Recipient[];
};

type ApiEnvelope = {
  message?: string;
  statusCode?: number;
  success?: boolean;
  entity?: string;
  data?: Notification[];
};

export type NotificationsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  fetchUrl?: string; // API URL to GET notifications; defaults to "/notifications"
  onMarkRead?: (id: string) => Promise<void> | void;
  onMarkAllRead?: (ids: string[]) => Promise<void> | void;
};

function formatTimeAgo(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return date.toLocaleString();
}

function channelIcon(channel?: string) {
  const c = (channel || "").toUpperCase();
  if (c === "EMAIL") return Mail;
  if (c === "ALERT") return AlertCircle;
  if (c === "SECURITY") return Shield;
  if (c === "SYSTEM") return Info;
  return Bell;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  className,
  fetchUrl = "/notifications",
  onMarkRead,
  onMarkAllRead,
}: NotificationsPanelProps) {
  const getMessage = (n: any): string | null => {
    const direct =
      n?.message ??
      n?.body ??
      n?.content ??
      n?.description ??
      n?.text ??
      n?.details ??
      n?.note;
    if (typeof direct === "string" && direct.trim().length)
      return direct.trim();
    const meta = n?.meta?.message ?? n?.meta?.description;
    if (typeof meta === "string" && meta.trim().length) return meta.trim();
    const payload =
      n?.payload?.message ?? n?.payload?.content ?? n?.payload?.description;
    if (typeof payload === "string" && payload.trim().length)
      return payload.trim();
    const data = n?.data?.message ?? n?.data?.description ?? n?.data?.content;
    if (typeof data === "string" && data.trim().length) return data.trim();
    return null;
  };
  const { user } = useAuth();
  const uid = (user as any)?.id as string | undefined;
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const storeItems = useNotificationsStore((s) => s.items);
  const markReadInStore = useNotificationsStore((s) => s.markRead);
  const markAllMutation = useApiMutation<void>(
    "patch",
    "/notifications/mark-all-read"
  );

  const { data, isLoading, error } = useApiGet<ApiEnvelope | Notification[]>(
    ["notifications", uid ?? "anon"],
    fetchUrl
  );

  const list: Notification[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return Array.isArray(data.data) ? data.data : [];
  }, [data]);

  const [local, setLocal] = useState<Notification[]>(list);
  useEffect(() => setLocal(list), [list]);

  const displayList: Notification[] = useMemo(() => {
    const map = new Map<string, Notification>();
    for (const n of local || []) map.set(n.id, n);
    for (const s of storeItems || []) {
      if (!map.has(s.id)) {
        const createdAt = (s as any).createdAt || new Date().toISOString();
        const recipients: Recipient[] = uid
          ? [
              {
                id: 0,
                userId: uid,
                readAt: (s as any).read ? new Date().toISOString() : null,
              },
            ]
          : [];
        map.set(s.id, {
          id: s.id,
          title: s.title,
          message: (s as any).message,
          createdAt,
          recipients,
        } as Notification);
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return tb - ta;
    });
  }, [local, storeItems, uid]);

  const withUnread = useMemo(() => {
    return (displayList || []).map((n) => {
      const r = (n.recipients || []).find((x) => !uid || x.userId === uid);
      let unread = r ? r.readAt == null : false;
      if (!r) {
        const s = storeItems.find((si) => si.id === n.id);
        if (s && typeof s.read === "boolean") unread = !s.read;
      }
      return { n, unread } as { n: Notification; unread: boolean };
    });
  }, [displayList, uid, storeItems]);

  const unreadCount = withUnread.filter((x) => x.unread).length;

  const markOne = async (id: string) => {
    setLocal((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const recipients = (n.recipients || []).map((r) =>
          !uid || r.userId !== uid || r.readAt
            ? r
            : { ...r, readAt: new Date().toISOString() }
        );
        return { ...n, recipients };
      })
    );
    try {
      markReadInStore(id);
    } catch {}
    try {
      if (onMarkRead) {
        await onMarkRead(id);
      } else {
        await api.patch(`/notifications/${id}`, {
          readAt: new Date().toISOString(),
        });
      }
    } catch {}
  };

  const markAll = async () => {
    const ids = withUnread.filter((x) => x.unread).map((x) => x.n.id);
    setLocal((prev) =>
      prev.map((n) => {
        const recipients = (n.recipients || []).map((r) =>
          !uid || r.userId !== uid || r.readAt
            ? r
            : { ...r, readAt: new Date().toISOString() }
        );
        return { ...n, recipients };
      })
    );
    try {
      ids.forEach((id) => markReadInStore(id));
    } catch {}
    try {
      if (onMarkAllRead) {
        await onMarkAllRead(ids);
      } else if (ids.length) {
        const payload = { ids, readAt: new Date().toISOString() };
        await markAllMutation.mutateAsync(payload as any);
      }
    } catch {}
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-[80] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          <motion.aside
            className={cn(
              "fixed right-4 top-20 z-[90] w-[min(92vw,420px)] origin-top-right",
              className
            )}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl border border-[hsl(var(--card-border, var(--border)))] bg-[hsl(var(--card-bg, var(--card)))] text-[hsl(var(--card-fg, var(--foreground)))] shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-gradient-to-br from-primary/60 to-fuchsia-500/50 grid place-items-center text-background shadow-[inset_0_-6px_20px_rgba(0,0,0,.2)]">
                    <Bell className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Notifications</div>
                    <div className="text-xs subtle">{unreadCount} unread</div>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAll}
                    className="px-3 h-9 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/30 text-sm"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {isLoading ? (
                  <div className="p-4 subtle text-sm">Loading…</div>
                ) : error ? (
                  <div className="p-4 text-sm text-red-500">
                    {String((error as any)?.message || error)}
                  </div>
                ) : displayList.length === 0 ? (
                  <div className="p-6 text-center subtle text-sm">
                    No notifications
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {withUnread.map(({ n, unread }) => {
                      const Icon = channelIcon(n.channel);
                      return (
                        <li
                          key={n.id}
                          className={cn(
                            "group relative rounded-2xl border p-3 transition-colors",
                            "border-[hsl(var(--border))] bg-[hsl(var(--card))]",
                            unread && "ring-1 ring-[hsl(var(--accent))]/40"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "mt-0.5 size-9 rounded-xl grid place-items-center shadow-sm",
                                unread
                                  ? "bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]"
                                  : "bg-[hsl(var(--muted))] subtle"
                              )}
                            >
                              <Icon className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold line-clamp-1">
                                    {n.title || "Notification"}
                                  </div>
                                  {(() => {
                                    const msg = getMessage(n as any);
                                    return msg ? (
                                      <div className="text-sm subtle line-clamp-2">
                                        {msg}
                                      </div>
                                    ) : null;
                                  })()}
                                </div>
                                <div className="text-2xs subtle whitespace-nowrap">
                                  {formatTimeAgo(n.createdAt)}
                                </div>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                {unread ? (
                                  <button
                                    onClick={() => markOne(n.id)}
                                    className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs hover:bg-[hsl(var(--accent))]/30"
                                  >
                                    <CheckCircle2 className="size-4" />
                                    Mark as read
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-[hsl(var(--muted))] text-foreground/70 text-xs">
                                    <CheckCircle2 className="size-4" />
                                    Read
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_12px_40px_rgba(0,0,0,0.25)]" />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
