import type {
  CustomThemePreset,
  ImportedTheme,
  ThemeStyleMode,
} from "../theme-customizer-types";

export type ThemePresetStyles = ImportedTheme;

export function cloneThemePresetStyles(
  styles: ThemePresetStyles,
): ThemePresetStyles {
  return {
    light: { ...(styles.light ?? {}) },
    dark: { ...(styles.dark ?? {}) },
  };
}

function createPresetId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `theme-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createCustomThemePreset({
  name,
  styles,
  sourcePresetId = null,
  id = createPresetId(),
  now = new Date().toISOString(),
}: {
  name: string;
  styles: ThemePresetStyles;
  sourcePresetId?: string | null;
  id?: string;
  now?: string;
}): CustomThemePreset {
  return {
    id,
    name: name.trim(),
    styles: cloneThemePresetStyles(styles),
    sourcePresetId,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Clone the complete preset before changing one mode. The untouched mode is
 * copied byte-for-byte into the new preset instead of being rebuilt from defaults.
 */
export function cloneThemePresetWithModePatch({
  source,
  name,
  mode,
  patch,
}: {
  source: Pick<CustomThemePreset, "id" | "styles">;
  name: string;
  mode: ThemeStyleMode;
  patch: Record<string, string>;
}) {
  const styles = cloneThemePresetStyles(source.styles);
  styles[mode] = { ...styles[mode], ...patch };
  return createCustomThemePreset({
    name,
    styles,
    sourcePresetId: source.id,
  });
}

export function swapThemePresetModes({
  source,
  name,
}: {
  source: Pick<CustomThemePreset, "id" | "styles">;
  name: string;
}) {
  return createCustomThemePreset({
    name,
    sourcePresetId: source.id,
    styles: {
      light: { ...source.styles.dark },
      dark: { ...source.styles.light },
    },
  });
}

export function updateCustomThemePreset(
  presets: CustomThemePreset[],
  id: string,
  update: { name: string; styles: ThemePresetStyles },
) {
  const updatedAt = new Date().toISOString();
  return presets.map((preset) =>
    preset.id === id
      ? {
          ...preset,
          name: update.name.trim(),
          styles: cloneThemePresetStyles(update.styles),
          updatedAt,
        }
      : {
          ...preset,
          styles: cloneThemePresetStyles(preset.styles),
        },
  );
}

export function deleteCustomThemePreset(
  presets: CustomThemePreset[],
  id: string,
) {
  return presets
    .filter((preset) => preset.id !== id)
    .map((preset) => ({
      ...preset,
      styles: cloneThemePresetStyles(preset.styles),
    }));
}

export function normalizeThemeTokenRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Theme tokens must be a JSON object.");
  }

  const entries = Object.entries(value).map(([key, token]) => {
    if (typeof token !== "string") {
      throw new Error(`Token “${key}” must contain a string value.`);
    }
    return [key.replace(/^--/, ""), token.trim()] as const;
  });

  return Object.fromEntries(entries.filter(([, token]) => token.length > 0));
}
