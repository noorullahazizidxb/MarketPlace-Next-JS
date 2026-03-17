"use client";
import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";

export function useSocketEvent<T = any>(event: string, handler: (payload: T) => void) {
  const saved = useRef(handler);
  useEffect(() => { saved.current = handler; }, [handler]);

  useEffect(() => {
    const sock = getSocket();
    if (!sock) return;
    const cb = (p: T) => saved.current?.(p);
    sock.on(event, cb);
    return () => {
      try { sock.off(event, cb as any); } catch {}
    };
  }, [event]);
}
