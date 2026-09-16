"use client";
import { io, Socket } from "socket.io-client";
import { isSocketIoEnabled } from "./realtime";

let socket: Socket | undefined;

function socketOrigin(): string {
  return (
    (process.env.NEXT_PUBLIC_WS_URL as string) ||
    (process.env.NEXT_PUBLIC_SOCKET_URL as string) ||
    (process.env.NEXT_PUBLIC_API_BASE as string)?.replace(/\/api$/, "") ||
    (process.env.NEXT_PUBLIC_API_BASE_URL as string)?.replace(/\/api$/, "") ||
    "http://localhost:4000"
  );
}

export function initSocket(token?: string): Socket | undefined {
  if (!isSocketIoEnabled()) return undefined;

  const url = socketOrigin();
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
    socket.on("connect_error", () => {
      // Expected when the API has sockets off; do not spam the console.
    });
  } else {
    (socket as any).auth = token
      ? { token: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
      : undefined;
    try {
      socket.connect();
    } catch {
      /* ignore */
    }
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
