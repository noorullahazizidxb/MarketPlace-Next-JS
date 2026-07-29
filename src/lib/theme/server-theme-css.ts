/**
 * Server-side CSS variable generator for the theme system.
 *
 * Mirrors client `applyThemeSettings` priority:
 * imported → tweakcn → brand → sidebar → color theme → radius → brandColors → typography/density.
 */
import {
  fontFamilyValues,
  fontSizeValues,
  contentWidthValues,
  defaultThemeSettings,
  normalizeResponsiveLayoutDensity,
  buildLayoutDensityOverrideCss,
  buildPageDensityOverrideCss,
  getBaseDelta,
  densityViewportKeys,
} from "@repo/constants";
import type {
  ResponsiveLayoutDensity,
  LayoutDensityTokens,
  ThemeSettings,
} from "@repo/types/ui-context";
import { resolveThemePresetStyles } from "./theme-preset-resolver";

const DARK_SELECTOR = '.dark, [data-theme="dark"]';

const resolveThemeLocale = (
  locale?: string | null,
): "en" | "fa" | "ar" | "tr" => {
  if (locale === "fa" || locale === "ar" || locale === "tr") {
    return locale;
  }
  return "en";
};

function toCssProps(vars: Record<string, string>): string {
  return Object.entries(vars)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

export function generateThemeCss(
  settings: ThemeSettings,
  locale?: string | null,
): string {
  const parts: string[] = [];

  const preset = resolveThemePresetStyles(settings);
  if (preset) {
    const lightProps = toCssProps(preset.light);
    const darkProps = toCssProps(preset.dark);
    if (lightProps) parts.push(`:root {\n${lightProps}\n}`);
    if (darkProps) parts.push(`${DARK_SELECTOR} {\n${darkProps}\n}`);
  }

  if (
    settings.selectedRadius &&
    settings.selectedRadius !== defaultThemeSettings.selectedRadius
  ) {
    parts.push(`:root { --radius: ${settings.selectedRadius}; }`);
  }

  const brandEntries = Object.entries(settings.brandColors ?? {}).filter(
    ([, v]) => v,
  );
  if (brandEntries.length > 0) {
    const props = brandEntries.map(([k, v]) => `  ${k}: ${v};`).join("\n");
    parts.push(`:root {\n${props}\n}`);
  }

  const fontFamilyOption =
    settings.fontFamilyByLocale?.[resolveThemeLocale(locale)] ??
    settings.fontFamily;
  const fontFamily =
    fontFamilyValues[fontFamilyOption] ?? fontFamilyValues.inter;
  const fontSize =
    fontSizeValues[settings.fontSize] ??
    fontSizeValues[defaultThemeSettings.fontSize];
  const contentWidth =
    contentWidthValues[settings.contentWidth] ?? contentWidthValues.fluid;
  const normalizedDensity = normalizeResponsiveLayoutDensity(
    settings.layoutDensity as
      | ResponsiveLayoutDensity
      | LayoutDensityTokens
      | null
      | undefined,
  );

  const layoutProps: string[] = [];
  layoutProps.push(`  --app-font-family: ${fontFamily};`);
  const hasTextBodyCustomization =
    Boolean(normalizedDensity) &&
    (getBaseDelta(normalizedDensity, "textBody") !== 0 ||
      densityViewportKeys.some(
        (viewport) => normalizedDensity?.viewports?.[viewport]?.textBody,
      ));
  if (!hasTextBodyCustomization && fontSize !== fontSizeValues["1rem"]) {
    layoutProps.push(`  --text-body: ${fontSize};`);
  }
  if (contentWidth !== contentWidthValues.fluid) {
    layoutProps.push(`  --app-content-width: ${contentWidth};`);
  }
  if (settings.headingTextDecoration) {
    layoutProps.push(
      `  --heading-text-decoration: ${settings.headingTextDecoration};`,
    );
  }

  if (layoutProps.length > 0) {
    parts.push(`:root {\n${layoutProps.join("\n")}\n}`);
  }

  const densityCss = buildLayoutDensityOverrideCss(normalizedDensity);
  if (densityCss) {
    parts.push(densityCss);
  }

  // Page-scoped density overrides (layoutDensityByPage → [data-app-page="…"])
  const pageDensityCss = buildPageDensityOverrideCss(
    settings.layoutDensityByPage,
  );
  if (pageDensityCss) parts.push(pageDensityCss);

  return parts.join("\n");
}
