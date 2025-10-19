"use client";
import { create } from "zustand";

type AppSlice = {
  appReady: boolean;
  setReady: (v: boolean) => void;
  hideChrome: boolean;
  setHideChrome: (v: boolean) => void;
};

export const useAppStore = create<AppSlice>((set) => ({
  appReady: false,
  setReady: (v) => set({ appReady: v }),
  hideChrome: false,
  setHideChrome: (v) => set({ hideChrome: v }),
}));
