import type { ImportedTheme } from "./theme-customizer-types";

// Theme mode used by the UI (light, dark, or follow system).
export type ThemeMode = "dark" | "light" | "system";

// Allowed font family names for the UI.
export type FontFamilyOption =
  | "inter"
  | "roboto"
  | "poppins"
  | "open-sans"
  | "montserrat"
  | "lato"
  | "manrope"
  | "nunito"
  | "space-grotesk"
  | "source-sans"
  | "vazirmatn"
  | "cairo"
  | "tajawal"
  | "almarai"
  | "amiri"
  | "readex-pro"
  | "ibm-plex-sans-arabic"
  | "noto-kufi-arabic"
  | "noto-naskh-arabic"
  | "yekan"
  | "system"
  | "serif"
  | "mono";

export type LocaleFontFamilySettings = Partial<
  Record<"en" | "fa" | "ar" | "tr", FontFamilyOption>
>;

// Allowed font sizes used by the UI.
export type FontSizeOption =
  | "0.75rem"
  | "0.875rem"
  | "1rem"
  | "1.125rem"
  | "1.25rem"
  | "1.375rem"
  | "1.5rem"
  | "1.625rem"
  | "1.75rem"
  | "1.875rem"
  | "2rem";

// Width choices for content and sidebar.
export type ContentWidthOption = "fluid" | "fixed" | "container";
export type SidebarWidthOption = "compact" | "comfortable" | "spacious";
export type HeadingTextDecoration = "none" | "underline" | "overline" | "line-through";

export type DensityViewportKey = "xs" | "sm" | "md" | "lg" | "xl";

// Optional density / layout overrides applied as :root CSS variables (rem, px, etc.).
// Keys map to the NEW canonical CSS variable names (see LAYOUT_DENSITY_CSS_MAP in theme-context).
export type LayoutDensityTokens = Partial<{
  // ── Typography (one variable per semantic level) ─────────────────────────
  /** --text-h1: semantic H1 size */
  textH1: string;
  /** --text-h2: semantic H2 size */
  textH2: string;
  /** --text-h3: semantic H3 size */
  textH3: string;
  /** --text-h4: semantic H4 size */
  textH4: string;
  /** --text-h5: semantic H5 size */
  textH5: string;
  /** --text-h6: semantic H6 size */
  textH6: string;
  /** --text-micro: tiny badges, dense labels (~10px) */
  textMicro: string;
  /** --text-caption: eyebrow caps, secondary info (~11px) */
  textCaption: string;
  /** --text-label: form labels, filter field labels (~12px) */
  textLabel: string;
  /** --text-body: body copy, input text, table cells (~13px) */
  textBody: string;
  /** --text-action: button / CTA labels */
  textAction: string;
  /** --text-badge: status badge / chip text */
  textBadge: string;
  /** --text-mono: monospaced code / data blocks */
  textMono: string;
  /** --text-heading-sm: card/section headings (~15px) */
  textHeadingSm: string;
  /** --text-heading: page-level headings (~18px) */
  textHeading: string;
  /** --text-stat: stat / KPI hero numbers */
  textStat: string;
  /** --badge-h: badge / pill min-height */
  badgeH: string;

  // ── Typography leading (line-height) ────────────────────────────────────
  /** --leading-body: body copy line-height */
  leadingBody: string;
  /** --leading-heading: heading line-height */
  leadingHeading: string;
  /** --leading-heading-sm: section heading line-height */
  leadingHeadingSm: string;
  /** --leading-caption: caption / eyebrow line-height */
  leadingCaption: string;
  /** --leading-label: label line-height */
  leadingLabel: string;
  /** --leading-badge: badge line-height */
  leadingBadge: string;
  /** --leading-mono: mono / code line-height */
  leadingMono: string;
  /** --leading-stat: stat/KPI line-height */
  leadingStat: string;
  /** --leading-h1: H1 line-height */
  leadingH1: string;
  /** --leading-h2: H2 line-height */
  leadingH2: string;
  /** --leading-h3: H3 line-height */
  leadingH3: string;
  /** --leading-h4: H4 line-height */
  leadingH4: string;
  /** --leading-h5: H5 line-height */
  leadingH5: string;
  /** --leading-h6: H6 line-height */
  leadingH6: string;

  // ── Letter-spacing (tracking) ────────────────────────────────────────────
  /** --tracking-body: body text letter-spacing */
  trackingBody: string;
  /** --tracking-heading: heading letter-spacing */
  trackingHeading: string;
  /** --tracking-heading-sm: section heading letter-spacing */
  trackingHeadingSm: string;
  /** --tracking-caps: uppercase/eyebrow letter-spacing */
  trackingCaps: string;
  /** --tracking-badge: badge letter-spacing */
  trackingBadge: string;
  /** --tracking-label: label letter-spacing */
  trackingLabel: string;

  // ── Font weights ────────────────────────────────────────────────────────
  /** --weight-body: body text / table cell weight */
  weightBody: string;
  /** --weight-label: form labels, filter labels */
  weightLabel: string;
  /** --weight-heading: card/section headings */
  weightHeading: string;
  /** --weight-action: button labels */
  weightAction: string;
  /** --weight-badge: badge/chip text */
  weightBadge: string;
  /** --weight-table-head: table column header weight */
  weightTableHead: string;
  /** --weight-h1: semantic H1 weight */
  weightH1: string;
  /** --weight-h2: semantic H2 weight */
  weightH2: string;
  /** --weight-h3: semantic H3 weight */
  weightH3: string;
  /** --weight-h4: semantic H4 weight */
  weightH4: string;
  /** --weight-h5: semantic H5 weight */
  weightH5: string;
  /** --weight-h6: semantic H6 weight */
  weightH6: string;

  // ── Icon sizes ──────────────────────────────────────────────────────────
  /** --icon-xs: compact / inline icon (14px) */
  iconXs: string;
  /** --icon-sm: standard icon (16px) */
  iconSm: string;
  /** --icon-md: medium icon (20px) */
  iconMd: string;
  /** --icon-lg: large/decorative icon (24px) */
  iconLg: string;

  // ── Form controls ───────────────────────────────────────────────────────
  /** --ctrl-h: standard control height */
  ctrlH: string;
  /** --ctrl-h-sm: small variant control height */
  ctrlHSm: string;
  /** --ctrl-px: horizontal padding for controls */
  ctrlPx: string;
  /** --ctrl-py: vertical padding for controls */
  ctrlPy: string;

  // ── Badge spacing ────────────────────────────────────────────────────────
  /** --badge-px: badge horizontal padding */
  badgePx: string;
  /** --badge-py: badge vertical padding */
  badgePy: string;

  // ── Nav / sidebar item spacing ───────────────────────────────────────────
  /** --nav-item-px: sidebar nav item horizontal padding */
  navItemPx: string;
  /** --nav-item-py: sidebar nav item vertical padding */
  navItemPy: string;
  /** --nav-icon-size: sidebar nav item icon size */
  navIconSize: string;

  // ── Card gap ─────────────────────────────────────────────────────────────
  /** --card-gap: gap between card content sections */
  cardGap: string;

  // ── Decorative hero ──────────────────────────────────────────────────────
  /** --hero-accent-h: accent bar height */
  heroAccentH: string;
  /** --hero-orb-lg: large blur orb size */
  heroOrbLg: string;
  /** --hero-orb-sm: small blur orb size */
  heroOrbSm: string;
  /** --hero-icon-pad: padding inside hero icon box */
  heroIconPad: string;

  // ── Shell spacing ───────────────────────────────────────────────────────
  /** --space-page-x: page horizontal gutter */
  spacePageX: string;
  /** --space-page-y: page vertical gutter */
  spacePageY: string;
  /** --space-section: gap between page sections */
  spaceSection: string;
  /** --space-card: card inner padding */
  spaceCard: string;
  /** --space-filter: filter bar inner padding */
  spaceFilter: string;
  /** --space-gap: generic component gap */
  spaceGap: string;

  // ── Table density ───────────────────────────────────────────────────────
  /** --table-head-text: column header font size */
  tableHeadText: string;
  /** --table-cell-text: data row font size */
  tableCellText: string;
  /** --table-head-h: header row height */
  tableHeadH: string;
  /** --table-cell-py: cell vertical padding */
  tableCellPy: string;
  /** --table-cell-px: cell horizontal padding */
  tableCellPx: string;
  /** --table-cell-leading: table cell line-height */
  tableCellLeading: string;
  /** --table-head-tracking: table header letter-spacing */
  tableHeadTracking: string;
  /** --table-cell-tracking: table cell letter-spacing */
  tableCellTracking: string;

  // ── Sidebar text ────────────────────────────────────────────────────────
  /** --sb-text-label: sidebar group label */
  sbTextLabel: string;
  /** --sb-text-item: sidebar nav item */
  sbTextItem: string;
  /** --sb-text-sub: sidebar sub-item */
  sbTextSub: string;
  /** --sb-text-badge: sidebar nav badge */
  sbTextBadge: string;

  // ── Layout ──────────────────────────────────────────────────────────────
  /** --app-sidebar-width */
  sidebarWidth: string;
  /** --pill-h: mobile action pill height */
  pillH: string;
  /** --pill-px: mobile pill horizontal padding */
  pillPx: string;
  /** --table-pair-col-rem: rem component for min(Xrem, 70vmin) paired table columns */
  tablePairCol: string;
  /** --loading-spinner-scale: loading spinner scale multiplier */
  loadingSpinnerScale: string;
}>;

export interface ResponsiveLayoutDensity {
  /** Base/default values applied globally before viewport-specific overrides. */
  base?: LayoutDensityTokens | null;
  /** Optional per-breakpoint token overrides layered on top of `base`. */
  viewports?: Partial<Record<DensityViewportKey, LayoutDensityTokens | null>>;
}

/**
 * Marketplace page ids used by `data-app-page` / Appearance density overrides.
 * Extend when new pages are added.
 */
export type AppPageId =
  | "home"
  | "listings"
  | "listing-detail"
  | "listings-create"
  | "my-listings"
  | "blogs"
  | "blog-detail"
  | "blogs-create"
  | "profile"
  | "profile-public"
  | "about"
  | "contact"
  | "sign-in"
  | "sign-up"
  | "admin"
  | "admin-notifications"
  | "admin-ads"
  | "admin-categories"
  | "admin-contacts"
  | "admin-stories"
  | "admin-users"
  | "admin-manage-content-status"
  | "pendings"
  | "stories"
  | "settings"
  | "settings-appearance"
  | "settings-themes"
  | "settings-account"
  | "settings-billing"
  | "settings-connections"
  | "settings-notifications"
  | "settings-user"
  | "shell-sidebar"
  | "shell-topbar"
  | "shell-footer";

/** @deprecated Prefer `AppPageId` — kept for Appearance Studio import parity with OTA. */
export type AdminPageId = AppPageId;

// Theme settings stored in UI context.
export interface ThemeSettings {
  mode: ThemeMode;
  selectedTheme: string;
  selectedTweakcnTheme: string;
  selectedBrandTheme: string;
  selectedSidebarTheme: string;
  selectedRadius: string;
  brandColors: Record<string, string>;
  importedTheme: ImportedTheme | null;
  fontFamily: FontFamilyOption;
  fontFamilyByLocale?: LocaleFontFamilySettings;
  headingTextDecoration?: HeadingTextDecoration;
  fontSize: FontSizeOption;
  contentWidth: ContentWidthOption;
  /** Responsive appearance token overrides for base + viewport-specific values. */
  layoutDensity?: ResponsiveLayoutDensity | null;
  /** Per-page token overrides (applied when `data-app-page` matches). */
  layoutDensityByPage?: Partial<Record<AppPageId, LayoutDensityTokens>> | null;
}

// Sidebar settings stored in UI context.
export interface SidebarSettings {
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  side: "left" | "right";
  width: SidebarWidthOption;
}

export interface LandingLink {
  label: string;
  href: string;
}

export interface LandingStatItem {
  value: string;
  label: string;
  enabled: boolean;
}

export interface LandingFeatureItem {
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface LandingFaqItem {
  question: string;
  answer: string;
  enabled: boolean;
}

export interface LandingHeaderSettings {
  enabled: boolean;
  brandHref: string;
  signInLabel: string;
  signInHref: string;
}

export interface LandingHeroSettings {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  primaryCta: LandingLink;
  secondaryCta: LandingLink;
  imageLightSrc: string;
  imageDarkSrc: string;
  imageAlt: string;
}

export interface LandingStatsSettings {
  enabled: boolean;
  items: LandingStatItem[];
}

export interface LandingServicesSettings {
  enabled: boolean;
  title: string;
  description: string;
  items: LandingFeatureItem[];
  /** Paths for the two Image3D blocks in the features section */
  featureOneLightSrc: string;
  featureOneDarkSrc: string;
  featureTwoLightSrc: string;
  featureTwoDarkSrc: string;
}

export interface LandingStorySettings {
  enabled: boolean;
  title: string;
  description: string;
  bulletOne: string;
  bulletTwo: string;
  bulletThree: string;
  panelTitle: string;
  panelDescription: string;
}

export interface LandingFaqSettings {
  enabled: boolean;
  title: string;
  description: string;
  items: LandingFaqItem[];
}

export interface LandingCtaSettings {
  enabled: boolean;
  title: string;
  description: string;
  primaryCta: LandingLink;
  secondaryCta: LandingLink;
}

export interface LandingPageSettings {
  header: LandingHeaderSettings;
  hero: LandingHeroSettings;
  stats: LandingStatsSettings;
  services: LandingServicesSettings;
  story: LandingStorySettings;
  faq: LandingFaqSettings;
  cta: LandingCtaSettings;
}

export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  enabled: boolean;
  links: FooterLinkItem[];
}

export interface FooterSettings {
  enabled: boolean;
  brandTitle: string;
  brandDescription: string;
  brandHref: string;
  supportLabel: string;
  supportHref: string;
  supportSecondaryLabel: string;
  supportSecondaryHref: string;
  columns: FooterColumn[];
  socialLinks: FooterLinkItem[];
  legalLinks: FooterLinkItem[];
  copyrightSuffix: string;
}

// Root UI context shape.
export interface UiContextState {
  version: number;
  theme: ThemeSettings;
  sidebar: SidebarSettings;
  landing: LandingPageSettings;
  footer: FooterSettings;
  updatedAt?: string;
}
