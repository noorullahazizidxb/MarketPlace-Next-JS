"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./use-auth";
import { useApiGet } from "./api-hooks";
import { setCachedToken } from "./axiosClient";

type Blog = any;

export function usePendingBlogs() {
  const { token, isAdmin, loading } = useAuth();
  const [liveBlogs, setLiveBlogs] = useState<Blog[] | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const { data, error, isFetching: isValidating, mutate } = useApiGet(
    token && isAdmin ? ["pending-blogs"] : null,
    "/blogs/pending"
  );
  const baseBlogs = useMemo(
    () => (Array.isArray(data) ? (data as Blog[]) : []),
    [data]
  );
  const baseBlogsRef = useRef<Blog[]>(baseBlogs);

  useEffect(() => {
    baseBlogsRef.current = baseBlogs;
  }, [baseBlogs]);

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) return;
    if (!token) return;

    if (token) {
      setCachedToken(
        token.startsWith("Bearer ") ? token.replace(/^Bearer /i, "") : token
      );
    }

    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
      {
        auth: { token: bearer },
        query: { token: bearer },
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      }
    );
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("pending-blogs", (payload: Blog[]) => {
      setLiveBlogs(payload || []);
      mutate(payload, false);
    });

    socket.on("pending-blog:new", (item: Blog) => {
      setLiveBlogs((prev) => {
        const source = prev ?? baseBlogsRef.current;
        const exists = source.some((p: any) => p.id === (item as any)?.id);
        if (exists) return source;
        const next = [item, ...source];
        mutate(next, false);
        return next;
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      setCachedToken(null);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, isAdmin, loading, mutate]);

  const refresh = useCallback(async () => {
    if (!isAdmin) return;
    await mutate();
  }, [isAdmin, mutate]);

  const blogs = liveBlogs ?? baseBlogs;

  return {
    blogs,
    loading: !!isValidating || loading,
    connected,
    error,
    refresh,
  } as const;
}
