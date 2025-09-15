"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Session = {
  token: string;
  user: any | null;
};

type AuthSlice = {
  session: Session | null;
  setSession: (s: Session | null) => void;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set, get) => ({
      session: null,
      setSession: (s) => set({ session: s }),
      setToken: (token) =>
        set((state) => ({ session: token ? { token, user: state.session?.user ?? null } : null })),
      setUser: (user) => set((state) => ({ session: state.session ? { ...state.session, user } : { token: "", user } })),
      clear: () => set({ session: null }),
    }),
    { name: "auth-store" }
  )
);
