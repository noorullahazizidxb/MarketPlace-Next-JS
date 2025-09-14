"use client";

import React, { PropsWithChildren, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  fetchRemoteThemes,
  applyThemeTokens,
  applyThemeScales,
  applyThemeComponents,
} from "@/lib/theme";

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
    (async () => {
      try {
        // Always fetch from /themes and apply
        const remote = await fetchRemoteThemes();
        const first = Array.isArray(remote) ? remote[0] : remote;
        const rawTokens = (first as any)?.tokens;
        const normalized = rawTokens?.tokens ? rawTokens.tokens : rawTokens;
        const scales = (first as any)?.scales ?? rawTokens?.scales;
        const components = (first as any)?.components ?? rawTokens?.components;
        if (mounted) {
          if (scales) applyThemeScales(scales);
          if (normalized) applyThemeTokens(normalized);
          if (components) applyThemeComponents(components);
        }
      } catch (e) {
        // If remote fetch fails, cache may already have applied; otherwise CSS defaults apply
      }
    })();
    return () => {
      mounted = false;
    };
  }, [client]);

  return null;
}
