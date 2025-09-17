"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { useNotificationsRealtime } from "@/lib/use-notifications-realtime";

export default function NotificationsPage() {
  const session = useAuthStore((s) => s.session);
  const setNotifications = useNotificationsStore((s) => s.set);
  const storeItems = useNotificationsStore((s) => s.items);
  const { connected } = useNotificationsRealtime();

  const items = useMemo(() => {
    const u = session?.user ?? {};
    const n = Array.isArray(u.notifications) ? u.notifications : [];
    // hydrate notifications store for global access
    if (n.length)
      setNotifications(
        n.map((it: any) => ({
          id: it.id ?? String(Math.random()),
          title: it.title ?? it.type ?? "Notification",
          read: !!it.read,
          createdAt: it.createdAt,
        }))
      );
    return n;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  if (!session) return <p className="subtle">Loading session…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="heading-xl">Notifications</h2>
        <span className="text-xs subtle">
          Socket: {connected ? "connected" : "disconnected"}
        </span>
      </div>
      <div className="card p-4 space-y-3">
        {storeItems.length === 0 ? (
          <p className="subtle">No notifications.</p>
        ) : (
          <ul className="space-y-2">
            {storeItems.map((n: any, i: number) => (
              <li
                key={n.id ?? i}
                className="p-3 rounded-xl border border-white/10 bg-white/5"
              >
                <div className="text-sm font-medium">
                  {n.title ?? "Notification"}
                </div>
                {n.message && <div className="text-sm subtle">{n.message}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
