"use client";
import { useEffect, useRef, useMemo } from "react";
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
 * Uses a stable key derived from path contents so repeated renders with
 * the same paths (even as new array references) do not re-schedule prefetch.
 */
export function usePrefetchOnIdle(paths: string[], enabled = true) {
  const router = useRouter();
  // Derive a stable string key from the paths contents
  const key = useMemo(() => paths.join("|"), [paths.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  // Keep a ref to current paths so the idle callback always uses latest values
  // without adding paths to the effect dependency array
  const pathsRef = useRef(paths);
  pathsRef.current = paths;

  useEffect(() => {
    if (!enabled || !pathsRef.current.length) return;
    let cancelled = false;
    runIdle(() => {
      if (cancelled) return;
      pathsRef.current.forEach((p) => {
        try { router.prefetch(p); } catch { }
      });
    });
    return () => { cancelled = true; };
    // key is a stable string derived from paths contents — safe to use as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key, router]);
}
