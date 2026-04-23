"use client";

import React, { PropsWithChildren, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  loadFileThemes,
  applyThemeTokens,
  applyThemeScales,
  applyThemeComponents,
  loadBundledThemeFallback,
} from "../../theme/theme";
import { useAppStore } from "@/store/app.store";
import { useThemeStore } from "@/store/theme.store";

const isPlainObject = (value: any) =>
  !!value && typeof value === "object" && !Array.isArray(value);

const deepMerge = (base: any, override: any): any => {
  if (!isPlainObject(base)) return override;
  if (!isPlainObject(override)) return base;
  const merged: Record<string, any> = { ...base };
  Object.keys(override).forEach((key) => {
    const left = merged[key];
    const right = override[key];
    if (isPlainObject(left) && isPlainObject(right)) {
      merged[key] = deepMerge(left, right);
      return;
    }
    merged[key] = right;
  });
  return merged;
};

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Prefetch themes on mount */}
      <ThemeBootstrap client={client} />
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

function ThemeBootstrap({ client }: { client: QueryClient }) {
  useEffect(() => {
    let mounted = true;

    const applyThemePayload = (source: any) => {
      if (!mounted || !source) return;
      const first = Array.isArray(source) ? source[0] : source;
      if (!first) return;
      const rawTokens = (first as any)?.tokens;
      const normalized = rawTokens?.tokens ? rawTokens.tokens : rawTokens;
      const scales = deepMerge(
        (first as any)?.scales || {},
        rawTokens?.scales || {},
      );
      const components = deepMerge(
        (first as any)?.components || {},
        rawTokens?.components || {},
      );
      const pref =
        rawTokens?.preferredColorMode ??
        (first as any)?.tokens?.preferredColorMode ??
        (first as any)?.preferredColorMode ??
        null;
      if (pref) {
        try {
          useThemeStore.getState().setPreferredColorMode(pref);
        } catch (_) { }
      }
      if (Object.keys(scales || {}).length > 0) applyThemeScales(scales);
      if (normalized) applyThemeTokens(normalized);
      if (Object.keys(components || {}).length > 0)
        applyThemeComponents(components);
    };

    // Step 1: Apply bundled theme immediately (no network) and mark app ready
    // so the UI renders without any delay even on slow networks.
    void (async () => {
      try {
        const local = await loadBundledThemeFallback();
        applyThemePayload(local);
      } catch (_) {
        // bundled fallback failed — continue anyway
      } finally {
        if (mounted) useAppStore.getState().setReady(true);
      }
    })();

    // Step 2: Load remote theme in the background and apply it as an update.
    // This never blocks rendering — it simply refines the theme once available.
    void (async () => {
      try {
        const raceProms: Promise<any>[] = [
          loadFileThemes(),
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error("theme-fetch-timeout")), 8000),
          ),
        ];
        const remote = await Promise.race(raceProms);
        applyThemePayload(remote);
      } catch (_) {
        // Remote theme unavailable — bundled theme already applied, no action needed.
      }
    })();

    return () => {
      mounted = false;
    };
  }, [client]);

  return null;
}
