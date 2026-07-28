import type {
  ThemeSettings,
  SidebarSettings,
  UiContextState,
  FontFamilyOption,
  FontSizeOption,
  ContentWidthOption,
  SidebarWidthOption,
  LandingPageSettings,
  FooterSettings,
  DensityViewportKey,
  LayoutDensityTokens,
  ResponsiveLayoutDensity,
} from "@repo/types";

// Map of font family option to CSS font-family value.
export const fontFamilyValues: Record<FontFamilyOption, string> = {
  inter: 'var(--font-inter), "Inter Fallback", system-ui, -apple-system, sans-serif',
  roboto: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
  "open-sans": "'Open Sans', 'Segoe UI', system-ui, -apple-system, sans-serif",
  poppins: "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
  montserrat: "'Montserrat', 'Segoe UI', system-ui, -apple-system, sans-serif",
  lato: "'Lato', 'Segoe UI', system-ui, -apple-system, sans-serif",
  manrope: "'Manrope', 'Inter', system-ui, -apple-system, sans-serif",
  nunito: "'Nunito', 'Inter', system-ui, -apple-system, sans-serif",
  "space-grotesk":
    "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
  "source-sans":
    "'Source Sans Pro', 'Segoe UI', system-ui, -apple-system, sans-serif",
  vazirmatn: "'Vazirmatn', 'Tahoma', sans-serif",
  cairo: "'Cairo', 'Tahoma', sans-serif",
  tajawal: "'Tajawal', 'Tahoma', sans-serif",
  almarai: "'Almarai', 'Tahoma', sans-serif",
  amiri: "'Amiri', 'Times New Roman', serif",
  "readex-pro": "'Readex Pro', 'Tahoma', sans-serif",
  "ibm-plex-sans-arabic": "'IBM Plex Sans Arabic', 'Tahoma', sans-serif",
  "noto-kufi-arabic": "'Noto Kufi Arabic', 'Tahoma', sans-serif",
  "noto-naskh-arabic": "'Noto Naskh Arabic', 'Tahoma', sans-serif",
  yekan: "'Yekan', 'Tahoma', sans-serif",
  system: "system-ui, -apple-system, sans-serif",
  serif: "ui-serif, Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace",
};

// Map of font size option to CSS value.
export const fontSizeValues: Record<FontSizeOption, string> = {
  "0.75rem": "0.75rem",
  "0.875rem": "0.875rem",
  "1rem": "1rem",
  "1.125rem": "1.125rem",
  "1.25rem": "1.25rem",
  "1.375rem": "1.375rem",
  "1.5rem": "1.5rem",
  "1.625rem": "1.625rem",
  "1.75rem": "1.75rem",
  "1.875rem": "1.875rem",
  "2rem": "2rem",
};

// Map of content width option to CSS value.
export const contentWidthValues: Record<ContentWidthOption, string> = {
  fluid: "100%",
  fixed: "1200px",
  container: "1320px",
};

// Map of sidebar width option to CSS value.
export const sidebarWidthValues: Record<SidebarWidthOption, string> = {
  compact: "14rem",
  comfortable: "16rem",
  spacious: "18rem",
};

/**
 * Default values matching the xl (≥1280px) breakpoint in responsive-tokens.css.
 * Sliders in the appearance settings start at these canonical desktop defaults.
 */
export const defaultLayoutDensityTokens: LayoutDensityTokens = {
  // Typography
  textH1: "1.75rem",
  textH2: "1.5rem",
  textH3: "1.25rem",
  textH4: "1.0625rem",
  textH5: "0.875rem",
  textH6: "0.875rem",
  textMicro: "0.625rem",
  textCaption: "0.6875rem",
  textLabel: "0.75rem",
  textBody: "1rem",
  textAction: "1rem",
  textBadge: "0.75rem",
  textMono: "1rem",
  textHeadingSm: "1.25rem",
  textHeading: "1.5rem",
  textStat: "1.125rem",
  badgeH: "1.375rem",
  // Font weights
  weightBody: "400",
  weightLabel: "500",
  weightHeading: "600",
  weightAction: "500",
  weightBadge: "500",
  weightTableHead: "600",
  weightH1: "700",
  weightH2: "700",
  weightH3: "600",
  weightH4: "600",
  weightH5: "500",
  weightH6: "500",
  // Icons
  iconXs: "1rem",
  iconSm: "1.25rem",
  iconMd: "1.5rem",
  iconLg: "1.75rem",
  // Controls
  ctrlH: "2.5rem",
  ctrlHSm: "2.25rem",
  ctrlPx: "1rem",
  ctrlPy: "0.5rem",
  // Badge spacing
  badgePx: "0.625rem",
  badgePy: "0.1875rem",
  // Nav / sidebar
  navItemPx: "0.875rem",
  navItemPy: "0.5rem",
  navIconSize: "1.25rem",
  // Card gap
  cardGap: "1.25rem",
  // Decorative hero
  heroAccentH: "0.125rem",
  heroOrbLg: "16rem",
  heroOrbSm: "10rem",
  heroIconPad: "0.875rem",
  // Spacing
  spacePageX: "2rem",
  spacePageY: "1.5rem",
  spaceSection: "2rem",
  spaceCard: "1.75rem",
  spaceFilter: "1.25rem",
  spaceGap: "1rem",
  // Table
  tableHeadText: "0.75rem",
  tableCellText: "0.875rem",
  tableHeadH: "3.25rem",
  tableCellPy: "0.875rem",
  tableCellPx: "1.25rem",
  tableCellLeading: "1.45",
  tableHeadTracking: "0.02em",
  tableCellTracking: "0em",
  // Sidebar
  sbTextLabel: "0.875rem",
  sbTextItem: "1.125rem",
  sbTextSub: "1rem",
  sbTextBadge: "0.8125rem",
  // Layout
  sidebarWidth: sidebarWidthValues.comfortable,
  pillH: "1.75rem",
  pillPx: "0.625rem",
  tablePairCol: "22rem",
  loadingSpinnerScale: "1.5",
  // Leading (line-height) — unitless decimals
  leadingBody: "1.5",
  leadingHeading: "1.2",
  leadingHeadingSm: "1.25",
  leadingCaption: "1.35",
  leadingLabel: "1.25",
  leadingBadge: "1.2",
  leadingMono: "1.45",
  leadingStat: "1.15",
  leadingH1: "1.2",
  leadingH2: "1.25",
  leadingH3: "1.3",
  leadingH4: "1.35",
  leadingH5: "1.4",
  leadingH6: "1.4",
  // Tracking (letter-spacing) — em values
  trackingBody: "0em",
  trackingHeading: "-0.01em",
  trackingHeadingSm: "-0.005em",
  trackingCaps: "0.06em",
  trackingBadge: "0.01em",
  trackingLabel: "0em",
};

export const densityViewportKeys: DensityViewportKey[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
];

export const defaultLayoutDensityTokensByViewport: Record<
  DensityViewportKey,
  LayoutDensityTokens
> = {
  xs: {
    textH1: "1.375rem",
    textH2: "1.25rem",
    textH3: "1rem",
    textH4: "0.9375rem",
    textH5: "0.875rem",
    textH6: "0.8125rem",
    textMicro: "0.5rem",
    textCaption: "0.5rem",
    textLabel: "0.5625rem",
    textBody: "0.625rem",
    textAction: "0.625rem",
    textBadge: "0.5rem",
    textMono: "0.625rem",
    textHeadingSm: "0.75rem",
    textHeading: "0.875rem",
    textStat: "0.875rem",
    badgeH: "0.9rem",
    weightBody: "400",
    weightLabel: "500",
    weightHeading: "600",
    weightAction: "500",
    weightBadge: "500",
    weightTableHead: "600",
    iconXs: "0.75rem",
    iconSm: "0.875rem",
    iconMd: "1rem",
    iconLg: "1.25rem",
    ctrlH: "1.75rem",
    ctrlHSm: "1.5rem",
    ctrlPx: "0.625rem",
    ctrlPy: "0.25rem",
    badgePx: "0.375rem",
    badgePy: "0.0625rem",
    navItemPx: "0.5rem",
    navItemPy: "0.3125rem",
    navIconSize: "0.875rem",
    cardGap: "0.5rem",
    heroAccentH: "0.0625rem",
    heroOrbLg: "8rem",
    heroOrbSm: "5rem",
    heroIconPad: "0.375rem",
    spacePageX: "0.75rem",
    spacePageY: "0.5rem",
    spaceSection: "0.5rem",
    spaceCard: "0.625rem",
    spaceFilter: "0.5rem",
    spaceGap: "0.375rem",
    tableHeadText: "0.5rem",
    tableCellText: "0.5rem",
    tableHeadH: "1.75rem",
    tableCellPy: "0.375rem",
    tableCellPx: "0.4375rem",
    sbTextLabel: "0.5rem",
    sbTextItem: "0.5rem",
    sbTextSub: "0.5rem",
    sbTextBadge: "0.5rem",
    pillH: "1.4rem",
    pillPx: "0.375rem",
    tablePairCol: "14rem",
    loadingSpinnerScale: "1",
  },
  sm: {
    textH1: "1.4375rem",
    textH2: "1.25rem",
    textH3: "1rem",
    textH4: "0.9375rem",
    textH5: "0.875rem",
    textH6: "0.8125rem",
    textMicro: "0.5625rem",
    textCaption: "0.5625rem",
    textLabel: "0.625rem",
    textBody: "0.6875rem",
    textAction: "0.6875rem",
    textBadge: "0.5625rem",
    textMono: "0.6875rem",
    textHeadingSm: "0.8125rem",
    textHeading: "0.9375rem",
    textStat: "0.9375rem",
    badgeH: "1rem",
    weightBody: "400",
    weightLabel: "500",
    weightHeading: "600",
    weightAction: "500",
    weightBadge: "500",
    weightTableHead: "600",
    iconXs: "0.8125rem",
    iconSm: "0.9375rem",
    iconMd: "1.125rem",
    iconLg: "1.375rem",
    ctrlH: "1.875rem",
    ctrlHSm: "1.625rem",
    ctrlPx: "0.75rem",
    ctrlPy: "0.3125rem",
    badgePx: "0.4375rem",
    badgePy: "0.0625rem",
    navItemPx: "0.625rem",
    navItemPy: "0.375rem",
    navIconSize: "0.9375rem",
    cardGap: "0.625rem",
    heroAccentH: "0.0625rem",
    heroOrbLg: "10rem",
    heroOrbSm: "6rem",
    heroIconPad: "0.5rem",
    spacePageX: "0.875rem",
    spacePageY: "0.75rem",
    spaceSection: "0.875rem",
    spaceCard: "0.875rem",
    spaceFilter: "0.75rem",
    spaceGap: "0.625rem",
    tableHeadText: "0.5rem",
    tableCellText: "0.5625rem",
    tableHeadH: "1.875rem",
    tableCellPy: "0.4375rem",
    tableCellPx: "0.5rem",
    sbTextLabel: "0.625rem",
    sbTextItem: "0.6875rem",
    sbTextSub: "0.625rem",
    sbTextBadge: "0.5625rem",
    pillH: "1.5rem",
    pillPx: "0.4375rem",
    tablePairCol: "16rem",
    loadingSpinnerScale: "1",
  },
  md: {
    textH1: "1.5rem",
    textH2: "1.3125rem",
    textH3: "1.0625rem",
    textH4: "1rem",
    textH5: "0.875rem",
    textH6: "0.875rem",
    textMicro: "0.5625rem",
    textCaption: "0.625rem",
    textLabel: "0.6875rem",
    textBody: "0.75rem",
    textAction: "0.6875rem",
    textBadge: "0.625rem",
    textMono: "0.75rem",
    textHeadingSm: "0.9375rem",
    textHeading: "1.0625rem",
    textStat: "1rem",
    badgeH: "1.125rem",
    weightBody: "400",
    weightLabel: "500",
    weightHeading: "600",
    weightAction: "500",
    weightBadge: "500",
    weightTableHead: "600",
    iconXs: "0.875rem",
    iconSm: "0.9375rem",
    iconMd: "1.125rem",
    iconLg: "1.375rem",
    ctrlH: "2rem",
    ctrlHSm: "1.75rem",
    ctrlPx: "0.8125rem",
    ctrlPy: "0.375rem",
    badgePx: "0.5rem",
    badgePy: "0.125rem",
    navItemPx: "0.75rem",
    navItemPy: "0.4375rem",
    navIconSize: "0.9375rem",
    cardGap: "0.75rem",
    heroAccentH: "0.125rem",
    heroOrbLg: "12rem",
    heroOrbSm: "7.5rem",
    heroIconPad: "0.625rem",
    spacePageX: "1rem",
    spacePageY: "0.875rem",
    spaceSection: "1rem",
    spaceCard: "1rem",
    spaceFilter: "0.875rem",
    spaceGap: "0.75rem",
    tableHeadText: "0.5625rem",
    tableCellText: "0.625rem",
    tableHeadH: "2.25rem",
    tableCellPy: "0.5rem",
    tableCellPx: "0.625rem",
    sbTextLabel: "0.75rem",
    sbTextItem: "0.8125rem",
    sbTextSub: "0.75rem",
    sbTextBadge: "0.6875rem",
    pillH: "1.55rem",
    pillPx: "0.5rem",
    tablePairCol: "18rem",
    loadingSpinnerScale: "1.5",
  },
  lg: {
    textH1: "1.563rem",
    textH2: "1.375rem",
    textH3: "1.125rem",
    textH4: "1.0625rem",
    textH5: "0.875rem",
    textH6: "0.875rem",
    textMicro: "0.625rem",
    textCaption: "0.6875rem",
    textLabel: "0.75rem",
    textBody: "0.875rem",
    textAction: "0.875rem",
    textBadge: "0.75rem",
    textMono: "0.875rem",
    textHeadingSm: "1.125rem",
    textHeading: "1.25rem",
    textStat: "1rem",
    badgeH: "1.25rem",
    weightBody: "400",
    weightLabel: "500",
    weightHeading: "600",
    weightAction: "500",
    weightBadge: "500",
    weightTableHead: "600",
    iconXs: "0.875rem",
    iconSm: "1rem",
    iconMd: "1.25rem",
    iconLg: "1.5rem",
    ctrlH: "2.25rem",
    ctrlHSm: "2rem",
    ctrlPx: "0.875rem",
    ctrlPy: "0.4375rem",
    badgePx: "0.5625rem",
    badgePy: "0.125rem",
    navItemPx: "0.8125rem",
    navItemPy: "0.5rem",
    navIconSize: "1rem",
    cardGap: "1rem",
    heroAccentH: "0.125rem",
    heroOrbLg: "14rem",
    heroOrbSm: "9rem",
    heroIconPad: "0.75rem",
    spacePageX: "1.5rem",
    spacePageY: "1.25rem",
    spaceSection: "1.25rem",
    spaceCard: "1.25rem",
    spaceFilter: "1rem",
    spaceGap: "0.875rem",
    tableHeadText: "0.6875rem",
    tableCellText: "0.8125rem",
    tableHeadH: "2.5rem",
    tableCellPy: "0.625rem",
    tableCellPx: "0.875rem",
    sbTextLabel: "0.8125rem",
    sbTextItem: "1rem",
    sbTextSub: "0.9375rem",
    sbTextBadge: "0.8125rem",
    pillH: "1.65rem",
    pillPx: "0.5625rem",
    tablePairCol: "20rem",
    loadingSpinnerScale: "1.5",
  },
  xl: defaultLayoutDensityTokens,
};

const hasResponsiveDensityShape = (
  value: unknown,
): value is ResponsiveLayoutDensity => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return "base" in (value as Record<string, unknown>) || "viewports" in (value as Record<string, unknown>);
};

export const normalizeResponsiveLayoutDensity = (
  value: ResponsiveLayoutDensity | LayoutDensityTokens | null | undefined,
): ResponsiveLayoutDensity | null => {
  if (!value) return null;

  if (hasResponsiveDensityShape(value)) {
    const next: ResponsiveLayoutDensity = {};
    if (value.base && Object.keys(value.base).length > 0) {
      next.base = value.base;
    }

    if (value.viewports) {
      const viewports = Object.fromEntries(
        Object.entries(value.viewports).filter(([, tokens]) => tokens && Object.keys(tokens).length > 0),
      ) as ResponsiveLayoutDensity["viewports"];

      if (viewports && Object.keys(viewports).length > 0) {
        next.viewports = viewports;
      }
    }

    return Object.keys(next).length > 0 ? next : null;
  }

  return Object.keys(value).length > 0 ? { base: value } : null;
};

// Default theme settings used when nothing is saved.
export const defaultThemeSettings: ThemeSettings = {
  mode: "system",
  selectedTheme: "default",
  selectedTweakcnTheme: "",
  selectedBrandTheme: "",
  selectedSidebarTheme: "",
  selectedRadius: "0.5rem",
  brandColors: {},
  importedTheme: null,
  fontFamily: "inter",
  fontFamilyByLocale: {
    en: "inter",
    fa: "yekan",
    ar: "cairo",
    tr: "inter",
  },
  headingTextDecoration: "none",
  fontSize: "1rem",
  contentWidth: "fluid",
  layoutDensity: null,
};

// Default sidebar settings used when nothing is saved.
export const defaultSidebarSettings: SidebarSettings = {
  variant: "inset",
  collapsible: "offcanvas",
  side: "left",
  width: "comfortable",
};

export const defaultLandingSettings: LandingPageSettings = {
  header: {
    enabled: true,
    brandHref: "/",
    signInLabel: "Sign in",
    signInHref: "/sign-in",
  },
  hero: {
    enabled: true,
    eyebrow: "Global travel API gateway",
    title: "One gateway to hundreds of travel APIs worldwide",
    description:
      "Connect flights, hotels, transfers, visas, and tourism services through a single unified platform. Built for OTA teams who need speed, reliability, and global reach.",
    highlight: "hundreds of travel APIs",
    primaryCta: {
      label: "Explore OTA Tickets",
      href: "https://www.otatickets.com",
    },
    secondaryCta: {
      label: "Sign in to dashboard",
      href: "/sign-in",
    },
    imageLightSrc: "/admin/dashboard-light.png",
    imageDarkSrc: "/admin/dashboard-dark.png",
    imageAlt: "OTA Tickets admin dashboard preview",
  },
  stats: {
    enabled: true,
    items: [
      { value: "500+", label: "travel API connections", enabled: true },
      { value: "24/7", label: "real-time availability", enabled: true },
      { value: "50+", label: "destination markets", enabled: true },
      { value: "99.9%", label: "platform uptime", enabled: true },
    ],
  },
  services: {
    enabled: true,
    title: "One platform for every travel product",
    description:
      "Manage flights, hotels, transfers, visas, and more through a unified gateway that connects directly to supplier APIs worldwide.",
    featureOneLightSrc: "/admin/feature-1-light.png",
    featureOneDarkSrc: "/admin/feature-1-dark.png",
    featureTwoLightSrc: "/admin/feature-2-light.png",
    featureTwoDarkSrc: "/admin/feature-2-dark.png",
    items: [
      {
        title: "Flight inventory and scheduling",
        description:
          "Access real-time flight availability, fares, and seat maps from hundreds of airline APIs in a single integrated workspace.",
        icon: "plane",
        enabled: true,
      },
      {
        title: "Hotels, transfers, and packages",
        description:
          "Coordinate room availability, transfer pickups, tour packages, and dynamic bundles from global accommodation providers.",
        icon: "hotel",
        enabled: true,
      },
      {
        title: "Visa and documentation services",
        description:
          "Streamline visa processing, travel document validation, and service delivery workflows for international travelers.",
        icon: "shield-check",
        enabled: true,
      },
    ],
  },
  story: {
    enabled: true,
    title: "Built for modern travel commerce",
    description:
      "The OTA Tickets platform brings together commercial operations, inventory management, and customer service in a single intelligent gateway built for scale.",
    bulletOne: "Secure, multi-factor authentication for your operations team.",
    bulletTwo: "Unified management across flights, hotels, and all travel products.",
    bulletThree: "Real-time sync with global distribution systems and supplier APIs.",
    panelTitle: "OTA Tickets admin dashboard",
    panelDescription:
      "Purpose-built for OTA teams managing high volumes of international travel bookings.",
  },
  faq: {
    enabled: true,
    title: "Frequently asked questions",
    description:
      "Everything you need to know about the OTA Tickets platform.",
    items: [
      {
        question: "What travel products can I manage through OTA Tickets?",
        answer:
          "Flights, hotels, transfers, car rentals, tour packages, visa services, and travel insurance — all accessible via a single unified API gateway.",
        enabled: true,
      },
      {
        question: "How does the API gateway connect to suppliers?",
        answer:
          "OTA Tickets integrates directly with global distribution systems (GDS), airline direct connects, hotel aggregators, and specialist API providers. New connections are added continuously.",
        enabled: true,
      },
      {
        question: "Is multi-user and role-based access supported?",
        answer:
          "Yes. The platform includes granular role-based permissions for commercial, operations, and support teams with full audit trails.",
        enabled: true,
      },
    ],
  },
  cta: {
    enabled: true,
    title: "Ready to connect your travel operations?",
    description:
      "Join OTA teams worldwide using OTA Tickets to manage inventory, pricing, and customer fulfilment through one powerful gateway.",
    primaryCta: {
      label: "Explore OTA Tickets",
      href: "https://www.otatickets.com",
    },
    secondaryCta: {
      label: "Sign in to dashboard",
      href: "/sign-in",
    },
  },
};

export const defaultFooterSettings: FooterSettings = {
  enabled: true,
  brandTitle: "OTA Tickets",
  brandDescription:
    "International travel API gateway connecting flights, hotels, transfers, visas, and tourism services worldwide.",
  brandHref: "https://www.otatickets.com",
  supportLabel: "Support",
  supportHref: "mailto:support@otatickets.com",
  supportSecondaryLabel: "Documentation",
  supportSecondaryHref: "/docs",
  columns: [
    {
      title: "Platform",
      enabled: true,
      links: [
        { label: "Sign in", href: "/sign-in" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Subsystems", href: "/subsystems" },
        { label: "API Gateway", href: "#api" },
      ],
    },
    {
      title: "Solutions",
      enabled: true,
      links: [
        { label: "Flights", href: "#flights" },
        { label: "Hotels", href: "#hotels" },
        { label: "Transfers", href: "#transfers" },
        { label: "Visa Services", href: "#visas" },
      ],
    },
    {
      title: "Company",
      enabled: true,
      links: [
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
        { label: "Partners", href: "#partners" },
        { label: "Careers", href: "#careers" },
      ],
    },
    {
      title: "Resources",
      enabled: true,
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Documentation", href: "#docs" },
        { label: "Community", href: "#community" },
        { label: "Status", href: "#status" },
      ],
    },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/otatickets" },
    { label: "Facebook", href: "https://www.facebook.com/otatickets" },
    { label: "Twitter", href: "https://twitter.com/otatickets" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Security", href: "#security" },
  ],
  copyrightSuffix: "All rights reserved.",
};

// Full default UI context state (theme + sidebar).
export const defaultUiContextState: UiContextState = {
  version: 1,
  theme: defaultThemeSettings,
  sidebar: defaultSidebarSettings,
  landing: defaultLandingSettings,
  footer: defaultFooterSettings,
};
