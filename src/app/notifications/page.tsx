"use client";

import { useApiGet } from "@/lib/api-hooks";

export default function NotificationsPage() {
  const { data, isLoading, error } = useApiGet<any[] | any>(
    ["notifications"],
    "/notifications"
  );
  const items = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <div className="space-y-4">
      <h2 className="heading-xl">Notifications</h2>
      <div className="card p-4 space-y-3">
        {isLoading && <p>Loading…</p>}
        {error && (
          <p className="text-red-500">
            {String((error as any).message || error)}
          </p>
        )}
        {!isLoading &&
          !error &&
          (items.length === 0 ? (
            <p className="subtle">No notifications.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((n: any, i: number) => (
                <li
                  key={i}
                  className="p-3 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="text-sm font-medium">
                    {n.title ?? "Notification"}
                  </div>
                  {n.message && (
                    <div className="text-sm subtle">{n.message}</div>
                  )}
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}
