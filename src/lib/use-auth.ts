"use client";
import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useLocalGetImmutable } from "@/lib/api-hooks";
import { setCachedToken } from "./axiosClient";

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const hasUser = Boolean(session?.user);

  const { data: tokenData, error: tokenErr, isFetched: tokenFetched } = useLocalGetImmutable<{ token?: string | null }>(
    session?.token ? null : ["session-token"],
    "/api/session-token",
  );

  const token = session?.token || (tokenFetched ? tokenData?.token ?? null : undefined);
  const waitingForUser = Boolean(token) && !hasUser;
  const { data: infoData, isFetched: infoFetched } = useLocalGetImmutable<{ user?: any }>(
    waitingForUser ? ["session-info"] : null,
    "/api/session-info",
  );

  useEffect(() => {
    if (!waitingForUser || !token || !infoFetched || !infoData?.user) return;
    setCachedToken(token);
    if (session?.token) setUser(infoData.user);
    else setSession({ token, user: infoData.user });
  }, [waitingForUser, token, infoFetched, infoData, session?.token, setSession, setUser]);

  const roles: string[] = useMemo(
    () => session?.user?.roles?.map((role: any) => role.role) ?? [],
    [session],
  );
  const isAdmin = roles.includes("ADMIN");
  const counts = useMemo(() => countSessionActivity(session?.user), [session]);
  const loading = !hasUser && !tokenErr && (token === undefined || (Boolean(token) && !infoFetched));

  return {
    session,
    token: session?.token ?? null,
    user: session?.user ?? null,
    roles,
    isAdmin,
    counts,
    loading,
  } as const;
}

function countSessionActivity(user: any) {
  const profile = user || {};
  return {
    notifications: (profile.notifications || []).length || 0,
    listings: (profile.listings || []).length || 0,
    approvedListings: (profile.approvedListings || []).length || 0,
    auditLogs: (profile.auditLogs || []).length || 0,
    feedback: (profile.feedbacks || []).length || 0,
  };
}
