/**
 * Socket.IO is optional. Vercel (and local Vercel-like) sets
 * NEXT_PUBLIC_SOCKET_IO_ENABLED=false so the browser never opens a WS
 * that cannot exist on serverless.
 */
export function isSocketIoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SOCKET_IO_ENABLED !== "false";
}

export const SOCKET_POLL_INTERVAL_MS = 15_000;
