"use client";
import { create } from "zustand";

type AppSlice = {
  appReady: boolean;
  setReady: (v: boolean) => void;
};

export const useAppStore = create<AppSlice>((set) => ({
  appReady: false,
  setReady: (v) => set({ appReady: v }),
}));
