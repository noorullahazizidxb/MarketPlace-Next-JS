import type {
  SidebarVariant,
  SidebarCollapsibleOption,
  SidebarSideOption,
  RadiusOption,
  BrandColor,
  ThemeColorGroupId,
} from "@repo/types";

export const radiusOptions: RadiusOption[] = [
  { name: "0", value: "0rem" },
  { name: "0.3", value: "0.3rem" },
  { name: "0.5", value: "0.5rem" },
  { name: "0.75", value: "0.75rem" },
  { name: "1.0", value: "1rem" },
];

export const sidebarVariants: SidebarVariant[] = [
  { name: "Default", value: "sidebar", description: "Standard sidebar layout" },
  {
    name: "Floating",
    value: "floating",
    description: "Floating sidebar with border",
  },
  {
    name: "Inset",
    value: "inset",
    description: "Inset sidebar with rounded corners",
  },
];

export const sidebarCollapsibleOptions: SidebarCollapsibleOption[] = [
  { name: "Off Canvas", value: "offcanvas", description: "Slides out of view" },
  { name: "Icon", value: "icon", description: "Collapses to icon only" },
  { name: "None", value: "none", description: "Always visible" },
];

export const sidebarSideOptions: SidebarSideOption[] = [
  { name: "Left", value: "left" },
  { name: "Right", value: "right" },
];

export type ThemeColorGroup = {
  id: ThemeColorGroupId;
  label: string;
  description: string;
  cssVars: readonly string[];
};

/**
 * Product-level color contract. Components consume semantic roles; preset
 * hues can change without changing component code.
 */
export const themeColorGroups: ThemeColorGroup[] = [
  {
    id: "brand-actions",
    label: "Brand & actions",
    description: "Primary CTAs, selected states, secondary actions, and brand gradients.",
    cssVars: ["--primary", "--primary-foreground", "--secondary", "--secondary-foreground", "--accent", "--accent-foreground", "--brand-gradient-start", "--brand-gradient-end", "--brand-gradient", "--brand-glow", "--hover-gradient-start", "--hover-gradient-end", "--hover-gradient"],
  },
  {
    id: "surfaces-content",
    label: "Surfaces & content",
    description: "Page, card, popover, passive surface, and readable foreground pairs.",
    cssVars: ["--background", "--foreground", "--card", "--card-foreground", "--popover", "--popover-foreground", "--muted", "--muted-foreground"],
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Success, warning, information, and destructive states with contrast pairs.",
    cssVars: ["--success", "--success-foreground", "--warning", "--warning-foreground", "--info", "--info-foreground", "--destructive", "--destructive-foreground"],
  },
  {
    id: "boundaries-focus",
    label: "Boundaries & focus",
    description: "Borders, form inputs, and accessible keyboard focus indicators.",
    cssVars: ["--border", "--input", "--ring"],
  },
  {
    id: "data-visualization",
    label: "Data visualization",
    description: "Ordered series colors for charts and compact analytical views.",
    cssVars: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"],
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Sidebar surface, content, selected items, boundaries, and focus.",
    cssVars: ["--sidebar", "--sidebar-foreground", "--sidebar-primary", "--sidebar-primary-foreground", "--sidebar-accent", "--sidebar-accent-foreground", "--sidebar-border", "--sidebar-ring"],
  },
  {
    id: "commerce",
    label: "Commerce",
    description: "Price emphasis and sale messaging used by marketplace-style cards.",
    cssVars: ["--price", "--price-sale"],
  },
];

export const baseColors: BrandColor[] = [
  { name: "Primary", cssVar: "--primary" },
  { name: "Primary Foreground", cssVar: "--primary-foreground" },
  { name: "Secondary", cssVar: "--secondary" },
  { name: "Secondary Foreground", cssVar: "--secondary-foreground" },
  { name: "Accent", cssVar: "--accent" },
  { name: "Accent Foreground", cssVar: "--accent-foreground" },
  { name: "Muted", cssVar: "--muted" },
  { name: "Muted Foreground", cssVar: "--muted-foreground" },
  { name: "Foreground", cssVar: "--foreground" },
  { name: "Card Foreground", cssVar: "--card-foreground" },
  { name: "Popover", cssVar: "--popover" },
  { name: "Popover Foreground", cssVar: "--popover-foreground" },
  // ── Brand gradient ─────────────────────────────────────────────────────────
  // The start/end/glow tokens are editable solid colours.  The composite
  // --brand-gradient and --hover-gradient tokens hold computed linear-gradient()
  // strings; they are exposed here so the user can paste a custom value, but
  // the colour picker will not be able to resolve them to a swatch.
  { name: "Brand Gradient Start", cssVar: "--brand-gradient-start" },
  { name: "Brand Gradient End",   cssVar: "--brand-gradient-end" },
  { name: "Brand Gradient",       cssVar: "--brand-gradient" },
  { name: "Brand Glow",           cssVar: "--brand-glow" },
  // ── Hover gradient ─────────────────────────────────────────────────────────
  { name: "Hover Gradient Start", cssVar: "--hover-gradient-start" },
  { name: "Hover Gradient End",   cssVar: "--hover-gradient-end" },
  { name: "Hover Gradient",       cssVar: "--hover-gradient" },
  // ── Status semantic ────────────────────────────────────────────────────────
  { name: "Success", cssVar: "--success" },
  { name: "Success Foreground", cssVar: "--success-foreground" },
  { name: "Warning", cssVar: "--warning" },
  { name: "Warning Foreground", cssVar: "--warning-foreground" },
  { name: "Info", cssVar: "--info" },
  { name: "Info Foreground", cssVar: "--info-foreground" },
  { name: "Destructive", cssVar: "--destructive" },
  { name: "Destructive Foreground", cssVar: "--destructive-foreground" },
  // ── Data visualization ─────────────────────────────────────────────────────
  { name: "Chart 1", cssVar: "--chart-1" },
  { name: "Chart 2", cssVar: "--chart-2" },
  { name: "Chart 3", cssVar: "--chart-3" },
  { name: "Chart 4", cssVar: "--chart-4" },
  { name: "Chart 5", cssVar: "--chart-5" },
  // ── Sidebar ────────────────────────────────────────────────────────────────
  { name: "Sidebar Background", cssVar: "--sidebar" },
  { name: "Sidebar Foreground", cssVar: "--sidebar-foreground" },
  { name: "Sidebar Primary", cssVar: "--sidebar-primary" },
  { name: "Sidebar Primary Fg", cssVar: "--sidebar-primary-foreground" },
  { name: "Sidebar Accent", cssVar: "--sidebar-accent" },
  { name: "Sidebar Accent Fg", cssVar: "--sidebar-accent-foreground" },
  { name: "Sidebar Border", cssVar: "--sidebar-border" },
  { name: "Sidebar Ring", cssVar: "--sidebar-ring" },
  // ── Surface ────────────────────────────────────────────────────────────────
  { name: "Background", cssVar: "--background" },
  { name: "Card", cssVar: "--card" },
  { name: "Border", cssVar: "--border" },
  { name: "Input", cssVar: "--input" },
  { name: "Ring", cssVar: "--ring" },
  // ── Price / e-commerce ─────────────────────────────────────────────────────
  { name: "Price", cssVar: "--price" },
  { name: "Price Sale", cssVar: "--price-sale" },
];
