/**
 * Graceful shutdown for Node.js processes (standalone servers and Vercel Functions).
 *
 * - Registers SIGTERM/SIGINT handlers once per process (guarded across module re-evaluation / HMR).
 * - On the first signal: stops accepting new connections (server.close), runs cleanups once,
 *   bounded by `timeoutMs`; repeated signals reuse the same in-flight shutdown.
 * - `exit: true` (default) exits with 0 on success, 1 on failure/timeout, only after cleanup settles.
 *   `exit: false` leaves exiting to the host (e.g. a framework that owns the process).
 */
export type Cleanup = () => unknown | Promise<unknown>;

export interface ClosableServer {
  close(callback?: (err?: Error) => void): unknown;
  closeIdleConnections?: () => void;
}

export interface ShutdownLogger {
  info?: (obj: object, msg: string) => void;
  error?: (obj: object, msg: string) => void;
}

export interface ShutdownOptions {
  server?: ClosableServer;
  cleanups?: Cleanup[];
  timeoutMs?: number;
  logger?: ShutdownLogger;
}

export interface ShutdownProcess {
  on(signal: string, listener: (signal: string) => void): unknown;
  off(signal: string, listener: (signal: string) => void): unknown;
  exit(code?: number): unknown;
  exitCode?: number | string | null;
}

export interface RegisterOptions extends ShutdownOptions {
  exit?: boolean;
  signals?: string[];
  proc?: ShutdownProcess;
}

export interface ShutdownHandle {
  shutdown: (signal?: string) => Promise<number>;
  dispose: () => void;
}

const REGISTRY_KEY = Symbol.for('app.gracefulShutdown.registered');
const DEFAULT_SIGNALS = ['SIGTERM', 'SIGINT'];

const consoleLogger: ShutdownLogger = {
  info: (obj, msg) => console.info(msg, obj),
  error: (obj, msg) => console.error(msg, obj),
};

function closeServer(server?: ClosableServer): Promise<void> {
  if (!server) return Promise.resolve();
  return new Promise((resolve, reject) => {
    server.close((err) =>
      err && (err as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING' ? reject(err) : resolve(),
    );
    server.closeIdleConnections?.();
  });
}

async function runCleanups(cleanups: Cleanup[], logger: ShutdownLogger): Promise<boolean> {
  let ok = true;
  for (const cleanup of cleanups) {
    try {
      await cleanup();
    } catch (err) {
      ok = false;
      logger.error?.({ err }, 'graceful shutdown: cleanup failed');
    }
  }
  return ok;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | 'timeout'> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<'timeout'>((resolve) => {
    timer = setTimeout(() => resolve('timeout'), timeoutMs);
    timer.unref?.();
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Pure shutdown routine (no signal wiring); resolves to the exit code it would use. */
export function createShutdown({
  server,
  cleanups = [],
  timeoutMs = 10_000,
  logger = consoleLogger,
}: ShutdownOptions = {}): (signal?: string) => Promise<number> {
  let pending: Promise<number> | undefined;
  return (signal = 'manual') => {
    if (pending) {
      logger.info?.({ signal }, 'graceful shutdown already in progress');
      return pending;
    }
    logger.info?.({ signal, timeoutMs }, 'graceful shutdown started');
    const work = (async () => {
      let ok = true;
      try {
        await closeServer(server);
      } catch (err) {
        ok = false;
        logger.error?.({ err }, 'graceful shutdown: server close failed');
      }
      return (await runCleanups(cleanups, logger)) && ok;
    })();
    pending = withTimeout(work, timeoutMs).then((result) => {
      if (result === 'timeout') {
        logger.error?.({ signal, timeoutMs }, 'graceful shutdown timed out');
        return 1;
      }
      logger.info?.({ signal, ok: result }, 'graceful shutdown complete');
      return result ? 0 : 1;
    });
    return pending;
  };
}

/**
 * Wire `createShutdown` to process signals. Safe to call repeatedly: only the first
 * registration per process is active; later calls return the existing handle.
 */
export function registerGracefulShutdown({
  exit = true,
  signals = DEFAULT_SIGNALS,
  proc = process as unknown as ShutdownProcess,
  ...options
}: RegisterOptions = {}): ShutdownHandle {
  const registry = proc as ShutdownProcess & { [REGISTRY_KEY]?: ShutdownHandle };
  const existing = registry[REGISTRY_KEY];
  if (existing) return existing;

  const shutdown = createShutdown(options);
  const onSignal = (signal: string) => {
    void shutdown(signal).then((code) => {
      if (exit) proc.exit(code);
      else proc.exitCode = code;
    });
  };
  signals.forEach((signal) => proc.on(signal, onSignal));

  const handle: ShutdownHandle = {
    shutdown,
    dispose() {
      signals.forEach((signal) => proc.off(signal, onSignal));
      delete registry[REGISTRY_KEY];
    },
  };
  registry[REGISTRY_KEY] = handle;
  return handle;
}
