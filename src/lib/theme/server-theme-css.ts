/**
 * Server-side CSS variable generator for the theme system.
 *
 * This mirrors the client-side `applyThemeSettings` logic in
 * `packages/hooks/src/theme/context/theme-context.tsx` but produces
 * a static CSS string that can be injected into <head> at SSR time,
 * eliminating the flash-of-unstyled-content (FOUC) on first load.
 */
import {
  colorThemes,
  tweakcnThemes,
  fontFamilyValues,
  fontSizeValues,
  contentWidthValues,
  defaultThemeSettings,
  normalizeResponsiveLayoutDensity,
  buildLayoutDensityOverrideCss,
  getBaseDelta,
  densityViewportKeys,
} from "@repo/constants";
import type {
  ResponsiveLayoutDensity,
  LayoutDensityTokens,
  ThemeSettings,
} from "@repo/types/ui-context";

const resolveThemeLocale = (locale?: string | null): "en" | "fa" | "ar" | "tr" => {
  if (locale === "fa" || locale === "ar" || locale === "tr") {
    return locale;
  }

  return "en";
};

/** Converts a flat record of CSS variable name → value into a CSS property block. */
function toCssProps(vars: Record<string, string>): string {
  return Object.entries(vars)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

/**
 * Generates a `<style>` tag body with `:root` and `.dark` blocks that reflect
 * the given `ThemeSettings`.  The output is safe to inject via
 * `dangerouslySetInnerHTML` in the root layout because it contains only
 * CSS custom properties — no user-controlled content is interpolated.
 *
 * Returns an empty string when settings match pure defaults (nothing to override).
 */
export function generateThemeCss(
  settings: ThemeSettings,
  locale?: string | null,
): string {
  const parts: string[] = [];

  // ── 1. Color theme ──────────────────────────────────────────────────────────
  if (settings.importedTheme) {
    const lightProps = toCssProps(settings.importedTheme.light as Record<string, string>);
    const darkProps = toCssProps(settings.importedTheme.dark as Record<string, string>);
    if (lightProps) parts.push(`:root {\n${lightProps}\n}`);
    if (darkProps) parts.push(`.dark {\n${darkProps}\n}`);
  } else if (settings.selectedTweakcnTheme) {
    const preset = tweakcnThemes.find(
      (t) => t.value === settings.selectedTweakcnTheme,
    )?.preset;
    if (preset) {
      const lightProps = toCssProps(preset.styles.light as Record<string, string>);
      const darkProps = toCssProps(preset.styles.dark as Record<string, string>);
      if (lightProps) parts.push(`:root {\n${lightProps}\n}`);
      if (darkProps) parts.push(`.dark {\n${darkProps}\n}`);
    }
  } else if (
    settings.selectedTheme &&
    settings.selectedTheme !== "default" &&
    settings.selectedTheme !== defaultThemeSettings.selectedTheme
  ) {
    const preset = colorThemes.find(
      (t) => t.value === settings.selectedTheme,
    )?.preset;
    if (preset) {
      const lightProps = toCssProps(preset.styles.light as Record<string, string>);
      const darkProps = toCssProps(preset.styles.dark as Record<string, string>);
      if (lightProps) parts.push(`:root {\n${lightProps}\n}`);
      if (darkProps) parts.push(`.dark {\n${darkProps}\n}`);
    }
  }

  // ── 2. Border radius ─────────────────────────────────────────────────────────
  if (
    settings.selectedRadius &&
    settings.selectedRadius !== defaultThemeSettings.selectedRadius
  ) {
    parts.push(`:root { --radius: ${settings.selectedRadius}; }`);
  }

  // ── 3. Brand color overrides ─────────────────────────────────────────────────
  const brandEntries = Object.entries(settings.brandColors ?? {}).filter(
    ([, v]) => v,
  );
  if (brandEntries.length > 0) {
    const props = brandEntries.map(([k, v]) => `  ${k}: ${v};`).join("\n");
    parts.push(`:root {\n${props}\n}`);
  }

  // ── 4. Typography and layout ─────────────────────────────────────────────────
  const fontFamilyOption =
    settings.fontFamilyByLocale?.[resolveThemeLocale(locale)] ?? settings.fontFamily;
  const fontFamily =
    fontFamilyValues[fontFamilyOption] ?? fontFamilyValues.inter;
  const fontSize =
    fontSizeValues[settings.fontSize] ?? fontSizeValues[defaultThemeSettings.fontSize];
  const contentWidth =
    contentWidthValues[settings.contentWidth] ?? contentWidthValues.fluid;
  const normalizedDensity = normalizeResponsiveLayoutDensity(
    settings.layoutDensity as ResponsiveLayoutDensity | LayoutDensityTokens | null | undefined,
  );

  const layoutProps: string[] = [];
  if (fontFamily !== fontFamilyValues.inter)
    layoutProps.push(`  --app-font-family: ${fontFamily};`);
  const hasTextBodyCustomization =
    Boolean(normalizedDensity) &&
    (getBaseDelta(normalizedDensity, "textBody") !== 0 ||
      densityViewportKeys.some(
        (viewport) => normalizedDensity?.viewports?.[viewport]?.textBody,
      ));
  if (!hasTextBodyCustomization && fontSize !== fontSizeValues["1rem"])
    layoutProps.push(`  --text-body: ${fontSize};`);
  if (contentWidth !== contentWidthValues.fluid)
    layoutProps.push(`  --app-content-width: ${contentWidth};`);

  if (layoutProps.length > 0) {
    parts.push(`:root {\n${layoutProps.join("\n")}\n}`);
  }

  // ── 5. Layout density — resolved per-viewport overrides (matches client) ─────
  const densityCss = buildLayoutDensityOverrideCss(normalizedDensity);
  if (densityCss) {
    parts.push(densityCss);
  }

  return parts.join("\n");
}
