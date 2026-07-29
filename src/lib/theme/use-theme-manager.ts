"use client";

import * as React from "react";
import { useTheme } from "./theme-context";

/**
 * Small customizer adapter. Theme application belongs exclusively to
 * ThemeProvider; controls update settings and the provider performs one
 * deterministic DOM update.
 */
export function useThemeManager() {
  const { theme, setTheme, themeSettings, updateThemeSettings } = useTheme();
  const brandColorsValues = themeSettings.brandColors;

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

  const handleColorChange = React.useCallback(
    (cssVar: string, value: string) => {
      updateThemeSettings({
        brandColors: {
          ...brandColorsValues,
          [cssVar]: value,
        },
      });
    },
    [brandColorsValues, updateThemeSettings],
  );

  return {
    theme,
    setTheme,
    isDarkMode,
    brandColorsValues,
    setBrandColorsValues,
    handleColorChange,
  };
}
