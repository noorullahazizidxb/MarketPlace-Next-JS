export * from "../theme/presets/theme-data";
export * from "../theme/presets/theme-customizer-constants";
export * from "../theme/ui-context-defaults";
export * from "../theme/layout-density-resolver";

import {
  sidebarCollapsibleOptions,
  sidebarSideOptions,
  sidebarVariants,
} from "../theme/presets/theme-customizer-constants";
import { sidebarWidthValues } from "../theme/ui-context-defaults";
import type { Country } from "./types";
import { COUNTRIES } from "./phone-countries";

export type { Country } from "./types";
export { COUNTRIES } from "./phone-countries";

const FLAG_ISO_PATTERN = /flagcdn\.com\/([a-z]{2})\.svg/i;

/** Extracts ISO 3166-1 alpha-2 from a flagcdn.com flag URL. */
export function getCountryIsoFromFlagUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const match = url.match(FLAG_ISO_PATTERN) ?? url.match(/\/([a-z]{2})\.(png|svg|webp)/i);
  return match?.[1]?.toUpperCase();
}

function findCountriesByDialCode(dialCode: string, countries: Country[]): Country[] {
  return countries.filter((item) => item.dialCode === dialCode);
}

/** Finds the best matching country entry for a dial code and optional ISO hint. */
export function resolveCountryByDialCode(
  dialCode: string,
  countries: Country[] = COUNTRIES,
  preferredCountryIso?: string | null,
): Country | undefined {
  const dialMatches = findCountriesByDialCode(dialCode, countries);
  if (dialMatches.length === 1) return dialMatches[0];

  const normalizedIso = preferredCountryIso?.trim().toUpperCase();
  if (normalizedIso && dialMatches.length > 0) {
    const byIso = dialMatches.find(
      (item) => getCountryIsoFromFlagUrl(item.flag) === normalizedIso,
    );
    if (byIso) return byIso;
  }

  if (dialMatches.length > 0) return dialMatches[0];

  return countries.find((item) => item.code === dialCode) ?? countries[0];
}

export type SidebarWidthKey = keyof typeof sidebarWidthValues;

export const SIDEBAR_WIDTH_OPTIONS = [
  { value: "compact" as const, label: "Compact" },
  { value: "comfortable" as const, label: "Comfortable" },
  { value: "spacious" as const, label: "Spacious" },
];

export const SIDEBAR_VARIANT_OPTIONS = sidebarVariants;
export const SIDEBAR_COLLAPSIBLE_OPTIONS = sidebarCollapsibleOptions;
export const SIDEBAR_SIDE_OPTIONS = sidebarSideOptions;
