"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "./use-auth";
import { useApiGet } from "./api-hooks";
import { setCachedToken } from "./axiosClient";
import { isSocketIoEnabled } from "./realtime";
import { initSocket } from "./socket";

type Listing = any;

export function usePendingListings() {
  const { token, isAdmin, loading } = useAuth();
  const [liveListings, setLiveListings] = useState<Listing[] | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const { data, error, isFetching: isValidating, mutate } = useApiGet(
    token && isAdmin ? ["pending-listings"] : null,
    "/listings/for-approval"
  );
  const baseListings = useMemo(
    () => (Array.isArray(data) ? (data as Listing[]) : []),
    [data]
  );
  const baseListingsRef = useRef<Listing[]>(baseListings);

  useEffect(() => {
    baseListingsRef.current = baseListings;
  }, [baseListings]);

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

    socket.on("pending-listings", (payload: Listing[]) => {
      setLiveListings(payload || []);
      // keep SWR cache in sync
      mutate(payload, false);
    });

    socket.on("pending-listing:new", (item: Listing) => {
      setLiveListings((prev) => {
        const source = prev ?? baseListingsRef.current;
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
      socket.off("pending-listings");
      socket.off("pending-listing:new");
      socketRef.current = null;
    };
  }, [token, isAdmin, loading, mutate]);

  const refresh = useCallback(async () => {
    if (!isAdmin) return;
    await mutate();
  }, [isAdmin, mutate]);

  const listings = liveListings ?? baseListings;

  return {
    listings,
    loading: !!isValidating || loading,
    connected,
    error,
    refresh,
  } as const;
}
