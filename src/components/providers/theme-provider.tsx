"use client";

import { PropsWithChildren } from "react";
import { SidebarConfigProvider } from "@/lib/repo/hooks";
import { ThemeProvider as RepoThemeProvider } from "@/lib/repo/theme";
import type { ThemeSettings } from "@repo/types";

type ThemeProviderProps = PropsWithChildren<{
  initialThemeSettings?: ThemeSettings;
}>;

/**
 * Single theme path: ui-context JSON → ThemeProvider.applyThemeSettings.
 * Legacy Zustand ThemeManager / theme-data HSL dual stack removed.
 */
export function ThemeProvider({
  children,
  initialThemeSettings,
}: ThemeProviderProps) {
  return (
    <RepoThemeProvider initialThemeSettings={initialThemeSettings}>
      <SidebarConfigProvider>{children}</SidebarConfigProvider>
    </RepoThemeProvider>
  );
}
