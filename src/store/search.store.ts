"use client";
import { create } from "zustand";

type SearchFilters = Record<string, string | number | boolean | string[]>;

type SearchSlice = {
  query: string;
  filters: SearchFilters;
  recent: string[];
  setQuery: (q: string) => void;
  setFilters: (f: SearchFilters) => void;
  addRecent: (q: string) => void;
  clear: () => void;
};

export const useSearchStore = create<SearchSlice>((set, get) => ({
  query: "",
  filters: {},
  recent: [],
  setQuery: (q) => set({ query: q }),
  setFilters: (f) => set({ filters: f }),
  addRecent: (q) => set((s) => ({ recent: [q, ...s.recent.filter((r) => r !== q)].slice(0, 10) })),
  clear: () => set({ query: "", filters: {} }),
}));
