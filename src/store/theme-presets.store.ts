"use client";
import { create } from "zustand";
import { fetchUiContextState, patchUiContextState } from "@/lib/theme/persistence-adapter";
import {
  createCustomThemePreset,
  updateCustomThemePreset,
  deleteCustomThemePreset,
  swapThemePresetModes,
  cloneThemePresetStyles,
  type ThemePresetStyles,
} from "@/lib/theme/ui-context/preset-store";
import type { CustomThemePreset } from "@/lib/theme/theme-customizer-types";

interface ThemePresetsState {
  presets: CustomThemePreset[];
  isLoading: boolean;
  error: string | null;

  /** Load presets from persisted ui-context (call once on app init). */
  loadPresets: () => Promise<void>;

  /** Create and persist a new preset. Returns the new preset. */
  createPreset: (name: string, styles: ThemePresetStyles) => Promise<CustomThemePreset>;

  /** Update name or styles of an existing preset. */
  updatePreset: (id: string, patch: Partial<Pick<CustomThemePreset, "name" | "styles">>) => Promise<void>;

  /** Delete a preset by id. */
  deletePreset: (id: string) => Promise<void>;

  /** Swap light and dark color tokens for a preset. */
  swapModes: (id: string) => Promise<void>;
}

export const useThemePresetsStore = create<ThemePresetsState>((set, get) => ({
  presets: [],
  isLoading: false,
  error: null,

  async loadPresets() {
    set({ isLoading: true, error: null });
    try {
      const state = await fetchUiContextState();
      set({ presets: state?.customPresets ?? [], isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  async createPreset(name, styles) {
    const newPreset = createCustomThemePreset({ name, styles: cloneThemePresetStyles(styles) });
    const presets = [...get().presets, newPreset];
    set({ presets });
    await patchUiContextState({ customPresets: presets });
    return newPreset;
  },

  async updatePreset(id: string, patch: Partial<Pick<CustomThemePreset, "name" | "styles">>) {
    const existing = get().presets.find((p) => p.id === id);
    if (!existing) return;
    const update = { name: patch.name ?? existing.name, styles: patch.styles ?? existing.styles };
    const presets = updateCustomThemePreset(get().presets, id, update);
    set({ presets });
    await patchUiContextState({ customPresets: presets });
  },

  async deletePreset(id) {
    const presets = deleteCustomThemePreset(get().presets, id);
    set({ presets });
    await patchUiContextState({ customPresets: presets });
  },

  async swapModes(id: string) {
    const existing = get().presets.find((p) => p.id === id);
    if (!existing) return;
    const swapped = swapThemePresetModes({ source: existing, name: existing.name });
    const presets = get().presets.map((p) => (p.id === id ? swapped : p));
    set({ presets });
    await patchUiContextState({ customPresets: presets });
  },
}));
