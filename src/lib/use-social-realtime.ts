"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { setCachedToken } from "./axiosClient";
import { useAuth } from "./use-auth";
import { mutate as mutateSWR } from "swr";
import { Story, BlogSummary, CommentItem } from "../types/social";

/**
 * Subscribe to story/blog realtime events and reconcile SWR caches.
 * - storyCreated -> prepend to /stories cache
 * - blogUpdated -> patch /blogs and /blogs/:id cache
 * - newComment/newLike/newShare -> increment counts for the blog
 */
export function useSocialRealtime(enabled = true) {
  const { token, user } = useAuth();
  const sockRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!token) return;
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    setCachedToken(token.startsWith("Bearer ") ? token.replace(/^Bearer /i, "") : token);
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const socket = io(socketUrl, { auth: { token: bearer }, transports: ["websocket"] });
    sockRef.current = socket;

    socket.on("connect", () => {
      try { console.log("[social] connected"); } catch {}
    });

    socket.on("storyCreated", (s: Story) => {
      try {
        // mutate SWR key /stories: prepend optimistic
        mutateSWR(["stories"] as any, ((prev: any[] = []) => {
          // avoid duplicates
          if (prev.find((x) => x.id === s.id)) return prev;
          return [s, ...prev];
        }) as any, false);
      } catch {}
    });

    socket.on("blogUpdated", (b: BlogSummary) => {
      try {
        // update blog list
        mutateSWR(["blogs"] as any, ((prev: any[] = []) => {
          return prev.map((x) => (x.id === b.id ? { ...x, ...b } : x));
        }) as any, false);
        // update blog detail cache
  mutateSWR(["blogs", b.id] as any, ((prev: any) => ({ ...(prev || {}), ...b }) ) as any, false);
      } catch {}
    });

    socket.on("newComment", (c: CommentItem) => {
      try {
        const blogKey = ["blogs", c.blogId];
        // increment comments count in list
        mutateSWR(["blogs"] as any, ((prev: any[] = []) => {
          return prev.map((x) => {
            if (x.id !== c.blogId) return x;
            const counts = x.counts || { likes: 0, comments: 0, shares: 0 };
            return { ...x, counts: { ...counts, comments: (counts.comments || 0) + 1 } };
          });
        }) as any, false);
        // optionally append to blog detail comments cache if present
        mutateSWR(blogKey as any, ((prev: any) => {
          if (!prev) return prev;
          const next = { ...(prev as any) };
          next.comments = Array.isArray(next.comments) ? [c, ...next.comments] : [c];
          return next;
        }) as any, false);
      } catch {}
    });

    socket.on("newLike", (payload: { blogId: string }) => {
      try {
        mutateSWR(["blogs"] as any, ((prev: any[] = []) => {
          return prev.map((x) => {
            if (x.id !== payload.blogId) return x;
            const counts = x.counts || { likes: 0, comments: 0, shares: 0 };
            return { ...x, counts: { ...counts, likes: (counts.likes || 0) + 1 } };
          });
        }) as any, false);
        mutateSWR(["blogs", payload.blogId] as any, ((prev: any) => {
          if (!prev) return prev;
          const next = { ...(prev as any) };
          next.counts = next.counts || { likes: 0, comments: 0, shares: 0 };
          next.counts.likes = (next.counts.likes || 0) + 1;
          return next;
        }) as any, false);
      } catch {}
    });

    socket.on("newShare", (payload: { blogId: string }) => {
      try {
        mutateSWR(["blogs"] as any, ((prev: any[] = []) => {
          return prev.map((x) => {
            if (x.id !== payload.blogId) return x;
            const counts = x.counts || { likes: 0, comments: 0, shares: 0 };
            return { ...x, counts: { ...counts, shares: (counts.shares || 0) + 1 } };
          });
        }) as any, false);
        mutateSWR(["blogs", payload.blogId] as any, ((prev: any) => {
          if (!prev) return prev;
          const next = { ...(prev as any) };
          next.counts = next.counts || { likes: 0, comments: 0, shares: 0 };
          next.counts.shares = (next.counts.shares || 0) + 1;
          return next;
        }) as any, false);
      } catch {}
    });

    return () => {
      try {
        socket.disconnect();
      } catch {}
      sockRef.current = null;
      setCachedToken(null);
    };
  }, [enabled, token, user]);
}
