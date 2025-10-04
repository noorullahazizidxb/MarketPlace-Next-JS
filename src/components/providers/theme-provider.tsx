"use client";
import { PropsWithChildren } from "react";
import { ThemeManager } from "@/store/theme.store";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <>
      <ThemeManager />
      {children}
    </>
  );
}
