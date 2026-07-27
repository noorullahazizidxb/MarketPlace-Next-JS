import { shadcnThemePresets } from "./shadcn-ui-theme-presets-with-sidebar";
import { shadcnThemePresetsV2 } from "./shadcn-ui-theme-presets-v2";
import { tweakcnPresets } from "./tweakcn-theme-presets";
import brandPresets from "./brand-theme-presets";
import type { ColorTheme } from "@repo/types";

const BRAND_DEFAULTS = {
  light: {
    "brand-gradient-start": "oklch(0.54 0.24 280)",
    "brand-gradient-end": "oklch(0.46 0.26 265)",
    "brand-glow": "oklch(0.54 0.24 280 / 0.50)",
  },
  dark: {
    "brand-gradient-start": "oklch(0.73 0.18 272)",
    "brand-gradient-end": "oklch(0.63 0.2 248)",
    "brand-glow": "oklch(0.73 0.18 272 / 0.50)",
  },
} as const;

const OTA_DEFAULTS = {
  light: {
    success: "oklch(0.55 0.16 155)",
    "success-foreground": "oklch(0.98 0 0)",
    warning: "oklch(0.75 0.15 70)",
    "warning-foreground": "oklch(0.25 0.05 70)",
    info: "oklch(0.55 0.15 240)",
    "info-foreground": "oklch(0.98 0 0)",
    price: "oklch(0.45 0.14 155)",
    "price-sale": "oklch(0.55 0.2 25)",
    "price-original": "oklch(0.55 0 0)",
    "price-highlight-bg": "oklch(0.92 0.05 155)",
    "switch-track-off": "oklch(0.9 0 0)",
    "switch-track-off-border": "oklch(0.82 0 0)",
    "switch-track-on": "oklch(0.65 0.2 42)",
    "switch-track-on-border": "oklch(0.58 0.22 42)",
    "switch-thumb": "oklch(1 0 0)",
    "switch-thumb-on": "oklch(1 0 0)",
    "switch-ring": "oklch(0.65 0.2 42 / 35%)",
    "scrollbar-track": "oklch(0.96 0 0)",
    "scrollbar-thumb": "oklch(0.85 0 0)",
    "scrollbar-thumb-hover": "oklch(0.75 0 0)",
    skeleton: "oklch(0.94 0 0)",
    "skeleton-shimmer": "oklch(0.98 0 0)",
    "badge-cheap": "oklch(0.92 0.06 155)",
    "badge-cheap-text": "oklch(0.35 0.12 155)",
    "badge-best": "oklch(0.92 0.08 42)",
    "badge-best-text": "oklch(0.45 0.18 42)",
    "badge-fast": "oklch(0.92 0.06 240)",
    "badge-fast-text": "oklch(0.4 0.12 240)",
    "airline-logo-bg": "oklch(0.97 0 0)",
    "layover-line": "oklch(0.85 0 0)",
    "selected-flight": "oklch(0.96 0.03 42)",
    "selected-flight-border": "oklch(0.65 0.2 42)",
    chip: "oklch(0.965 0 0)",
    "chip-foreground": "oklch(0.3 0 0)",
    "chip-selected": "oklch(0.65 0.2 42)",
    "chip-selected-foreground": "oklch(0.98 0 0)",
  },
  dark: {
    success: "oklch(0.65 0.18 155)",
    "success-foreground": "oklch(0.15 0.05 155)",
    warning: "oklch(0.75 0.15 85)",
    "warning-foreground": "oklch(0.2 0.05 85)",
    info: "oklch(0.65 0.15 240)",
    "info-foreground": "oklch(0.15 0.05 240)",
    price: "oklch(0.75 0.16 145)",
    "price-sale": "oklch(0.7 0.18 45)",
    "price-original": "oklch(0.55 0.02 250)",
    "price-highlight-bg": "oklch(0.28 0.03 260)",
    "switch-track-off": "oklch(0.28 0.02 260)",
    "switch-track-off-border": "oklch(0.38 0.02 260)",
    "switch-track-on": "oklch(0.7 0.18 45)",
    "switch-track-on-border": "oklch(0.78 0.14 45)",
    "switch-thumb": "oklch(0.95 0 0)",
    "switch-thumb-on": "oklch(0.15 0 0)",
    "switch-ring": "oklch(0.7 0.18 45 / 40%)",
    "scrollbar-track": "oklch(0.18 0.02 260)",
    "scrollbar-thumb": "oklch(0.32 0.02 260)",
    "scrollbar-thumb-hover": "oklch(0.42 0.02 260)",
    skeleton: "oklch(0.25 0.02 260)",
    "skeleton-shimmer": "oklch(0.35 0.02 260)",
    "badge-cheap": "oklch(0.35 0.12 155)",
    "badge-cheap-text": "oklch(0.92 0.06 155)",
    "badge-best": "oklch(0.45 0.18 42)",
    "badge-best-text": "oklch(0.92 0.08 42)",
    "badge-fast": "oklch(0.4 0.12 240)",
    "badge-fast-text": "oklch(0.92 0.06 240)",
    "airline-logo-bg": "oklch(0.2 0.025 260)",
    "layover-line": "oklch(0.35 0.02 260 / 40%)",
    "selected-flight": "oklch(0.28 0.04 260)",
    "selected-flight-border": "oklch(0.7 0.18 45)",
    chip: "oklch(0.25 0.03 260)",
    "chip-foreground": "oklch(0.9 0.01 250)",
    "chip-selected": "oklch(0.7 0.18 45)",
    "chip-selected-foreground": "oklch(0.15 0.02 45)",
  },
} as const;

const toOklchGlow = (color: string, fallback: string): string => {
  const trimmedColor = color.trim();
  if (!trimmedColor.startsWith("oklch(")) {
    return fallback;
  }

  if (trimmedColor.includes("/")) {
    return trimmedColor;
  }

  return trimmedColor.replace(/\)$/, " / 0.25)");
};

/**
 * Derives themed sidebar CSS variables from a theme's primary / background
 * tokens when the preset does not already define them.
 *
 * Design rules
 * ─────────────
 * • Light mode  → sidebar is lightly tinted with the primary hue so it is
 *   visually distinct from the plain white canvas background.
 * • Dark mode   → sidebar is a deep, slightly-saturated panel that contrasts
 *   with the dark card surface.
 */
const withSidebarVariables = <
  T extends { styles: { light: Record<string, string>; dark: Record<string, string> } },
>(
  preset: T,
): T => {
  const hasSidebarVars =
    "sidebar" in preset.styles.light || "sidebar" in preset.styles.dark;

  // Already has explicit sidebar vars – don't overwrite.
  if (hasSidebarVars) return preset;

  // ── Extract primary hue (H component) from the primary oklch value ──────
  const extractOklchHue = (oklchColor: string): number => {
    const re = /oklch\(\s*[\d.]+\s+[\d.]+\s+([\d.]+)/;
    const result = re.exec(oklchColor);
    if (result === null) return 0;
    const captured = result[1];
    if (captured === undefined) return 0;
    return Number(captured);
  };

  const lightPrimary = preset.styles.light.primary ?? "";
  const darkPrimary = preset.styles.dark.primary ?? "";
  const lightHue = extractOklchHue(lightPrimary);
  const darkHue = extractOklchHue(darkPrimary);

  // Derive tinted sidebar colors
  const lightSidebar = lightHue > 0
    ? `oklch(0.97 0.018 ${lightHue})`
    : "oklch(0.97 0 0)";
  const lightSidebarForeground = lightHue > 0
    ? `oklch(0.15 0.02 ${lightHue})`
    : "oklch(0.145 0 0)";
  const lightSidebarPrimary = lightPrimary || "oklch(0.205 0 0)";
  const lightSidebarPrimaryFg = preset.styles.light["primary-foreground"] ?? "oklch(0.985 0 0)";
  const lightSidebarAccent = lightHue > 0
    ? `oklch(0.92 0.025 ${lightHue})`
    : "oklch(0.94 0 0)";
  const lightSidebarAccentFg = lightHue > 0
    ? `oklch(0.22 0.04 ${lightHue})`
    : "oklch(0.205 0 0)";
  const lightSidebarBorder = lightHue > 0
    ? `oklch(0.88 0.02 ${lightHue})`
    : "oklch(0.90 0 0)";
  const lightSidebarRing = lightPrimary || "oklch(0.708 0 0)";

  const darkSidebar = darkHue > 0
    ? `oklch(0.17 0.04 ${darkHue})`
    : "oklch(0.175 0 0)";
  const darkSidebarForeground = "oklch(0.92 0.01 0)";
  const darkSidebarPrimary = darkHue > 0
    ? `oklch(0.65 0.22 ${darkHue})`
    : darkPrimary || "oklch(0.60 0 0)";
  const darkSidebarPrimaryFg = preset.styles.dark["primary-foreground"] ?? "oklch(0.985 0 0)";
  const darkSidebarAccent = darkHue > 0
    ? `oklch(0.26 0.06 ${darkHue})`
    : "oklch(0.27 0 0)";
  const darkSidebarAccentFg = "oklch(0.92 0.01 0)";
  const darkSidebarBorder = "oklch(1 0 0 / 10%)";
  const darkSidebarRing = darkSidebarPrimary;

  return {
    ...preset,
    styles: {
      light: {
        sidebar: lightSidebar,
        "sidebar-foreground": lightSidebarForeground,
        "sidebar-primary": lightSidebarPrimary,
        "sidebar-primary-foreground": lightSidebarPrimaryFg,
        "sidebar-accent": lightSidebarAccent,
        "sidebar-accent-foreground": lightSidebarAccentFg,
        "sidebar-border": lightSidebarBorder,
        "sidebar-ring": lightSidebarRing,
        ...preset.styles.light,
      },
      dark: {
        sidebar: darkSidebar,
        "sidebar-foreground": darkSidebarForeground,
        "sidebar-primary": darkSidebarPrimary,
        "sidebar-primary-foreground": darkSidebarPrimaryFg,
        "sidebar-accent": darkSidebarAccent,
        "sidebar-accent-foreground": darkSidebarAccentFg,
        "sidebar-border": darkSidebarBorder,
        "sidebar-ring": darkSidebarRing,
        ...preset.styles.dark,
      },
    },
  };
};

const withPremiumBrandVariables = <
  T extends { styles: { light: Record<string, string>; dark: Record<string, string> } },
>(
  preset: T,
): T => {
  const lightStart =
    preset.styles.light["brand-gradient-start"] ??
    preset.styles.light.primary ??
    BRAND_DEFAULTS.light["brand-gradient-start"];
  const lightEnd =
    preset.styles.light["brand-gradient-end"] ??
    preset.styles.light.accent ??
    BRAND_DEFAULTS.light["brand-gradient-end"];
  const darkStart =
    preset.styles.dark["brand-gradient-start"] ??
    preset.styles.dark.primary ??
    BRAND_DEFAULTS.dark["brand-gradient-start"];
  const darkEnd =
    preset.styles.dark["brand-gradient-end"] ??
    preset.styles.dark.accent ??
    BRAND_DEFAULTS.dark["brand-gradient-end"];

  const lightGlow =
    preset.styles.light["brand-glow"] ??
    toOklchGlow(lightStart, BRAND_DEFAULTS.light["brand-glow"]);
  const darkGlow =
    preset.styles.dark["brand-glow"] ??
    toOklchGlow(darkStart, BRAND_DEFAULTS.dark["brand-glow"]);

  const lightSuccess =
    preset.styles.light.success ?? preset.styles.light["chart-2"] ?? OTA_DEFAULTS.light.success;
  const darkSuccess =
    preset.styles.dark.success ?? preset.styles.dark["chart-2"] ?? OTA_DEFAULTS.dark.success;
  const lightWarning =
    preset.styles.light.warning ?? preset.styles.light["chart-5"] ?? OTA_DEFAULTS.light.warning;
  const darkWarning =
    preset.styles.dark.warning ?? preset.styles.dark["chart-5"] ?? OTA_DEFAULTS.dark.warning;
  const lightInfo =
    preset.styles.light.info ?? preset.styles.light["chart-3"] ?? OTA_DEFAULTS.light.info;
  const darkInfo =
    preset.styles.dark.info ?? preset.styles.dark["chart-3"] ?? OTA_DEFAULTS.dark.info;

  const lightSelectedFlight =
    preset.styles.light["selected-flight"] ?? preset.styles.light.accent ?? OTA_DEFAULTS.light["selected-flight"];
  const darkSelectedFlight =
    preset.styles.dark["selected-flight"] ?? preset.styles.dark.accent ?? OTA_DEFAULTS.dark["selected-flight"];

  return {
    ...preset,
    styles: {
      light: {
        ...preset.styles.light,
        "brand-gradient-start": lightStart,
        "brand-gradient-end": lightEnd,
        "brand-gradient":
          preset.styles.light["brand-gradient"] ??
          `linear-gradient(135deg, ${lightStart}, ${lightEnd})`,
        "brand-glow": lightGlow,
        success: lightSuccess,
        "success-foreground":
          preset.styles.light["success-foreground"] ??
          preset.styles.light["primary-foreground"] ??
          OTA_DEFAULTS.light["success-foreground"],
        warning: lightWarning,
        "warning-foreground":
          preset.styles.light["warning-foreground"] ??
          preset.styles.light.foreground ??
          OTA_DEFAULTS.light["warning-foreground"],
        info: lightInfo,
        "info-foreground":
          preset.styles.light["info-foreground"] ??
          preset.styles.light["primary-foreground"] ??
          OTA_DEFAULTS.light["info-foreground"],
        price: preset.styles.light.price ?? lightSuccess,
        "price-sale": preset.styles.light["price-sale"] ?? preset.styles.light.primary ?? OTA_DEFAULTS.light["price-sale"],
        "price-original":
          preset.styles.light["price-original"] ??
          preset.styles.light["muted-foreground"] ??
          OTA_DEFAULTS.light["price-original"],
        "price-highlight-bg":
          preset.styles.light["price-highlight-bg"] ??
          preset.styles.light.muted ??
          OTA_DEFAULTS.light["price-highlight-bg"],
        "switch-track-off":
          preset.styles.light["switch-track-off"] ??
          preset.styles.light.muted ??
          OTA_DEFAULTS.light["switch-track-off"],
        "switch-track-off-border":
          preset.styles.light["switch-track-off-border"] ??
          preset.styles.light.border ??
          OTA_DEFAULTS.light["switch-track-off-border"],
        "switch-track-on":
          preset.styles.light["switch-track-on"] ??
          preset.styles.light.primary ??
          OTA_DEFAULTS.light["switch-track-on"],
        "switch-track-on-border":
          preset.styles.light["switch-track-on-border"] ??
          preset.styles.light.ring ??
          OTA_DEFAULTS.light["switch-track-on-border"],
        "switch-thumb":
          preset.styles.light["switch-thumb"] ??
          preset.styles.light.background ??
          OTA_DEFAULTS.light["switch-thumb"],
        "switch-thumb-on":
          preset.styles.light["switch-thumb-on"] ??
          preset.styles.light["primary-foreground"] ??
          OTA_DEFAULTS.light["switch-thumb-on"],
        "switch-ring":
          preset.styles.light["switch-ring"] ??
          preset.styles.light.ring ??
          OTA_DEFAULTS.light["switch-ring"],
        "scrollbar-track":
          preset.styles.light["scrollbar-track"] ??
          preset.styles.light.muted ??
          OTA_DEFAULTS.light["scrollbar-track"],
        "scrollbar-thumb":
          preset.styles.light["scrollbar-thumb"] ??
          preset.styles.light.border ??
          OTA_DEFAULTS.light["scrollbar-thumb"],
        "scrollbar-thumb-hover":
          preset.styles.light["scrollbar-thumb-hover"] ??
          preset.styles.light["muted-foreground"] ??
          OTA_DEFAULTS.light["scrollbar-thumb-hover"],
        skeleton:
          preset.styles.light.skeleton ??
          preset.styles.light.muted ??
          OTA_DEFAULTS.light.skeleton,
        "skeleton-shimmer":
          preset.styles.light["skeleton-shimmer"] ??
          preset.styles.light.card ??
          OTA_DEFAULTS.light["skeleton-shimmer"],
        "badge-cheap":
          preset.styles.light["badge-cheap"] ??
          lightSuccess ??
          OTA_DEFAULTS.light["badge-cheap"],
        "badge-cheap-text":
          preset.styles.light["badge-cheap-text"] ??
          preset.styles.light["success-foreground"] ??
          OTA_DEFAULTS.light["badge-cheap-text"],
        "badge-best":
          preset.styles.light["badge-best"] ??
          preset.styles.light.primary ??
          OTA_DEFAULTS.light["badge-best"],
        "badge-best-text":
          preset.styles.light["badge-best-text"] ??
          preset.styles.light["primary-foreground"] ??
          OTA_DEFAULTS.light["badge-best-text"],
        "badge-fast":
          preset.styles.light["badge-fast"] ??
          lightInfo ??
          OTA_DEFAULTS.light["badge-fast"],
        "badge-fast-text":
          preset.styles.light["badge-fast-text"] ??
          preset.styles.light["info-foreground"] ??
          OTA_DEFAULTS.light["badge-fast-text"],
        "airline-logo-bg":
          preset.styles.light["airline-logo-bg"] ??
          preset.styles.light.card ??
          OTA_DEFAULTS.light["airline-logo-bg"],
        "layover-line":
          preset.styles.light["layover-line"] ??
          preset.styles.light.border ??
          OTA_DEFAULTS.light["layover-line"],
        "selected-flight": lightSelectedFlight,
        "selected-flight-border":
          preset.styles.light["selected-flight-border"] ??
          preset.styles.light.ring ??
          OTA_DEFAULTS.light["selected-flight-border"],
        chip:
          preset.styles.light.chip ??
          preset.styles.light.secondary ??
          OTA_DEFAULTS.light.chip,
        "chip-foreground":
          preset.styles.light["chip-foreground"] ??
          preset.styles.light["secondary-foreground"] ??
          OTA_DEFAULTS.light["chip-foreground"],
        "chip-selected":
          preset.styles.light["chip-selected"] ??
          preset.styles.light.primary ??
          OTA_DEFAULTS.light["chip-selected"],
        "chip-selected-foreground":
          preset.styles.light["chip-selected-foreground"] ??
          preset.styles.light["primary-foreground"] ??
          OTA_DEFAULTS.light["chip-selected-foreground"],
      },
      dark: {
        ...preset.styles.dark,
        "brand-gradient-start": darkStart,
        "brand-gradient-end": darkEnd,
        "brand-gradient":
          preset.styles.dark["brand-gradient"] ??
          `linear-gradient(135deg, ${darkStart}, ${darkEnd})`,
        "brand-glow": darkGlow,
        success: darkSuccess,
        "success-foreground":
          preset.styles.dark["success-foreground"] ??
          preset.styles.dark["primary-foreground"] ??
          OTA_DEFAULTS.dark["success-foreground"],
        warning: darkWarning,
        "warning-foreground":
          preset.styles.dark["warning-foreground"] ??
          preset.styles.dark.foreground ??
          OTA_DEFAULTS.dark["warning-foreground"],
        info: darkInfo,
        "info-foreground":
          preset.styles.dark["info-foreground"] ??
          preset.styles.dark["primary-foreground"] ??
          OTA_DEFAULTS.dark["info-foreground"],
        price: preset.styles.dark.price ?? darkSuccess,
        "price-sale": preset.styles.dark["price-sale"] ?? preset.styles.dark.primary ?? OTA_DEFAULTS.dark["price-sale"],
        "price-original":
          preset.styles.dark["price-original"] ??
          preset.styles.dark["muted-foreground"] ??
          OTA_DEFAULTS.dark["price-original"],
        "price-highlight-bg":
          preset.styles.dark["price-highlight-bg"] ??
          preset.styles.dark.accent ??
          OTA_DEFAULTS.dark["price-highlight-bg"],
        "switch-track-off":
          preset.styles.dark["switch-track-off"] ??
          preset.styles.dark.muted ??
          OTA_DEFAULTS.dark["switch-track-off"],
        "switch-track-off-border":
          preset.styles.dark["switch-track-off-border"] ??
          preset.styles.dark.border ??
          OTA_DEFAULTS.dark["switch-track-off-border"],
        "switch-track-on":
          preset.styles.dark["switch-track-on"] ??
          preset.styles.dark.primary ??
          OTA_DEFAULTS.dark["switch-track-on"],
        "switch-track-on-border":
          preset.styles.dark["switch-track-on-border"] ??
          preset.styles.dark.ring ??
          OTA_DEFAULTS.dark["switch-track-on-border"],
        "switch-thumb":
          preset.styles.dark["switch-thumb"] ??
          preset.styles.dark.background ??
          OTA_DEFAULTS.dark["switch-thumb"],
        "switch-thumb-on":
          preset.styles.dark["switch-thumb-on"] ??
          preset.styles.dark["primary-foreground"] ??
          OTA_DEFAULTS.dark["switch-thumb-on"],
        "switch-ring":
          preset.styles.dark["switch-ring"] ??
          preset.styles.dark.ring ??
          OTA_DEFAULTS.dark["switch-ring"],
        "scrollbar-track":
          preset.styles.dark["scrollbar-track"] ??
          preset.styles.dark.muted ??
          OTA_DEFAULTS.dark["scrollbar-track"],
        "scrollbar-thumb":
          preset.styles.dark["scrollbar-thumb"] ??
          preset.styles.dark.border ??
          OTA_DEFAULTS.dark["scrollbar-thumb"],
        "scrollbar-thumb-hover":
          preset.styles.dark["scrollbar-thumb-hover"] ??
          preset.styles.dark["muted-foreground"] ??
          OTA_DEFAULTS.dark["scrollbar-thumb-hover"],
        skeleton:
          preset.styles.dark.skeleton ??
          preset.styles.dark.muted ??
          OTA_DEFAULTS.dark.skeleton,
        "skeleton-shimmer":
          preset.styles.dark["skeleton-shimmer"] ??
          preset.styles.dark.card ??
          OTA_DEFAULTS.dark["skeleton-shimmer"],
        "badge-cheap":
          preset.styles.dark["badge-cheap"] ??
          darkSuccess ??
          OTA_DEFAULTS.dark["badge-cheap"],
        "badge-cheap-text":
          preset.styles.dark["badge-cheap-text"] ??
          preset.styles.dark["success-foreground"] ??
          OTA_DEFAULTS.dark["badge-cheap-text"],
        "badge-best":
          preset.styles.dark["badge-best"] ??
          preset.styles.dark.primary ??
          OTA_DEFAULTS.dark["badge-best"],
        "badge-best-text":
          preset.styles.dark["badge-best-text"] ??
          preset.styles.dark["primary-foreground"] ??
          OTA_DEFAULTS.dark["badge-best-text"],
        "badge-fast":
          preset.styles.dark["badge-fast"] ??
          darkInfo ??
          OTA_DEFAULTS.dark["badge-fast"],
        "badge-fast-text":
          preset.styles.dark["badge-fast-text"] ??
          preset.styles.dark["info-foreground"] ??
          OTA_DEFAULTS.dark["badge-fast-text"],
        "airline-logo-bg":
          preset.styles.dark["airline-logo-bg"] ??
          preset.styles.dark.card ??
          OTA_DEFAULTS.dark["airline-logo-bg"],
        "layover-line":
          preset.styles.dark["layover-line"] ??
          preset.styles.dark.border ??
          OTA_DEFAULTS.dark["layover-line"],
        "selected-flight": darkSelectedFlight,
        "selected-flight-border":
          preset.styles.dark["selected-flight-border"] ??
          preset.styles.dark.ring ??
          OTA_DEFAULTS.dark["selected-flight-border"],
        chip:
          preset.styles.dark.chip ??
          preset.styles.dark.secondary ??
          OTA_DEFAULTS.dark.chip,
        "chip-foreground":
          preset.styles.dark["chip-foreground"] ??
          preset.styles.dark["secondary-foreground"] ??
          OTA_DEFAULTS.dark["chip-foreground"],
        "chip-selected":
          preset.styles.dark["chip-selected"] ??
          preset.styles.dark.primary ??
          OTA_DEFAULTS.dark["chip-selected"],
        "chip-selected-foreground":
          preset.styles.dark["chip-selected-foreground"] ??
          preset.styles.dark["primary-foreground"] ??
          OTA_DEFAULTS.dark["chip-selected-foreground"],
      },
    },
  };
};

export const tweakcnThemes: ColorTheme[] = Object.entries(tweakcnPresets).map(
  ([key, preset]) => ({
    name: preset.label || key,
    value: key,
    preset: withPremiumBrandVariables(withSidebarVariables(preset)),
  })
);

export const colorThemes: ColorTheme[] = Object.entries(shadcnThemePresetsV2).map(
  ([key, preset]) => ({
    name: preset.label || key,
    value: key,
    preset: withPremiumBrandVariables(withSidebarVariables(preset)),
  })
);

export const brandThemes: ColorTheme[] = Object.entries(brandPresets).map(
  ([key, preset]) => ({
    name: preset.label || key,
    value: key,
    preset: withPremiumBrandVariables(withSidebarVariables(preset)),
  })
);

export const sidebarThemes: ColorTheme[] = Object.entries(shadcnThemePresets).map(
  ([key, preset]) => ({
    name: preset.label || key,
    value: key,
    preset: withPremiumBrandVariables(withSidebarVariables(preset)),
  })
);
