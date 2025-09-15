"use client";
import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  // local loading flag while we attempt to hydrate session
  const [loading, setLoading] = (function useLocalLoading() {
    // simple closure hook to avoid adding to exported API surface beyond this file
    // we use a real React state below by creating a small component-level hook pattern
    // but since this file is a hook we can use useState inline
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useState } = require("react");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useState(true);
  })();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/session-token", { cache: "no-store" });
        const { token } = await res.json();
        if (!token) {
          if (mounted) setSession(null);
          if (mounted) setLoading(false);
          return;
        }
        const res2 = await fetch("/api/session-info", { cache: "no-store" }).catch(() => null as any);
        if (res2?.ok) {
          const j = await res2.json();
          if (mounted) setSession({ token, user: j.user });
          if (mounted) setLoading(false);
        } else if (mounted) setSession({ token, user: null });
        if (mounted) setLoading(false);
      } catch {
        if (mounted) setSession(null);
        if (mounted) setLoading(false);
      }
    };
    // only load once, don't clobber if already set (e.g., after sign-in)
    if (!session) load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty deps to avoid refetching

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

  return { session, token: session?.token ?? null, user: session?.user ?? null, roles, isAdmin, counts, loading } as const;
}
