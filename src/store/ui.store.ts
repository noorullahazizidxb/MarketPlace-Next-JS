"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UISlice = {
  mobileMenuOpen: boolean;
  profileMenuOpen: boolean;
  sidebarOpen: boolean;
  density: 'comfort' | 'compact';
  setMobileMenu: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setProfileMenu: (open: boolean) => void;
  setSidebar: (open: boolean) => void;
  setDensity: (d: 'comfort' | 'compact') => void;
  toggleDensity: () => void;
};

export const useUIStore = create<UISlice>()(
  persist(
    (set, get) => ({
      mobileMenuOpen: false,
      profileMenuOpen: false,
      sidebarOpen: false,
      density: 'comfort',
      setMobileMenu: (open) => set({ mobileMenuOpen: open }),
      toggleMobileMenu: () => set({ mobileMenuOpen: !get().mobileMenuOpen }),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),
      setProfileMenu: (open) => set({ profileMenuOpen: open }),
      setSidebar: (open) => set({ sidebarOpen: open }),
      setDensity: (d) => set({ density: d }),
      toggleDensity: () => set({ density: get().density === 'comfort' ? 'compact' : 'comfort' }),
    }),
    { name: "ui-store" }
  )
);
