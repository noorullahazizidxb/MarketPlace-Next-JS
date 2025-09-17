"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./use-auth";
import { useApiGet } from "./api-hooks";
import { useNotificationsStore, NotificationItem } from "@/store/notifications.store";
import { setCachedToken } from "./axiosClient";

export function useNotificationsRealtime() {
  const { token, user } = useAuth();
  const setList = useNotificationsStore((s) => s.set);
  const addItem = useNotificationsStore((s) => s.add);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const userId = useMemo(() => (user?.id ?? user?._id ?? null), [user]);

  const { data, error, isValidating, mutate } = useApiGet<NotificationItem[]>(
    userId ? ["notifications", userId] : (undefined as unknown as readonly unknown[]),
    "/notifications"
  );

  useEffect(() => {
    if (Array.isArray(data)) setList(data);
  }, [data, setList]);

  useEffect(() => {
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

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("notifications:list", (items: NotificationItem[]) => {
      setList(Array.isArray(items) ? items : []);
      mutate(items as any, false);
    });

    socket.on("notification:new", (n: NotificationItem) => {
      addItem(n);
    });

    return () => {
      setCachedToken(null);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userId, setList, addItem, mutate]);

  return { connected, loading: !!isValidating, error } as const;
}
