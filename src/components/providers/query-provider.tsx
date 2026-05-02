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

const THEME_CACHE_KEY = "active-theme-cache-v1";

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

const hasThemeContent = (source: unknown): boolean => {
  const first = Array.isArray(source) ? source[0] : source;
  if (!first || typeof first !== "object") return false;
  const candidate = first as {
    tokens?: unknown;
    scales?: unknown;
    components?: unknown;
  };
  const rawTokens =
    candidate.tokens && typeof candidate.tokens === "object"
      ? (candidate.tokens as { tokens?: unknown }).tokens ?? candidate.tokens
      : null;
  const hasTokens = !!(rawTokens && typeof rawTokens === "object");
  const hasScales = !!(candidate.scales && typeof candidate.scales === "object");
  const hasComponents = !!(
    candidate.components &&
    typeof candidate.components === "object"
  );
  return hasTokens || hasScales || hasComponents;
};

const readCachedTheme = (): unknown | null => {
  try {
    const raw = localStorage.getItem(THEME_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return hasThemeContent(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
};

const writeCachedTheme = (theme: unknown) => {
  try {
    if (!hasThemeContent(theme)) return;
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(theme));
  } catch (_) {
    // ignore cache write errors
  }
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

    const applyThemePayload = (source: unknown): boolean => {
      if (!mounted || !source) return false;
      const first = Array.isArray(source) ? source[0] : source;
      if (!first || typeof first !== "object") return false;
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
      return true;
    };

    // Prefer active theme first (cache/remote). Only use bundled default
    // when active theme is missing/invalid.
    void (async () => {
      let applied = false;
      try {
        const cached = readCachedTheme();
        if (cached) {
          applied = applyThemePayload(cached);
        }

        const raceProms: Promise<unknown>[] = [
          loadFileThemes(),
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error("theme-fetch-timeout")), 5000),
          ),
        ];
        const remote = await Promise.race(raceProms);
        if (hasThemeContent(remote)) {
          applied = applyThemePayload(remote) || applied;
          writeCachedTheme(remote);
        }
      } catch (_) {
        // keep prior applied theme (SSR/cache), then fallback if needed
      }

      if (!applied) {
        try {
          const local = await loadBundledThemeFallback();
          applied = applyThemePayload(local);
        } catch (_) {
          // fallback load failed — continue to set app ready
        }
      }

      if (mounted) useAppStore.getState().setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, [client]);

  return null;
}
