"use client";
import { create } from "zustand";

export type ListingItem = any;

type ListingsSlice = {
  items: ListingItem[];
  set: (items: ListingItem[]) => void;
  clear: () => void;
};

export const useListingsStore = create<ListingsSlice>((set) => ({
  items: [],
  set: (items) => set({ items }),
  clear: () => set({ items: [] }),
}));
