/**
 * Server-side CSS variable generator for the theme system.
 *
 * Mirrors client `applyThemeSettings` priority:
 * imported → tweakcn → brand → sidebar → color theme → radius → brandColors → typography/density.
 */
import {
  colorThemes,
  brandThemes,
  sidebarThemes,
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

function pushPresetBlocks(
  parts: string[],
  light: Record<string, string>,
  dark: Record<string, string>,
) {
  const lightProps = toCssProps(light);
  const darkProps = toCssProps(dark);
  if (lightProps) parts.push(`:root {\n${lightProps}\n}`);
  if (darkProps) parts.push(`.dark {\n${darkProps}\n}`);
}

export function generateThemeCss(
  settings: ThemeSettings,
  locale?: string | null,
): string {
  const parts: string[] = [];

  if (settings.importedTheme) {
    pushPresetBlocks(
      parts,
      settings.importedTheme.light as Record<string, string>,
      settings.importedTheme.dark as Record<string, string>,
    );
  } else if (settings.selectedTweakcnTheme) {
    const preset = tweakcnThemes.find(
      (t) => t.value === settings.selectedTweakcnTheme,
    )?.preset;
    if (preset) {
      pushPresetBlocks(
        parts,
        preset.styles.light as Record<string, string>,
        preset.styles.dark as Record<string, string>,
      );
    }
  } else if (settings.selectedBrandTheme) {
    const preset = brandThemes.find(
      (t) => t.value === settings.selectedBrandTheme,
    )?.preset;
    if (preset) {
      pushPresetBlocks(
        parts,
        preset.styles.light as Record<string, string>,
        preset.styles.dark as Record<string, string>,
      );
    }
  } else if (settings.selectedSidebarTheme) {
    const preset = sidebarThemes.find(
      (t) => t.value === settings.selectedSidebarTheme,
    )?.preset;
    if (preset) {
      pushPresetBlocks(
        parts,
        preset.styles.light as Record<string, string>,
        preset.styles.dark as Record<string, string>,
      );
    }
  } else if (
    settings.selectedTheme &&
    settings.selectedTheme !== "default"
  ) {
    const preset = colorThemes.find(
      (t) => t.value === settings.selectedTheme,
    )?.preset;
    if (preset) {
      pushPresetBlocks(
        parts,
        preset.styles.light as Record<string, string>,
        preset.styles.dark as Record<string, string>,
      );
    }
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
  const byPage = settings.layoutDensityByPage;
  if (byPage && typeof byPage === "object") {
    for (const [pageId, tokens] of Object.entries(byPage)) {
      if (!tokens || !pageId) continue;
      const pageDensity = normalizeResponsiveLayoutDensity(
        tokens as LayoutDensityTokens | ResponsiveLayoutDensity,
      );
      const pageCss = buildLayoutDensityOverrideCss(pageDensity, {
        selector: `[data-app-page="${pageId}"]`,
      });
      if (pageCss) parts.push(pageCss);
    }
  }

  return parts.join("\n");
}
