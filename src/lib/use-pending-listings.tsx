"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./use-auth";
import { useApiGet } from "./api-hooks";
import { setCachedToken } from "./axiosClient";

type Listing = any;

export function usePendingListings() {
  const { token, isAdmin, loading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const { data, error, isValidating, mutate } = useApiGet(
    token && isAdmin ? ["pending-listings"] : null,
    "/listings/for-approval"
  );

  useEffect(() => {
    if (data && Array.isArray(data)) setListings(data as Listing[]);
  }, [data]);

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) return;
    if (!token) return;
    // ensure axios client sends Authorization header for API requests
    if (token) {
      setCachedToken(
        token.startsWith("Bearer ") ? token.replace(/^Bearer /i, "") : token
      );
    }

    // connect socket with Bearer token per server guidance (also accepted raw)
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

    socket.on("pending-listings", (payload: Listing[]) => {
      setListings(payload || []);
      // keep SWR cache in sync
      mutate(payload, false);
    });

    socket.on("pending-listing:new", (item: Listing) => {
      setListings((prev) => {
        const exists = prev.some((p: any) => p.id === (item as any)?.id);
        if (exists) return prev;
        const next = [item, ...prev];
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

  return {
    listings,
    loading: !!isValidating || loading,
    connected,
    error,
    refresh,
  } as const;
}
