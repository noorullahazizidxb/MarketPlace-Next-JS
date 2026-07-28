"use client";

import * as React from "react";
import { resolveCountryByDialCode } from "./constants";
import type { Country } from "./types";
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

export function useCountrySelector({
  countries,
  selectedCode,
  preferredCountryIso,
  onSelect,
}: {
  countries: Country[];
  selectedCode: string;
  preferredCountryIso?: string | null;
  onSelect: (country: Country) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedCountry = React.useMemo(() => {
    return resolveCountryByDialCode(selectedCode, countries, preferredCountryIso);
  }, [countries, preferredCountryIso, selectedCode]);

  const filteredCountries = React.useMemo(() => {
    const term = searchTerm.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.dialCode.includes(searchTerm),
    );
  }, [countries, searchTerm]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (country: Country) => {
    onSelect(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  return {
    isOpen,
    searchTerm,
    selectedCountry,
    filteredCountries,
    dropdownRef,
    toggleDropdown,
    handleSelect,
    handleSearch: setSearchTerm,
  };
}
