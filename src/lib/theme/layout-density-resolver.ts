import type {
  DensityViewportKey,
  LayoutDensityTokens,
  ResponsiveLayoutDensity,
} from "@repo/types";
import {
  defaultLayoutDensityTokensByViewport,
  densityViewportKeys,
} from "./ui-context-defaults";

/** Font-weight tokens — flat delta applied equally at every viewport. */
export const LAYOUT_DENSITY_UNITLESS_KEYS = new Set<keyof LayoutDensityTokens>([
  "weightBody",
  "weightLabel",
  "weightHeading",
  "weightAction",
  "weightBadge",
  "weightTableHead",
  "weightH1",
  "weightH2",
  "weightH3",
  "weightH4",
  "weightH5",
  "weightH6",
]);

/** Scale/multiplier tokens stored as plain decimals (not rem). */
export const LAYOUT_DENSITY_DECIMAL_KEYS = new Set<keyof LayoutDensityTokens>([
  "loadingSpinnerScale",
  // Leading (line-height) — unitless decimals like 1.5
  "leadingBody",
  "leadingHeading",
  "leadingHeadingSm",
  "leadingCaption",
  "leadingLabel",
  "leadingBadge",
  "leadingMono",
  "leadingStat",
  "leadingH1",
  "leadingH2",
  "leadingH3",
  "leadingH4",
  "leadingH5",
  "leadingH6",
  // Table cell line-height
  "tableCellLeading",
]);

/** Tokens formatted with `em` units (letter-spacing). */
export const LAYOUT_DENSITY_EM_KEYS = new Set<keyof LayoutDensityTokens>([
  "trackingBody",
  "trackingHeading",
  "trackingHeadingSm",
  "trackingCaps",
  "trackingBadge",
  "trackingLabel",
  "tableHeadTracking",
  "tableCellTracking",
]);

/** Tokens that use a flat rem delta (not proportional to viewport baseline). */
export const LAYOUT_DENSITY_FLAT_DELTA_KEYS = new Set<keyof LayoutDensityTokens>([
  "sidebarWidth",
  "loadingSpinnerScale",
  ...LAYOUT_DENSITY_UNITLESS_KEYS,
  ...LAYOUT_DENSITY_DECIMAL_KEYS,
  ...LAYOUT_DENSITY_EM_KEYS,
]);

const XL_VIEWPORT: DensityViewportKey = "xl";

/** Maps LayoutDensityTokens keys to canonical CSS custom property names (without `--`). */
export const LAYOUT_DENSITY_CSS_VAR_MAP: Record<
  keyof LayoutDensityTokens,
  string
> = {
  textH1: "text-h1",
  textH2: "text-h2",
  textH3: "text-h3",
  textH4: "text-h4",
  textH5: "text-h5",
  textH6: "text-h6",
  textMicro: "text-micro",
  textCaption: "text-caption",
  textLabel: "text-label",
  textBody: "text-body",
  textAction: "text-action",
  textBadge: "text-badge",
  textMono: "text-mono",
  textHeadingSm: "text-heading-sm",
  textHeading: "text-heading",
  textStat: "text-stat",
  badgeH: "badge-h",
  weightBody: "weight-body",
  weightLabel: "weight-label",
  weightHeading: "weight-heading",
  weightAction: "weight-action",
  weightBadge: "weight-badge",
  weightTableHead: "weight-table-head",
  weightH1: "weight-h1",
  weightH2: "weight-h2",
  weightH3: "weight-h3",
  weightH4: "weight-h4",
  weightH5: "weight-h5",
  weightH6: "weight-h6",
  iconXs: "icon-xs",
  iconSm: "icon-sm",
  iconMd: "icon-md",
  iconLg: "icon-lg",
  ctrlH: "ctrl-h",
  ctrlHSm: "ctrl-h-sm",
  ctrlPx: "ctrl-px",
  ctrlPy: "ctrl-py",
  badgePx: "badge-px",
  badgePy: "badge-py",
  navItemPx: "nav-item-px",
  navItemPy: "nav-item-py",
  navIconSize: "nav-icon-size",
  cardGap: "card-gap",
  heroAccentH: "hero-accent-h",
  heroOrbLg: "hero-orb-lg",
  heroOrbSm: "hero-orb-sm",
  heroIconPad: "hero-icon-pad",
  spacePageX: "space-page-x",
  spacePageY: "space-page-y",
  spaceSection: "space-section",
  spaceCard: "space-card",
  spaceFilter: "space-filter",
  spaceGap: "space-gap",
  tableHeadText: "table-head-text",
  tableCellText: "table-cell-text",
  tableHeadH: "table-head-h",
  tableCellPy: "table-cell-py",
  tableCellPx: "table-cell-px",
  tableCellLeading: "table-cell-leading",
  tableHeadTracking: "table-head-tracking",
  tableCellTracking: "table-cell-tracking",
  sbTextLabel: "sb-text-label",
  sbTextItem: "sb-text-item",
  sbTextSub: "sb-text-sub",
  sbTextBadge: "sb-text-badge",
  sidebarWidth: "app-sidebar-width",
  pillH: "pill-h",
  pillPx: "pill-px",
  loadingSpinnerScale: "loading-spinner-scale",
  // ── Leading (line-height) ─────────────────────────────────────────────
  leadingBody: "leading-body",
  leadingHeading: "leading-heading",
  leadingHeadingSm: "leading-heading-sm",
  leadingCaption: "leading-caption",
  leadingLabel: "leading-label",
  leadingBadge: "leading-badge",
  leadingMono: "leading-mono",
  leadingStat: "leading-stat",
  leadingH1: "leading-h1",
  leadingH2: "leading-h2",
  leadingH3: "leading-h3",
  leadingH4: "leading-h4",
  leadingH5: "leading-h5",
  leadingH6: "leading-h6",
  // ── Tracking (letter-spacing in em) ───────────────────────────────────
  trackingBody: "tracking-body",
  trackingHeading: "tracking-heading",
  trackingHeadingSm: "tracking-heading-sm",
  trackingCaps: "tracking-caps",
  trackingBadge: "tracking-badge",
  trackingLabel: "tracking-label",
};

export const LAYOUT_DENSITY_VIEWPORT_MEDIA_QUERY: Record<
  DensityViewportKey,
  string
> = {
  xs: "(max-width: 639px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
};

const normalizeDensityTokenCssValue = (
  key: keyof LayoutDensityTokens,
  value: string,
): string => {
  const trimmed = value.trim();
  if (key === "sidebarWidth" && /^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}rem`;
  }
  return trimmed;
};

/** Formats a resolved numeric token into the CSS value injected on `:root` or preview shells. */
export const formatLayoutDensityCSSValue = (
  key: keyof LayoutDensityTokens,
  value: number,
): string => normalizeDensityTokenCssValue(key, formatLayoutDensityNumeric(value, key));

/** Serialises resolved token values into `:root { … }` property lines. */
export const formatDensityTokenCssDeclarations = (
  tokens: LayoutDensityTokens,
): string => {
  return (
    Object.entries(tokens) as Array<
      [keyof LayoutDensityTokens, string | undefined]
    >
  )
    .filter(([, value]) => Boolean(value && value.trim()))
    .map(([key, value]) => {
      const normalized = normalizeDensityTokenCssValue(key, value!);
      return `  --${LAYOUT_DENSITY_CSS_VAR_MAP[key]}: ${normalized};`;
    })
    .join("\n");
};

const clearViewportOverrideForKey = (
  viewports: NonNullable<ResponsiveLayoutDensity["viewports"]>,
  key: keyof LayoutDensityTokens,
): ResponsiveLayoutDensity["viewports"] => {
  const next = { ...viewports };
  for (const viewport of densityViewportKeys) {
    const tokens = next[viewport];
    if (!tokens || tokens[key] === undefined) continue;
    const updated = { ...tokens };
    delete updated[key];
    if (Object.keys(updated).length === 0) {
      delete next[viewport];
    } else {
      next[viewport] = updated;
    }
  }
  return Object.keys(next).length > 0 ? next : undefined;
};

export const parseLayoutDensityNumeric = (
  input: string | undefined,
  fallback = 0,
): number => {
  if (!input) return fallback;
  const trimmed = input.trim();
  const rem = trimmed.match(/^(-?[\d.]+)rem$/i);
  if (rem) return Number(rem[1]) || fallback;
  const em = trimmed.match(/^(-?[\d.]+)em$/i);
  if (em) return Number(em[1]) || fallback;
  const px = trimmed.match(/^(-?[\d.]+)px$/i);
  if (px) return (Number(px[1]) || 0) / 16;
  const n = parseFloat(trimmed);
  return Number.isFinite(n) ? n : fallback;
};

export const formatLayoutDensityNumeric = (
  value: number,
  key: keyof LayoutDensityTokens,
): string => {
  if (LAYOUT_DENSITY_UNITLESS_KEYS.has(key)) {
    return String(Math.round(value));
  }
  if (LAYOUT_DENSITY_EM_KEYS.has(key)) {
    return `${value.toFixed(4)}em`;
  }
  if (LAYOUT_DENSITY_DECIMAL_KEYS.has(key)) {
    return String(Number(value.toFixed(4)));
  }
  return `${value.toFixed(3)}rem`;
};

export const getViewportBaseline = (
  viewport: DensityViewportKey,
  key: keyof LayoutDensityTokens,
): number => {
  const raw =
    defaultLayoutDensityTokensByViewport[viewport][key] ??
    defaultLayoutDensityTokensByViewport[XL_VIEWPORT][key];

  const fallback = LAYOUT_DENSITY_UNITLESS_KEYS.has(key)
    ? 400
    : LAYOUT_DENSITY_DECIMAL_KEYS.has(key)
      ? 1
      : 0;

  return parseLayoutDensityNumeric(raw, fallback);
};

/** Global delta stored in `base` (offset from XL canonical baseline). */
export const getBaseDelta = (
  density: ResponsiveLayoutDensity | null | undefined,
  key: keyof LayoutDensityTokens,
): number => {
  if (!density?.base?.[key]) return 0;
  return parseLayoutDensityNumeric(
    density.base[key],
    0,
  );
};

/**
 * Applies a global delta to a viewport baseline.
 * Rem tokens scale delta by (vpBaseline / xlBaseline) so each breakpoint
 * moves proportionally — matching responsive-tokens.css ratios.
 */
export const applyBaseDeltaToViewport = (
  viewport: DensityViewportKey,
  key: keyof LayoutDensityTokens,
  delta: number,
): number => {
  const vpBaseline = getViewportBaseline(viewport, key);
  if (LAYOUT_DENSITY_FLAT_DELTA_KEYS.has(key)) {
    return vpBaseline + delta;
  }

  const xlBaseline = getViewportBaseline(XL_VIEWPORT, key);
  if (xlBaseline <= 0) {
    return Math.max(0, vpBaseline + delta);
  }

  const scaledDelta = delta * (vpBaseline / xlBaseline);
  return Math.max(0, vpBaseline + scaledDelta);
};

/** Effective token value for one viewport after base deltas + optional override. */
export const resolveLayoutDensityToken = (
  viewport: DensityViewportKey,
  key: keyof LayoutDensityTokens,
  density: ResponsiveLayoutDensity | null | undefined,
): number => {
  const override = density?.viewports?.[viewport]?.[key];
  if (override !== undefined && override !== "") {
    return parseLayoutDensityNumeric(
      override,
      getViewportBaseline(viewport, key),
    );
  }

  const delta = getBaseDelta(density, key);
  if (delta === 0) {
    return getViewportBaseline(viewport, key);
  }

  return applyBaseDeltaToViewport(viewport, key, delta);
};

export const resolveLayoutDensityTokensForViewport = (
  viewport: DensityViewportKey,
  density: ResponsiveLayoutDensity | null | undefined,
): LayoutDensityTokens => {
  if (!density) return {};

  const keys = new Set<keyof LayoutDensityTokens>();
  if (density.base) {
    Object.keys(density.base).forEach((k) =>
      keys.add(k as keyof LayoutDensityTokens),
    );
  }
  if (density.viewports?.[viewport]) {
    Object.keys(density.viewports[viewport]!).forEach((k) =>
      keys.add(k as keyof LayoutDensityTokens),
    );
  }

  const resolved: LayoutDensityTokens = {};
  keys.forEach((key) => {
    const value = resolveLayoutDensityToken(viewport, key, density);
    const baseline = getViewportBaseline(viewport, key);
    const hasOverride = density.viewports?.[viewport]?.[key] !== undefined;
    const hasDelta = getBaseDelta(density, key) !== 0;

    if (hasOverride || hasDelta) {
      resolved[key] = formatLayoutDensityNumeric(value, key);
    } else if (Math.abs(value - baseline) > 0.0005) {
      resolved[key] = formatLayoutDensityNumeric(value, key);
    }
  });

  return resolved;
};

/** Build per-viewport token maps for CSS `@media` injection. */
export const buildResolvedViewportDensity = (
  density: ResponsiveLayoutDensity | null | undefined,
): Partial<Record<DensityViewportKey, LayoutDensityTokens>> => {
  if (!density) return {};

  const result: Partial<Record<DensityViewportKey, LayoutDensityTokens>> = {};
  for (const viewport of densityViewportKeys) {
    const tokens = resolveLayoutDensityTokensForViewport(viewport, density);
    if (Object.keys(tokens).length > 0) {
      result[viewport] = tokens;
    }
  }
  return result;
};

/** Builds `@media` blocks with fully resolved per-viewport token values. */
export const buildLayoutDensityOverrideCss = (
  density: ResponsiveLayoutDensity | null | undefined,
  options?: { selector?: string },
): string => {
  if (!density) return "";
  const selector = options?.selector?.trim() || ":root";
  const resolvedByViewport = buildResolvedViewportDensity(density);
  return densityViewportKeys
    .map((viewport) => {
      const tokens = resolvedByViewport[viewport];
      if (!tokens || Object.keys(tokens).length === 0) return "";
      const block = formatDensityTokenCssDeclarations(tokens);
      if (!block) return "";
      return `@media ${LAYOUT_DENSITY_VIEWPORT_MEDIA_QUERY[viewport]} {\n  ${selector} {\n${block}\n  }\n}`;
    })
    .filter(Boolean)
    .join("\n\n");
};

/**
 * Builds absolute page-scoped overrides. Page values intentionally sit on top
 * of the responsive global density at every viewport, matching the live
 * preview and avoiding a second, competing breakpoint model per page.
 */
export const buildPageDensityOverrideCss = (
  byPage:
    | Partial<Record<string, LayoutDensityTokens | null | undefined>>
    | null
    | undefined,
): string => {
  if (!byPage) return "";

  return Object.entries(byPage)
    .map(([pageId, tokens]) => {
      if (!pageId || !tokens) return "";
      const declarations = formatDensityTokenCssDeclarations(tokens);
      if (!declarations) return "";
      return `[data-app-page="${pageId}"] {\n${declarations}\n}`;
    })
    .filter(Boolean)
    .join("\n\n");
};

/** XL-anchor value shown in the Default tab slider. */
export const getDefaultTabDisplayValue = (
  density: ResponsiveLayoutDensity | null | undefined,
  key: keyof LayoutDensityTokens,
): number => {
  return resolveLayoutDensityToken(XL_VIEWPORT, key, density);
};

export const setDefaultTabTokenValue = (
  density: ResponsiveLayoutDensity | null | undefined,
  key: keyof LayoutDensityTokens,
  xlAnchorValue: number,
): ResponsiveLayoutDensity => {
  const xlBaseline = getViewportBaseline(XL_VIEWPORT, key);
  const delta = xlAnchorValue - xlBaseline;
  const next: ResponsiveLayoutDensity = {
    base: { ...(density?.base ?? {}) },
    viewports: { ...(density?.viewports ?? {}) },
  };

  if (Math.abs(delta) < 0.0005) {
    if (next.base) delete next.base[key];
    if (next.base && Object.keys(next.base).length === 0) delete next.base;
  } else {
    next.base = {
      ...(next.base ?? {}),
      [key]: formatLayoutDensityNumeric(delta, key),
    };
  }

  // Default-tab edits define a global delta — drop per-viewport overrides for
  // this key so the proportional base delta applies at every breakpoint.
  if (next.viewports) {
    next.viewports = clearViewportOverrideForKey(next.viewports, key);
    if (!next.viewports) delete next.viewports;
  }

  return next;
};

export const setViewportTokenValue = (
  density: ResponsiveLayoutDensity | null | undefined,
  viewport: DensityViewportKey,
  key: keyof LayoutDensityTokens,
  absoluteValue: number,
): ResponsiveLayoutDensity => {
  const expectedWithoutOverride = applyBaseDeltaToViewport(
    viewport,
    key,
    getBaseDelta(density, key),
  );
  const next: ResponsiveLayoutDensity = {
    base: density?.base ? { ...density.base } : undefined,
    viewports: { ...(density?.viewports ?? {}) },
  };

  if (Math.abs(absoluteValue - expectedWithoutOverride) < 0.0005) {
    const vp = { ...(next.viewports?.[viewport] ?? {}) };
    delete vp[key];
    if (Object.keys(vp).length === 0) {
      if (next.viewports) delete next.viewports[viewport];
    } else if (next.viewports) {
      next.viewports[viewport] = vp;
    }
  } else {
    next.viewports = {
      ...(next.viewports ?? {}),
      [viewport]: {
        ...(next.viewports?.[viewport] ?? {}),
        [key]: formatLayoutDensityNumeric(absoluteValue, key),
      },
    };
  }

  if (next.viewports && Object.keys(next.viewports).length === 0) {
    delete next.viewports;
  }

  return next;
};
