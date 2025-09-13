"use client";

import React, { PropsWithChildren, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  fetchRemoteThemes,
  loadLocalPresets,
  applyThemeTokens,
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
        const remote = await fetchRemoteThemes();
        const first = Array.isArray(remote) ? remote[0] : undefined;
        const rawTokens = first?.tokens;
        // Normalize remote shape: may be { id,name,scales, tokens: {light:{key:{css}}}} or directly {light:{key:{css}}}
        const normalized = rawTokens?.tokens ? rawTokens.tokens : rawTokens;
        if (normalized && mounted) {
          applyThemeTokens(normalized);
          try {
            localStorage.setItem("theme.source", "remote");
            const id = first?.id;
            if (id) localStorage.setItem("theme.id", String(id));
          } catch {}
          return;
        }
      } catch (e) {
        // ignore and fallback below
      }
      // Fallback to local
      try {
        const local = await loadLocalPresets();
        if (local && mounted) {
          applyThemeTokens(local);
          try {
            localStorage.setItem("theme.source", "local");
            localStorage.removeItem("theme.id");
          } catch {}
        }
      } catch (err) {
        console.warn("Failed to load local theme presets", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [client]);

  return null;
}
