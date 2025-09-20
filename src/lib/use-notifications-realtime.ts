"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./use-auth";
import { useApiGet } from "./api-hooks";
import { useNotificationsStore, NotificationItem } from "@/store/notifications.store";
import { setCachedToken } from "./axiosClient";

export function useNotificationsRealtime(enabled: boolean = true) {
  const { token, user } = useAuth();
  const setList = useNotificationsStore((s) => s.set);
  const addItem = useNotificationsStore((s) => s.add);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const userId = useMemo(() => (user?.id ?? user?._id ?? null), [user]);

  const { data, error, isValidating, mutate } = useApiGet<any[]>(
    userId ? ["notifications", userId] : (undefined as unknown as readonly unknown[]),
    "/notifications"
  );

  const normalize = (items: any[], uid: string | null | undefined): NotificationItem[] => {
    return (items || []).map((it: any) => {
      const id = String(it?.id ?? it?._id ?? "");
      let read = false;
      if (typeof it?.read === "boolean") read = it.read;
      else if (Array.isArray(it?.recipients) && uid) {
        const r = it.recipients.find((x: any) => x?.userId === uid);
        read = r ? !!r.readAt : false;
      }
      const message =
        it?.message ??
        it?.body ??
        it?.content ??
        it?.description ??
        it?.text ??
        it?.details ??
        it?.note ??
        it?.meta?.message ??
        it?.meta?.description ??
        it?.payload?.message ??
        it?.payload?.content ??
        it?.payload?.description ??
        it?.data?.message ??
        it?.data?.description ??
        it?.data?.content;
      return {
        id,
        title: it?.title ?? it?.message ?? "Notification",
        message: typeof message === "string" ? message : undefined,
        createdAt: it?.createdAt,
        read,
      } as NotificationItem;
    });
  };

  useEffect(() => {
    if (Array.isArray(data)) setList(normalize(data, userId));
  }, [data, setList, userId]);

  useEffect(() => {
    if (!enabled) return;
    if (!token || !userId) return;
    // ensure axios client sends Authorization header for API requests
    setCachedToken(token.startsWith("Bearer ") ? token.replace(/^Bearer /i, "") : token);
    // clear cached token on cleanup
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
      auth: { token: bearer },
      query: { token: bearer },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      try { console.log("[notifications] websocket connected"); } catch {}
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("notifications:list", (items: any[]) => {
      const mapped = Array.isArray(items) ? normalize(items, userId) : [];
      setList(mapped);
      mutate(mapped as any, false);
    });

    socket.on("notification:new", (n: any) => {
      const mapped = normalize([n], userId);
      if (mapped[0]) addItem(mapped[0]);
    });

    return () => {
      setCachedToken(null);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, token, userId, setList, addItem, mutate]);

  return { connected, loading: !!isValidating, error } as const;
}
