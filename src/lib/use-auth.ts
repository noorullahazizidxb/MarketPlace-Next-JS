"use client";

import { useEffect, useMemo, useState } from "react";

type Session = {
  token: string;
  user: any;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // session token only endpoint; store token for auth header and session details via another endpoint if needed
        const res = await fetch("/api/session-token", { cache: "no-store" });
        const { token } = await res.json();
        if (!token) {
          if (mounted) setSession(null);
          return;
        }
        // Try richer session endpoint when available; fallback to token-only
        // For now, we just decode user info from a prior redirect (login saves both in cookie)
        const res2 = await fetch("/api/session-info", { cache: "no-store" }).catch(() => null as any);
        if (res2?.ok) {
          const j = await res2.json();
          if (mounted) setSession({ token, user: j.user });
        } else if (mounted) setSession({ token, user: null });
      } catch {
        if (mounted) setSession(null);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const roles: string[] = useMemo(() => session?.user?.roles?.map((r: any) => r.role) ?? [], [session]);
  const isAdmin = roles.includes("ADMIN");

  const counts = useMemo(() => {
    const u = session?.user || {};
    return {
      notifications: (u.notifications || []).length || 0,
      listings: (u.listings || []).length || 0,
      approvedListings: (u.approvedListings || []).length || 0,
      auditLogs: (u.auditLogs || []).length || 0,
      feedback: (u.feedbacks || []).length || 0,
    };
  }, [session]);

  return { session, token: session?.token ?? null, user: session?.user ?? null, roles, isAdmin, counts } as const;
}
