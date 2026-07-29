import {
  brandThemes,
  colorThemes,
  sidebarThemes,
  tweakcnThemes,
} from "./presets/theme-data";
import type { ThemeSettings } from "./types";

export type ResolvedThemePreset = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

/**
 * The single preset-priority contract used by both SSR and the client.
 * Imported themes intentionally win, followed by the four built-in families.
 */
export function resolveThemePresetStyles(
  settings: ThemeSettings,
): ResolvedThemePreset | null {
  if (settings.importedTheme) {
    return {
      light: settings.importedTheme.light as Record<string, string>,
      dark: settings.importedTheme.dark as Record<string, string>,
    };
  }

  const candidates = [
    [settings.selectedTweakcnTheme, tweakcnThemes],
    [settings.selectedBrandTheme, brandThemes],
    [settings.selectedSidebarTheme, sidebarThemes],
    [settings.selectedTheme, colorThemes],
  ] as const;

  for (const [selectedValue, themes] of candidates) {
    if (!selectedValue) continue;
    const preset = themes.find((theme) => theme.value === selectedValue)?.preset;
    if (preset) {
      return {
        light: preset.styles.light as Record<string, string>,
        dark: preset.styles.dark as Record<string, string>,
      };
    }
  }

  return null;
}

const appliedThemeVariableNames = new Set<string>();

/**
 * Replaces only variables previously owned by the theme engine. It never
 * sweeps every inline custom property, so unrelated runtime variables survive.
 */
export function replaceAppliedThemeVariables(
  root: HTMLElement,
  variables: Record<string, string | null | undefined>,
): void {
  for (const variable of appliedThemeVariableNames) {
    root.style.removeProperty(`--${variable}`);
  }
  appliedThemeVariableNames.clear();

  for (const [rawName, value] of Object.entries(variables)) {
    if (!value) continue;
    const name = rawName.startsWith("--") ? rawName.slice(2) : rawName;
    root.style.setProperty(`--${name}`, value);
    appliedThemeVariableNames.add(name);
  }
}
