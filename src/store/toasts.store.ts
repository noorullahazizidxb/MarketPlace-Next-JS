"use client";
import { create } from "zustand";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  durationMs?: number;
};

type ToastsSlice = {
  toasts: Toast[];
  add: (toast: Toast) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToastsStore = create<ToastsSlice>((set) => ({
  toasts: [],
  add: (toast) => set((s) => ({ toasts: [...s.toasts, toast] })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
