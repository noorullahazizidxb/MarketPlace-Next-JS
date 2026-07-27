"use client";
import { PropsWithChildren } from "react";
import { ThemeManager } from "@/store/theme.store";
import { SidebarConfigProvider } from "@/lib/repo/hooks";
import { ThemeProvider as RepoThemeProvider } from "@/lib/repo/theme";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <RepoThemeProvider>
      <SidebarConfigProvider>
        <ThemeManager />
        {children}
      </SidebarConfigProvider>
    </RepoThemeProvider>
  );
}
