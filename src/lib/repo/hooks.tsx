"use client";

import * as React from "react";
import { COUNTRIES } from "./constants";
import type { Country } from "./constants";
import { ThemeProvider, useTheme } from "./theme";
import { useCircularTransition } from "../theme/use-circular-transition";
import { useThemeManager } from "../theme/use-theme-manager";
import { SidebarConfigProvider } from "../theme/sidebar/sidebar-context";
import { useSidebarConfig as useThemeSidebarConfig } from "../theme/sidebar/use-sidebar-config";
import { useIsMobile } from "../theme/sidebar/use-mobile";

export { ThemeProvider, useCircularTransition, useIsMobile, useTheme, useThemeManager };
export { SidebarConfigProvider };

export function useSidebarConfig() {
  const context = useThemeSidebarConfig();

  return React.useMemo(
    () => ({
      ...context,
      setConfig: context.updateConfig,
      setVariant: (
        variant: typeof context.config.variant,
      ) => context.updateConfig({ variant }),
      setCollapsible: (
        collapsible: typeof context.config.collapsible,
      ) => context.updateConfig({ collapsible }),
      setWidth: (width: typeof context.config.width) =>
        context.updateConfig({ width }),
      setSide: (side: typeof context.config.side) =>
        context.updateConfig({ side }),
    }),
    [context],
  );
}

export function useCountrySelector(initialIso = "AF") {
  const [iso, setIso] = React.useState(initialIso);
  const selectedCountry =
    COUNTRIES.find((country: Country) => country.iso === iso) ?? COUNTRIES[0];

  return {
    iso,
    setIso,
    dialCode: selectedCountry?.dialCode ?? "+93",
    open: false,
    setOpen: (_v: boolean) => undefined,
  };
}
