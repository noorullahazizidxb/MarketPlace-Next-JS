"use client";

import React, { PropsWithChildren, useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { subscribeToAuthEvents } from "@/lib/auth/session-client";

/**
 * Theme bootstrap via theme-data/Zustand HSL dual stack was removed.
 * Theme comes solely from ui-context + ThemeProvider.applyThemeSettings.
 */
export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => queryClient);
  // Cross-tab sign-out: a sign-out in one tab signs out every open tab.
  useEffect(() => subscribeToAuthEvents(), []);

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
