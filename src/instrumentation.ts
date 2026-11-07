import * as Sentry from '@sentry/nextjs';

/**
 * Next.js instrumentation hook: Sentry + graceful SIGTERM/SIGINT handling.
 * Next.js / Vercel own the process, so we never hard-exit here (exit: false).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
    const { registerGracefulShutdown } = await import('./lib/shutdown');
    registerGracefulShutdown({ exit: false, timeoutMs: 400, cleanups: [] });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
