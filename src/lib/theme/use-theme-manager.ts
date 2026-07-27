"use client";

import React from "react";
import { useTheme } from "./theme-context";
import { baseColors, colorThemes } from "@repo/constants";
import type {
  BrandColor,
  ColorTheme,
  ThemePreset,
  ImportedTheme,
} from "@repo/types";

export function useThemeManager() {
  const { theme, setTheme, themeSettings, updateThemeSettings } = useTheme();
  const brandColorsValues = themeSettings.brandColors ?? {};
  const setBrandColorsValues = React.useCallback(
    (values: Record<string, string>) => {
      updateThemeSettings({ brandColors: values });
    },
    [updateThemeSettings],
  );

  const isDarkMode = React.useMemo(() => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, [theme]);

  const resetTheme = React.useCallback(() => {
    const root = document.documentElement;
    const allPossibleVars = [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
      "border",
      "input",
      "ring",
      "radius",
      "chart-1",
      "chart-2",
      "chart-3",
      "chart-4",
      "chart-5",
      "sidebar",
      "sidebar-background",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
      "font-sans",
      "font-serif",
      "font-mono",
      "shadow-2xs",
      "shadow-xs",
      "shadow-sm",
      "shadow",
      "shadow-md",
      "shadow-lg",
      "shadow-xl",
      "shadow-2xl",
      "spacing",
      "tracking-normal",
      "card-header",
      "card-content",
      "card-footer",
      "muted-background",
      "accent-background",
      "destructive-background",
      "warning",
      "warning-foreground",
      "success",
      "success-foreground",
      "info",
      "info-foreground",
      "brand-gradient-start",
      "brand-gradient-end",
      "brand-gradient",
      "brand-glow",
    ];

    allPossibleVars.forEach((varName) => {
      root.style.removeProperty(`--${varName}`);
    });

    const inlineStyles = root.style;
    for (let i = inlineStyles.length - 1; i >= 0; i--) {
      const property = inlineStyles.item(i);
      if (!property) continue;

      if (property.startsWith("--")) {
        root.style.removeProperty(property);
      }
    }
  }, []);

  const updateBrandColorsFromTheme = React.useCallback(
    (styles: Record<string, string>) => {
      const newValues: Record<string, string> = {};
      baseColors.forEach((color: BrandColor) => {
        const cssVar = color.cssVar.replace("--", "");
        if (styles[cssVar]) {
          newValues[color.cssVar] = styles[cssVar];
        }
      });
      setBrandColorsValues(newValues);
    },
    [setBrandColorsValues],
  );

  const applyTheme = React.useCallback(
    (themeValue: string, darkMode: boolean) => {
      const themePreset = colorThemes.find(
        (preset: ColorTheme) => preset.value === themeValue,
      );
      if (!themePreset) return;

      resetTheme();
      const styles: Record<string, string> = darkMode
        ? themePreset.preset.styles.dark
        : themePreset.preset.styles.light;
      const root = document.documentElement;

      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
      // Do NOT populate brandColors from the preset — the preset selection is
      // already persisted via selectedTheme in ThemeSettings. applyThemeSettings
      // in ThemeProvider re-applies the correct per-mode preset vars on every
      // mode switch. Storing preset colors in brandColors would cause those
      // wrong-mode values to overwrite the correctly applied dark/light vars.
    },
    [resetTheme],
  );

  const applyTweakcnTheme = React.useCallback(
    (themePreset: ThemePreset, darkMode: boolean) => {
      resetTheme();
      const styles: Record<string, string> = darkMode
        ? themePreset.styles.dark
        : themePreset.styles.light;
      const root = document.documentElement;

      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
      // Do NOT populate brandColors from the preset — same reasoning as applyTheme.
    },
    [resetTheme],
  );

  const applyImportedTheme = React.useCallback(
    (themeData: ImportedTheme, darkMode: boolean) => {
      const root = document.documentElement;
      const themeVars = darkMode ? themeData.dark : themeData.light;

      Object.entries(themeVars).forEach(([variable, value]) => {
        root.style.setProperty(`--${variable}`, value);
      });
      // Do NOT populate brandColors from the imported preset — same reasoning
      // as applyTheme. importedTheme is already stored in ThemeSettings and
      // applyThemeSettings handles both modes from there.
    },
    [],
  );

  const applyRadius = (radius: string) => {
    document.documentElement.style.setProperty("--radius", radius);
  };

  const handleColorChange = (cssVar: string, value: string) => {
    document.documentElement.style.setProperty(cssVar, value);
    updateThemeSettings({
      brandColors: {
        ...brandColorsValues,
        [cssVar]: value,
      },
    });
  };

  return {
    theme,
    setTheme,
    isDarkMode,
    brandColorsValues,
    setBrandColorsValues,
    resetTheme,
    applyTheme,
    applyTweakcnTheme,
    applyImportedTheme,
    applyRadius,
    handleColorChange,
    updateBrandColorsFromTheme,
  };
}
