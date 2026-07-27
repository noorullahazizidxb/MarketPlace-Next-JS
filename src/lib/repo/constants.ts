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

export type Country = {
  name: string;
  iso: string;
  dialCode: string;
  flag?: string;
};

/** Minimal country list for CountryCodeSelector. */
export const COUNTRIES: Country[] = [
  { name: "Afghanistan", iso: "AF", dialCode: "+93" },
  { name: "United States", iso: "US", dialCode: "+1" },
  { name: "United Kingdom", iso: "GB", dialCode: "+44" },
  { name: "Germany", iso: "DE", dialCode: "+49" },
  { name: "Turkey", iso: "TR", dialCode: "+90" },
  { name: "Iran", iso: "IR", dialCode: "+98" },
  { name: "India", iso: "IN", dialCode: "+91" },
  { name: "United Arab Emirates", iso: "AE", dialCode: "+971" },
];

export function getCountryIsoFromFlagUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const match = url.match(/\/([a-z]{2})\.(png|svg|webp)/i);
  return match?.[1]?.toUpperCase();
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
