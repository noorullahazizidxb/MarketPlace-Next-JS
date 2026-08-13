// A saved or built-in theme preset.
export interface ThemePreset {
  label?: string;
  styles: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

// A color theme entry shown in the theme picker.
export interface ColorTheme {
  name: string;
  value: string;
  preset: ThemePreset;
}

// Sidebar variant options.
export interface SidebarVariant {
  name: string;
  value: "sidebar" | "floating" | "inset";
  description: string;
}

// Sidebar collapse options.
export interface SidebarCollapsibleOption {
  name: string;
  value: "offcanvas" | "icon" | "none";
  description: string;
}

// Sidebar side options.
export interface SidebarSideOption {
  name: string;
  value: "left" | "right";
}

// Corner radius options for UI components.
export interface RadiusOption {
  name: string;
  value: string;
}

export type ThemeColorGroupId =
  | "brand-actions"
  | "surfaces-content"
  | "feedback"
  | "boundaries-focus"
  | "data-visualization"
  | "navigation"
  | "commerce";

// Editable semantic colors that map to CSS variables.
export interface BrandColor {
  name: string;
  cssVar: string;
  group?: ThemeColorGroupId;
  description?: string;
}

// A theme imported from outside the app.
export interface ImportedTheme {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export type ThemeStyleMode = "light" | "dark";

/** A user-owned immutable theme preset persisted inside UI context. */
export interface CustomThemePreset {
  id: string;
  name: string;
  styles: ImportedTheme;
  sourcePresetId?: string | null;
  createdAt: string;
  updatedAt: string;
}
