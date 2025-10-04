"use client";
import { create } from "zustand";
import { applyThemeTokens, applyThemeScales, applyThemeComponents } from "../theme/theme";

export type ThemeMode = "light" | "dark" | "system";

type ThemeSlice = {
  mode: ThemeMode;
  tokens: any | null;
  scales: any | null;
  components: any | null;
  setMode: (m: ThemeMode) => void;
  setTokens: (t: any | null) => void;
  setScales: (s: any | null) => void;
  setComponents: (c: any | null) => void;
  applyAll: () => void;
};

export const useThemeStore = create<ThemeSlice>()((set, get) => ({
  mode: "system",
      tokens: null,
      scales: null,
      components: null,
      setMode: (m) => {
        set({ mode: m });
        try {
          localStorage.setItem("theme-mode", m);
        } catch (_) {}
        const root = document.documentElement;
        if (m === "system") {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          root.classList.toggle("dark", prefersDark);
        } else {
          root.classList.toggle("dark", m === "dark");
        }
      },
      setTokens: (t) => set({ tokens: t }),
      setScales: (s) => set({ scales: s }),
      setComponents: (c) => set({ components: c }),
      applyAll: () => {
        const { tokens, scales, components } = get();
        if (tokens) applyThemeTokens(tokens);
        if (scales) applyThemeScales(scales);
        if (components) applyThemeComponents(components);
      },
}));

// A small manager component to sync class and apply variables on mount and when store changes
import { useEffect } from "react";

export function ThemeManager() {
  const { mode, applyAll, setMode } = useThemeStore();
  useEffect(() => {
    // On mount, read persisted mode and apply (ensures persisted theme on refresh)
    try {
      const saved = localStorage.getItem("theme-mode");
      if (saved && saved !== mode) {
        setMode(saved as any);
      } else if (!saved && mode === "system") {
        // if nothing saved, default to dark for initial run
        setMode("dark");
      }
    } catch (_) {}
    // toggle class based on mode
    const root = document.documentElement;
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => root.classList.toggle("dark", mq.matches);
      handler();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    root.classList.toggle("dark", mode === "dark");
    // no cleanup for explicit modes
  }, [mode, setMode]);

  useEffect(() => {
    applyAll();
  }, [applyAll]);

  return null;
}
