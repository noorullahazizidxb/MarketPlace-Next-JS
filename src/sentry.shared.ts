/** Shared Sentry options used by the browser, Node, and Edge runtimes. */
export function sentryCommonOptions() {
  const isDev = process.env.NODE_ENV === 'development';
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: isDev ? 1 : 0.1,
    sendDefaultPii: false,
  };
}
