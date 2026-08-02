import * as React from "react";
import {
  TbArrowsHorizontal,
  TbArrowsVertical,
  TbBold,
  TbBoxPadding,
  TbBrush,
  TbDeviceDesktop,
  TbDeviceLaptop,
  TbDeviceMobile,
  TbDeviceMobileDown,
  TbDeviceTablet,
  TbLayout,
  TbLayoutSidebar,
  TbLetterCase,
  TbRefresh,
  TbRuler,
  TbSpacingHorizontal,
  TbSpacingVertical,
  TbStar,
  TbTextSize,
  TbTypography,
  TbWeight,
} from "react-icons/tb";
import {
  formatLayoutDensityCSSValue,
  LAYOUT_DENSITY_UNITLESS_KEYS,
  parseLayoutDensityNumeric,
  resolveLayoutDensityToken,
} from "@repo/constants";
import type {
  AdminPageId,
  DensityViewportKey,
  LayoutDensityTokens,
  ResponsiveLayoutDensity,
} from "@repo/types";
import type { AppearanceDensityTab } from "@/components/settings/appearance-preview-registry";
export type { AppearanceDensityTab } from "@/components/settings/appearance-preview-registry";

export type LayoutDensityTokenKey = keyof LayoutDensityTokens;
export type DensityScope = "default" | DensityViewportKey;
export type PageScope = "global" | AdminPageId;

export type TokenMeta = {
  key: LayoutDensityTokenKey;
  label: string;
  description: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  step: number;
  /** Override the displayed unit; defaults to "rem" for rem tokens, "" for unitless */
  unit?: string;
};

export type TokenCategory = {
  id: AppearanceDensityTab;
  label: string;
  previewVariant:
  | "typography"
  | "layout"
  | "spacing"
  | "fontPreview"
  | "base-tokens"
  | "icons"
  | "controls"
  | "table"
  | "sidebar"
  | "mobile"
  | "cards"
  | "weights"
  | "decorative"
  | "loading";
  icon: React.ReactNode;
  tokens: TokenMeta[];
};

export type TokenGroupMeta = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  keys: LayoutDensityTokenKey[];
};

export const BREAKPOINTS: Array<{
  key: DensityViewportKey;
  label: string;
  cssMax: string;
  icon: React.ReactNode;
  hint: string;
}> = [
    { key: "xs", label: "XS", cssMax: "320px", icon: <TbDeviceMobileDown className="app-icon-xs shrink-0" />, hint: "Phones under 640px" },
    { key: "sm", label: "SM", cssMax: "640px", icon: <TbDeviceMobile className="app-icon-xs shrink-0" />, hint: "Large phones" },
    { key: "md", label: "MD", cssMax: "768px", icon: <TbDeviceTablet className="app-icon-xs shrink-0" />, hint: "Tablets" },
    { key: "lg", label: "LG", cssMax: "1024px", icon: <TbDeviceLaptop className="app-icon-xs shrink-0" />, hint: "Laptops" },
    { key: "xl", label: "XL", cssMax: "1280px", icon: <TbDeviceDesktop className="app-icon-xs shrink-0" />, hint: "Desktops" },
  ];

export const CSS_VAR_BY_KEY: Record<LayoutDensityTokenKey, string> = {
  textH1: "--text-h1",
  textH2: "--text-h2",
  textH3: "--text-h3",
  textH4: "--text-h4",
  textH5: "--text-h5",
  textH6: "--text-h6",
  textMicro: "--text-micro",
  textCaption: "--text-caption",
  textLabel: "--text-label",
  textBody: "--text-body",
  textAction: "--text-action",
  textBadge: "--text-badge",
  textMono: "--text-mono",
  textHeadingSm: "--text-heading-sm",
  textHeading: "--text-heading",
  textStat: "--text-stat",
  badgeH: "--badge-h",
  weightBody: "--weight-body",
  weightLabel: "--weight-label",
  weightHeading: "--weight-heading",
  weightAction: "--weight-action",
  weightBadge: "--weight-badge",
  weightTableHead: "--weight-table-head",
  weightH1: "--weight-h1",
  weightH2: "--weight-h2",
  weightH3: "--weight-h3",
  weightH4: "--weight-h4",
  weightH5: "--weight-h5",
  weightH6: "--weight-h6",
  iconXs: "--icon-xs",
  iconSm: "--icon-sm",
  iconMd: "--icon-md",
  iconLg: "--icon-lg",
  ctrlH: "--ctrl-h",
  ctrlHSm: "--ctrl-h-sm",
  ctrlPx: "--ctrl-px",
  ctrlPy: "--ctrl-py",
  badgePx: "--badge-px",
  badgePy: "--badge-py",
  navItemPx: "--nav-item-px",
  navItemPy: "--nav-item-py",
  navIconSize: "--nav-icon-size",
  cardGap: "--card-gap",
  heroAccentH: "--hero-accent-h",
  heroOrbLg: "--hero-orb-lg",
  heroOrbSm: "--hero-orb-sm",
  heroIconPad: "--hero-icon-pad",
  spacePageX: "--space-page-x",
  spacePageY: "--space-page-y",
  spaceSection: "--space-section",
  spaceCard: "--space-card",
  spaceFilter: "--space-filter",
  spaceGap: "--space-gap",
  tableHeadText: "--table-head-text",
  tableCellText: "--table-cell-text",
  tableHeadH: "--table-head-h",
  tableCellPy: "--table-cell-py",
  tableCellPx: "--table-cell-px",
  tableCellLeading: "--table-cell-leading",
  tableHeadTracking: "--table-head-tracking",
  tableCellTracking: "--table-cell-tracking",
  sbTextLabel: "--sb-text-label",
  sbTextItem: "--sb-text-item",
  sbTextSub: "--sb-text-sub",
  sbTextBadge: "--sb-text-badge",
  sidebarWidth: "--app-sidebar-width",
  pillH: "--pill-h",
  pillPx: "--pill-px",
  loadingSpinnerScale: "--loading-spinner-scale",
  // ── Leading (line-height) ──────────────────────────────────────────────
  leadingBody: "--leading-body",
  leadingHeading: "--leading-heading",
  leadingHeadingSm: "--leading-heading-sm",
  leadingCaption: "--leading-caption",
  leadingLabel: "--leading-label",
  leadingBadge: "--leading-badge",
  leadingMono: "--leading-mono",
  leadingStat: "--leading-stat",
  leadingH1: "--leading-h1",
  leadingH2: "--leading-h2",
  leadingH3: "--leading-h3",
  leadingH4: "--leading-h4",
  leadingH5: "--leading-h5",
  leadingH6: "--leading-h6",
  // ── Tracking (letter-spacing) ─────────────────────────────────────────
  trackingBody: "--tracking-body",
  trackingHeading: "--tracking-heading",
  trackingHeadingSm: "--tracking-heading-sm",
  trackingCaps: "--tracking-caps",
  trackingBadge: "--tracking-badge",
  trackingLabel: "--tracking-label",
};

export const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    id: "typography",
    label: "Typography",
    previewVariant: "base-tokens",
    icon: <TbTypography className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "textBody", label: "Body Text", description: "Paragraph, input, and table body text.", icon: <TbTypography className="app-icon-sm" />, min: 0.6, max: 1.5, step: 0.005 },
      { key: "textHeading", label: "Page Heading", description: "Page-level H1 heading size.", icon: <TbBold className="app-icon-sm" />, min: 0.8, max: 2.5, step: 0.01 },
      { key: "textHeadingSm", label: "Section Heading", description: "Card and section heading size.", icon: <TbBold className="app-icon-sm" />, min: 0.7, max: 2, step: 0.01 },
      { key: "textH1", label: "H1 Size", description: "Semantic H1 heading size.", icon: <TbBold className="app-icon-sm" />, min: 1, max: 3, step: 0.01 },
      { key: "textH2", label: "H2 Size", description: "Semantic H2 heading size.", icon: <TbBold className="app-icon-sm" />, min: 0.9, max: 2.5, step: 0.01 },
      { key: "textH3", label: "H3 Size", description: "Semantic H3 heading size.", icon: <TbBold className="app-icon-sm" />, min: 0.8, max: 2.2, step: 0.01 },
      { key: "textH4", label: "H4 Size", description: "Semantic H4 heading size.", icon: <TbBold className="app-icon-sm" />, min: 0.75, max: 2, step: 0.01 },
      { key: "textH5", label: "H5 Size", description: "Semantic H5 heading size.", icon: <TbBold className="app-icon-sm" />, min: 0.7, max: 1.75, step: 0.01 },
      { key: "textH6", label: "H6 Size", description: "Semantic H6 heading size.", icon: <TbBold className="app-icon-sm" />, min: 0.65, max: 1.5, step: 0.01 },
      { key: "textStat", label: "Stat Value", description: "KPI / hero stat number size.", icon: <TbTextSize className="app-icon-sm" />, min: 0.6, max: 2, step: 0.01 },
      { key: "textLabel", label: "Label", description: "Field labels and filter captions.", icon: <TbLetterCase className="app-icon-sm" />, min: 0.45, max: 1, step: 0.005 },
      { key: "textAction", label: "Button Text", description: "Buttons and CTA labels.", icon: <TbLetterCase className="app-icon-sm" />, min: 0.5, max: 1.2, step: 0.005 },
      { key: "textCaption", label: "Caption", description: "Eyebrow caps and secondary info.", icon: <TbLetterCase className="app-icon-sm" />, min: 0.45, max: 0.9, step: 0.005 },
      { key: "textBadge", label: "Badge Text", description: "Status chips and badge labels.", icon: <TbStar className="app-icon-sm" />, min: 0.45, max: 0.9, step: 0.005 },
      { key: "textMicro", label: "Micro Text", description: "Dense tiny labels (~10px).", icon: <TbTextSize className="app-icon-sm" />, min: 0.4, max: 0.8, step: 0.005 },
      { key: "textMono", label: "Mono / Code", description: "Monospaced values and code blocks.", icon: <TbLetterCase className="app-icon-sm" />, min: 0.5, max: 1.1, step: 0.005 },
      { key: "badgeH", label: "Badge Height", description: "Minimum badge/pill height.", icon: <TbRuler className="app-icon-sm" />, min: 0.8, max: 1.75, step: 0.01 },
      // ── Line-height controls ──────────────────────────────────────────────
      { key: "leadingBody", label: "Body Line-Height", description: "Line-height for body, input, and table body text.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2.2, step: 0.05, unit: "" },
      { key: "leadingHeading", label: "Heading Line-Height", description: "Line-height for page-level headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 1.8, step: 0.05, unit: "" },
      { key: "leadingHeadingSm", label: "Section Heading Line-Height", description: "Line-height for card and section headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 1.8, step: 0.05, unit: "" },
      { key: "leadingH1", label: "H1 Line-Height", description: "Line-height for semantic H1 headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2, step: 0.05, unit: "" },
      { key: "leadingH2", label: "H2 Line-Height", description: "Line-height for semantic H2 headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2, step: 0.05, unit: "" },
      { key: "leadingH3", label: "H3 Line-Height", description: "Line-height for semantic H3 headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2, step: 0.05, unit: "" },
      { key: "leadingH4", label: "H4 Line-Height", description: "Line-height for semantic H4 headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2, step: 0.05, unit: "" },
      { key: "leadingH5", label: "H5 Line-Height", description: "Line-height for semantic H5 headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2, step: 0.05, unit: "" },
      { key: "leadingH6", label: "H6 Line-Height", description: "Line-height for semantic H6 headings.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2, step: 0.05, unit: "" },
      { key: "leadingCaption", label: "Caption Line-Height", description: "Line-height for captions and eyebrow text.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2, step: 0.05, unit: "" },
      { key: "leadingLabel", label: "Label Line-Height", description: "Line-height for form and filter labels.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 1.8, step: 0.05, unit: "" },
      { key: "leadingBadge", label: "Badge Line-Height", description: "Line-height for badges and chips.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 1.6, step: 0.05, unit: "" },
      { key: "leadingMono", label: "Mono Line-Height", description: "Line-height for monospaced/code blocks.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2.2, step: 0.05, unit: "" },
      // ── Letter-spacing controls ───────────────────────────────────────────
      { key: "trackingBody", label: "Body Letter-Spacing", description: "Letter-spacing for body text (em units).", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: -0.05, max: 0.1, step: 0.005, unit: "em" },
      { key: "trackingHeading", label: "Heading Letter-Spacing", description: "Letter-spacing for page headings.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: -0.05, max: 0.05, step: 0.005, unit: "em" },
      { key: "trackingCaps", label: "Caps Letter-Spacing", description: "Letter-spacing for uppercase / eyebrow labels.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: 0, max: 0.2, step: 0.005, unit: "em" },
      { key: "trackingBadge", label: "Badge Letter-Spacing", description: "Letter-spacing for status badges.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: -0.02, max: 0.08, step: 0.005, unit: "em" },
      { key: "trackingLabel", label: "Label Letter-Spacing", description: "Letter-spacing for form labels.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: -0.02, max: 0.1, step: 0.005, unit: "em" },
    ],
  },
  {
    id: "weights",
    label: "Weights",
    previewVariant: "weights",
    icon: <TbWeight className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "weightBody", label: "Body Weight", description: "Regular body text and table cell font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 700, step: 100 },
      { key: "weightLabel", label: "Label Weight", description: "Form label and filter label font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 700, step: 100 },
      { key: "weightHeading", label: "Heading Weight", description: "Card and section heading font weight.", icon: <TbWeight className="app-icon-sm" />, min: 400, max: 800, step: 100 },
      { key: "weightH1", label: "H1 Weight", description: "Semantic H1 heading font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 900, step: 100 },
      { key: "weightH2", label: "H2 Weight", description: "Semantic H2 heading font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 900, step: 100 },
      { key: "weightH3", label: "H3 Weight", description: "Semantic H3 heading font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 900, step: 100 },
      { key: "weightH4", label: "H4 Weight", description: "Semantic H4 heading font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 900, step: 100 },
      { key: "weightH5", label: "H5 Weight", description: "Semantic H5 heading font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 900, step: 100 },
      { key: "weightH6", label: "H6 Weight", description: "Semantic H6 heading font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 900, step: 100 },
      { key: "weightAction", label: "Action Weight", description: "Button and CTA label font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 700, step: 100 },
      { key: "weightBadge", label: "Badge Weight", description: "Badge and chip text font weight.", icon: <TbWeight className="app-icon-sm" />, min: 300, max: 700, step: 100 },
      { key: "weightTableHead", label: "Table Head Weight", description: "Table column header font weight.", icon: <TbWeight className="app-icon-sm" />, min: 400, max: 800, step: 100 },
    ],
  },
  {
    id: "icons",
    label: "Icons",
    previewVariant: "icons",
    icon: <TbLayout className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "iconLg", label: "Icon LG", description: "Large/decorative icon size.", icon: <TbLayout className="app-icon-sm" />, min: 0.75, max: 2.5, step: 0.01 },
      { key: "iconMd", label: "Icon MD", description: "Medium icon size.", icon: <TbLayout className="app-icon-sm" />, min: 0.6, max: 2, step: 0.01 },
      { key: "iconSm", label: "Icon SM", description: "Standard inline icon size.", icon: <TbLayout className="app-icon-sm" />, min: 0.5, max: 1.75, step: 0.01 },
      { key: "iconXs", label: "Icon XS", description: "Compact inline icon size.", icon: <TbLayout className="app-icon-sm" />, min: 0.35, max: 1.5, step: 0.01 },
    ],
  },
  {
    id: "controls",
    label: "Controls",
    previewVariant: "controls",
    icon: <TbRuler className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "ctrlH", label: "Control Height", description: "Default button/select/input height.", icon: <TbRuler className="app-icon-sm" />, min: 1.5, max: 3.5, step: 0.025 },
      { key: "ctrlHSm", label: "Control Height SM", description: "Small button/input height.", icon: <TbRuler className="app-icon-sm" />, min: 1.25, max: 3, step: 0.025 },
      { key: "ctrlPx", label: "Control Padding X", description: "Horizontal padding inside controls.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: 0.25, max: 1.5, step: 0.01 },
      { key: "ctrlPy", label: "Control Padding Y", description: "Vertical padding inside controls.", icon: <TbArrowsVertical className="app-icon-sm" />, min: 0.125, max: 1, step: 0.01 },
    ],
  },
  {
    id: "spacing",
    label: "Spacing",
    previewVariant: "spacing",
    icon: <TbBoxPadding className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "spacePageX", label: "Page Padding X", description: "Horizontal page gutter.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: 0.5, max: 3, step: 0.025 },
      { key: "spacePageY", label: "Page Padding Y", description: "Vertical page gutter.", icon: <TbArrowsVertical className="app-icon-sm" />, min: 0.25, max: 2.5, step: 0.025 },
      { key: "spaceSection", label: "Section Gap", description: "Gap between page sections.", icon: <TbSpacingHorizontal className="app-icon-sm" />, min: 0.25, max: 3, step: 0.025 },
      { key: "spaceCard", label: "Card Padding", description: "Inner card padding.", icon: <TbBoxPadding className="app-icon-sm" />, min: 0.25, max: 2.5, step: 0.025 },
      { key: "spaceFilter", label: "Filter Padding", description: "Inner filter-bar padding.", icon: <TbBoxPadding className="app-icon-sm" />, min: 0.25, max: 2, step: 0.025 },
      { key: "spaceGap", label: "Component Gap", description: "Generic gap between adjacent elements.", icon: <TbSpacingHorizontal className="app-icon-sm" />, min: 0.125, max: 1.5, step: 0.01 },
      { key: "cardGap", label: "Card Inner Gap", description: "Gap between card content sections.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 0.25, max: 2, step: 0.01 },
      { key: "badgePx", label: "Badge Padding X", description: "Badge horizontal padding.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: 0.125, max: 1, step: 0.01 },
      { key: "badgePy", label: "Badge Padding Y", description: "Badge vertical padding.", icon: <TbArrowsVertical className="app-icon-sm" />, min: 0, max: 0.5, step: 0.005 },
    ],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    previewVariant: "sidebar",
    icon: <TbLayoutSidebar className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "sbTextLabel", label: "Group Label", description: "Sidebar group label size.", icon: <TbLayoutSidebar className="app-icon-sm" />, min: 0.35, max: 1, step: 0.005 },
      { key: "sbTextItem", label: "Nav Item", description: "Sidebar nav item text.", icon: <TbLayoutSidebar className="app-icon-sm" />, min: 0.35, max: 1.25, step: 0.005 },
      { key: "sbTextSub", label: "Sub Item", description: "Sidebar nested item text.", icon: <TbLayoutSidebar className="app-icon-sm" />, min: 0.35, max: 1.1, step: 0.005 },
      { key: "sbTextBadge", label: "Badge", description: "Sidebar badge/counter text.", icon: <TbLayoutSidebar className="app-icon-sm" />, min: 0.35, max: 0.95, step: 0.005 },
      { key: "navItemPx", label: "Nav Item Padding X", description: "Sidebar nav item horizontal padding.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: 0.25, max: 1.5, step: 0.01 },
      { key: "navItemPy", label: "Nav Item Padding Y", description: "Sidebar nav item vertical padding.", icon: <TbArrowsVertical className="app-icon-sm" />, min: 0.125, max: 1, step: 0.01 },
      { key: "navIconSize", label: "Nav Icon Size", description: "Sidebar nav item icon size.", icon: <TbLayout className="app-icon-sm" />, min: 0.5, max: 1.75, step: 0.01 },
      { key: "sidebarWidth", label: "Sidebar Width", description: "Sidebar width in rem.", icon: <TbLayoutSidebar className="app-icon-sm" />, min: 10, max: 24, step: 0.125 },
    ],
  },
  {
    id: "table",
    label: "Table",
    previewVariant: "table",
    icon: <TbLayout className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "tableHeadText", label: "Header Font", description: "Column header text size.", icon: <TbBold className="app-icon-sm" />, min: 0.4, max: 1, step: 0.005 },
      { key: "tableCellText", label: "Cell Font", description: "Table row body text size.", icon: <TbTextSize className="app-icon-sm" />, min: 0.45, max: 1.1, step: 0.005 },
      { key: "tableHeadH", label: "Header Height", description: "Header row height.", icon: <TbArrowsVertical className="app-icon-sm" />, min: 1.5, max: 4, step: 0.025 },
      { key: "tableCellPy", label: "Cell Padding Y", description: "Vertical cell padding.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 0.15, max: 1.25, step: 0.01 },
      { key: "tableCellPx", label: "Cell Padding X", description: "Horizontal cell padding.", icon: <TbSpacingHorizontal className="app-icon-sm" />, min: 0.15, max: 1.5, step: 0.01 },
      { key: "tableCellLeading", label: "Cell Line-Height", description: "Line-height for table cell content.", icon: <TbSpacingVertical className="app-icon-sm" />, min: 1, max: 2.2, step: 0.05, unit: "" },
      { key: "tableHeadTracking", label: "Header Letter-Spacing", description: "Letter-spacing for column header labels.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: 0, max: 0.2, step: 0.005, unit: "em" },
      { key: "tableCellTracking", label: "Cell Letter-Spacing", description: "Letter-spacing for table cell text.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: -0.02, max: 0.1, step: 0.005, unit: "em" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    previewVariant: "mobile",
    icon: <TbDeviceMobile className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "pillH", label: "Pill Height", description: "Mobile quick-action pill height.", icon: <TbDeviceMobile className="app-icon-sm" />, min: 1, max: 2.5, step: 0.01 },
      { key: "pillPx", label: "Pill Padding X", description: "Horizontal padding inside mobile quick-action pills.", icon: <TbArrowsHorizontal className="app-icon-sm" />, min: 0.125, max: 1, step: 0.01 },
    ],
  },
  {
    id: "loading-motion",
    label: "Loading & Motion",
    previewVariant: "loading",
    icon: <TbRefresh className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "loadingSpinnerScale", label: "Spinner Scale", description: "Scale multiplier for loading spinner animations.", icon: <TbRefresh className="app-icon-sm" />, min: 0.5, max: 3, step: 0.25 },
    ],
  },
  {
    id: "decorative",
    label: "Decorative",
    previewVariant: "decorative",
    icon: <TbBrush className="app-icon-sm shrink-0" aria-hidden />,
    tokens: [
      { key: "heroAccentH", label: "Accent Bar Height", description: "Height of gradient accent bars used in page headers.", icon: <TbBrush className="app-icon-sm" />, min: 0.0625, max: 0.5, step: 0.0625 },
      { key: "heroOrbLg", label: "Orb Size LG", description: "Diameter of the large blur orb decorations.", icon: <TbBrush className="app-icon-sm" />, min: 4, max: 24, step: 0.5 },
      { key: "heroOrbSm", label: "Orb Size SM", description: "Diameter of the small blur orb decorations.", icon: <TbBrush className="app-icon-sm" />, min: 2, max: 16, step: 0.25 },
      { key: "heroIconPad", label: "Hero Icon Pad", description: "Padding inside icon boxes in hero/header sections.", icon: <TbBrush className="app-icon-sm" />, min: 0.25, max: 1.5, step: 0.01 },
    ],
  },
];

export const TYPOGRAPHY_TOKEN_GROUPS: TokenGroupMeta[] = [
  {
    id: "type-core",
    label: "Core Text Scale",
    description: "Body, labels, actions, captions, badges, and shared text primitives.",
    icon: <TbTypography className="app-icon-sm" aria-hidden />,
    keys: [
      "textBody",
      "textHeading",
      "textHeadingSm",
      "textStat",
      "textLabel",
      "textAction",
      "textCaption",
      "textBadge",
      "textMicro",
      "textMono",
      "badgeH",
    ],
  },
  {
    id: "type-h",
    label: "Semantic Headings (H1-H6)",
    description: "Direct semantic heading scale controls for H1 through H6.",
    icon: <TbBold className="app-icon-sm" aria-hidden />,
    keys: ["textH1", "textH2", "textH3", "textH4", "textH5", "textH6"],
  },
  {
    id: "leading-core",
    label: "Line Height (Core)",
    description: "Line-height for body, headings, captions, labels, badges, and mono text.",
    icon: <TbSpacingVertical className="app-icon-sm" aria-hidden />,
    keys: [
      "leadingBody",
      "leadingHeading",
      "leadingHeadingSm",
      "leadingCaption",
      "leadingLabel",
      "leadingBadge",
      "leadingMono",
    ],
  },
  {
    id: "leading-h",
    label: "Line Height (H1-H6)",
    description: "Semantic heading line-height controls for H1 through H6.",
    icon: <TbSpacingVertical className="app-icon-sm" aria-hidden />,
    keys: ["leadingH1", "leadingH2", "leadingH3", "leadingH4", "leadingH5", "leadingH6"],
  },
  {
    id: "tracking",
    label: "Letter Spacing",
    description: "Tracking for body, headings, caps labels, badges, and field labels.",
    icon: <TbArrowsHorizontal className="app-icon-sm" aria-hidden />,
    keys: ["trackingBody", "trackingHeading", "trackingCaps", "trackingBadge", "trackingLabel"],
  },
];

export const getBreakpointFromWidth = (width: number): DensityViewportKey => {
  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  return "xl";
};

/** Keys whose CSS values are unitless numbers (font-weight, etc.) */
export const UNITLESS_KEYS = LAYOUT_DENSITY_UNITLESS_KEYS;

export const formatTokenValue = (value: number, key: LayoutDensityTokenKey): string =>
  formatLayoutDensityCSSValue(key, value);

export const parseTokenOverrideValue = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

export const buildTypographyTokenGroups = (tokens: TokenMeta[]) => {
  const tokenByKey = new Map(tokens.map((token) => [token.key, token] as const));

  return TYPOGRAPHY_TOKEN_GROUPS.map((group) => ({
    ...group,
    tokens: group.keys
      .map((key) => tokenByKey.get(key))
      .filter((token): token is TokenMeta => Boolean(token)),
  })).filter((group) => group.tokens.length > 0);
};

export const getScopeViewport = (scope: DensityScope): DensityViewportKey =>
  scope === "default" ? "xl" : scope;

export const buildPreviewStyle = (
  density: ResponsiveLayoutDensity | null,
  scope: DensityScope,
  pageTokenOverrides?: Partial<Record<LayoutDensityTokenKey, unknown>>,
): React.CSSProperties => {
  const viewport = getScopeViewport(scope);
  const style: Record<string, string> = {};

  (Object.keys(CSS_VAR_BY_KEY) as LayoutDensityTokenKey[]).forEach((key) => {
    const overrideValue = parseTokenOverrideValue(pageTokenOverrides?.[key]);
    const value =
      overrideValue ??
      resolveLayoutDensityToken(viewport, key, density);

    style[CSS_VAR_BY_KEY[key]] = formatTokenValue(value, key);
  });

  return style as React.CSSProperties;
};

export const cloneDensityDraft = (
  density: ResponsiveLayoutDensity | null,
): ResponsiveLayoutDensity | null => {
  if (!density) return null;

  return {
    base: density.base ? { ...density.base } : undefined,
    viewports: density.viewports
      ? (Object.fromEntries(
        Object.entries(density.viewports).map(([viewport, tokens]) => [
          viewport,
          { ...(tokens ?? {}) },
        ]),
      ) as ResponsiveLayoutDensity["viewports"])
      : undefined,
  };
};

export const DENSITY_LABELS = {
  title: "Density Studio",
  description:
    "Adjust typography, spacing, controls, and page density tokens with live preview feedback.",
  resetAll: "Reset all overrides",
} as const;
