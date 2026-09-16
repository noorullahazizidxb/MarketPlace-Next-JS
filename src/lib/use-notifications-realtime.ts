"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "./use-auth";
import { useApiGet } from "./api-hooks";
import { useNotificationsStore, NotificationItem } from "@/store/notifications.store";
import { setCachedToken } from "./axiosClient";
import { isSocketIoEnabled, SOCKET_POLL_INTERVAL_MS } from "./realtime";
import { initSocket } from "./socket";

export function useNotificationsRealtime(enabled: boolean = true) {
  const { token, user } = useAuth();
  const setList = useNotificationsStore((s) => s.set);
  const addItem = useNotificationsStore((s) => s.add);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const userId = useMemo(() => (user?.id ?? user?._id ?? null), [user]);

  const socketsOn = isSocketIoEnabled();
  const { data, error, isFetching: isValidating, mutate } = useApiGet<any[]>(
    userId ? ["notifications", userId] : (undefined as unknown as readonly unknown[]),
    "/notifications",
    undefined,
    {
      refetchInterval: enabled && userId && !socketsOn ? SOCKET_POLL_INTERVAL_MS : false,
    }
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
    if (!socketsOn) return;
    setCachedToken(token.startsWith("Bearer ") ? token.replace(/^Bearer /i, "") : token);
    const socket = initSocket(token);
    if (!socket) return;
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      try { console.log("[notifications] websocket connected"); } catch { }
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
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notifications:list");
      socket.off("notification:new");
      socketRef.current = null;
    };
  }, [enabled, token, userId, setList, addItem, mutate, socketsOn]);

  return { connected, loading: !!isValidating, error } as const;
}
