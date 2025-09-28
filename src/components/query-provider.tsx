"use client";

import React, { PropsWithChildren, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  fetchRemoteThemes,
  applyThemeTokens,
  applyThemeScales,
  applyThemeComponents,
  loadLocalPresets,
} from "@/lib/theme";
import { useAppStore } from "@/store/app.store";

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

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
    let completed = false;

    const applyThemePayload = (source: any) => {
      if (!mounted || !source) return;
      const first = Array.isArray(source) ? source[0] : source;
      if (!first) return;
      const rawTokens = (first as any)?.tokens;
      const normalized = rawTokens?.tokens ? rawTokens.tokens : rawTokens;
      const scales = (first as any)?.scales ?? rawTokens?.scales;
      const components = (first as any)?.components ?? rawTokens?.components;
      if (scales) applyThemeScales(scales);
      if (normalized) applyThemeTokens(normalized);
      if (components) applyThemeComponents(components);
    };

    const finalize = () => {
      if (!mounted || completed) return;
      completed = true;
      useAppStore.getState().setReady(true);
    };

    const safety = setTimeout(() => {
      if (!mounted || completed) return;
      void (async () => {
        try {
          const local = await loadLocalPresets();
          applyThemePayload(local);
        } catch (_) {
          // ignore, we'll still mark the app ready
        } finally {
          finalize();
        }
      })();
    }, 5000);

    (async () => {
      try {
        // Always fetch from /themes and apply, but don't block forever — use timeout
        const raceProms: Promise<any>[] = [
          fetchRemoteThemes(),
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error("theme-fetch-timeout")), 5000)
          ),
        ];
        const remote = await Promise.race(raceProms);
        applyThemePayload(remote);
      } catch (e) {
        // Try local presets as fallback so app doesn't block forever
        try {
          const local = await loadLocalPresets();
          applyThemePayload(local);
        } catch (_) {
          // ignore
        }
      } finally {
        clearTimeout(safety);
        finalize();
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(safety);
    };
  }, [client]);

  return null;
}
