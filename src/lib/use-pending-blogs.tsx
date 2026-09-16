"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "./use-auth";
import { useApiGet } from "./api-hooks";
import { setCachedToken } from "./axiosClient";
import { isSocketIoEnabled } from "./realtime";
import { initSocket } from "./socket";

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
    if (!isSocketIoEnabled()) return;
    setCachedToken(
      token.startsWith("Bearer ") ? token.replace(/^Bearer /i, "") : token
    );
    const socket = initSocket(token);
    if (!socket) return;
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
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pending-blogs");
      socket.off("pending-blog:new");
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
