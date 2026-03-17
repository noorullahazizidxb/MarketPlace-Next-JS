"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Fallback for requestIdleCallback
function runIdle(cb: () => void, timeout = 2500) {
  if (typeof (window as any).requestIdleCallback === 'function') {
    (window as any).requestIdleCallback(cb, { timeout });
  } else {
    setTimeout(cb, 1200);
  }
}

/**
 * Prefetch multiple routes when browser is idle once.
 */
export function usePrefetchOnIdle(paths: string[], enabled = true) {
  const router = useRouter();
  const key = useMemo(() => paths.join("|"), [paths]);
  useEffect(() => {
    if (!enabled || !paths.length) return;
    let cancelled = false;
    runIdle(() => {
      if (cancelled) return;
      paths.forEach((p) => {
        try { router.prefetch(p); } catch {}
      });
    });
    return () => { cancelled = true; };
  }, [enabled, key, router, paths]);
}
