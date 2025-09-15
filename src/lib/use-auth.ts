"use client";
import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useLocalGetImmutable } from "@/lib/api-hooks";
import { setCachedToken } from "./axiosClient";

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  // SWR-based hydration for session token and info
  const { data: tokenData, error: tokenErr } = useLocalGetImmutable<{ token?: string }>(
    session ? null : ["session-token"],
    "/api/session-token"
  );

  const token = session?.token ?? tokenData?.token ?? null;

  const { data: infoData } = useLocalGetImmutable<{ user: any }>(
    !session && token ? ["session-info"] : null,
    "/api/session-info"
  );

  useEffect(() => {
    if (!session && token) {
      setCachedToken(token);
      if (infoData?.user) setSession({ token, user: infoData.user });
      else setSession({ token, user: null });
    }
  }, [session, token, infoData, setSession]);

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

  const loading = !session && token === null && !tokenErr;
  return { session, token: session?.token ?? null, user: session?.user ?? null, roles, isAdmin, counts, loading } as const;
}
