"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

export function initSocket(token?: string): Socket {
  const url =
    (process.env.NEXT_PUBLIC_WS_URL as string) ||
    (process.env.NEXT_PUBLIC_SOCKET_URL as string) ||
    (process.env.NEXT_PUBLIC_API_BASE as string)?.replace(/\/api$/, "") ||
    (process.env.NEXT_PUBLIC_API_BASE_URL as string)?.replace(/\/api$/, "") ||
    "http://localhost:4000";
  if (!url) {
    console.warn("[socket] NEXT_PUBLIC_WS_URL not set");
  }
  if (!socket) {
    socket = io(url, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      auth: token
        ? { token: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
        : undefined,
    });
  } else {
    // Update token on existing socket and reconnect
    (socket as any).auth = token
      ? { token: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
      : undefined;
    try { socket.connect(); } catch {}
  }
  return socket;
}

export function getSocket(): Socket | undefined {
  return socket;
}

export function on<T = any>(event: string, handler: (p: T) => void): void {
  if (!socket) return;
  socket.on(event, handler);
}

export function off<T = any>(event: string, handler: (p: T) => void): void {
  if (!socket) return;
  socket.off(event, handler as any);
}
