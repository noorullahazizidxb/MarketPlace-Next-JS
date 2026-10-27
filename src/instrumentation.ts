/**
 * Next.js instrumentation hook: runs once per server instance.
 * Registers graceful SIGTERM/SIGINT handling on the Node.js runtime only (not Edge).
 * Next.js / Vercel own the process, so we never hard-exit here (exit: false); we only run
 * cleanups within the ~500ms Vercel allows after SIGTERM.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { registerGracefulShutdown } = await import('./lib/shutdown');
  registerGracefulShutdown({ exit: false, timeoutMs: 400, cleanups: [] });
}
