/**
 * Single source of truth for the DevMinds product family: footer cards and
 * JSON-LD both read from this list. Logo widths are the intrinsic widths of
 * the 32px-tall SVGs in /brand/products (used for width/height attributes).
 */
export type ProductSlug =
  | "portfolio"
  | "ourworks"
  | "notes"
  | "marketplace"
  | "jobs"
  | "budget-manager"
  | "restaurant-maps";

export type LogoVariant = "light" | "dark" | "icon-light" | "icon-dark";

export interface DevmindsProduct {
  slug: ProductSlug;
  name: string;
  url: string;
  /** Short card descriptor (one line). */
  descriptor: string;
  /** Longer description for structured data. */
  description: string;
  /** schema.org applicationCategory; null for non-app sites. */
  category: string | null;
  logoWidths: Record<LogoVariant, number>;
}

export const LOGO_HEIGHT = 32;
/** Logos at least this wide get a double-width card. */
const WIDE_LOGO_MIN_WIDTH = 260;

export const DEVMINDS_PRODUCTS: readonly DevmindsProduct[] = [
  { slug: "portfolio", name: "DevMinds", url: "https://devminds.net/", descriptor: "Digital product studio", description: "DevMinds digital product studio: web platforms, mobile apps and live products by Noorullah Azizi.", category: null, logoWidths: { light: 98, dark: 116, "icon-light": 38, "icon-dark": 38 } },
  { slug: "ourworks", name: "OurWorks", url: "https://ourworks.devminds.net/", descriptor: "Case studies & shipped work", description: "Portfolio of DevMinds projects: web platforms, mobile apps and brand experiences.", category: "WebApplication", logoWidths: { light: 320, dark: 297, "icon-light": 29, "icon-dark": 27 } },
  { slug: "notes", name: "DevMinds Notes", url: "https://notes.devminds.net/", descriptor: "Free note-taking app", description: "Fast, free note taking app with rich text, folders, search and sync across devices.", category: "ProductivityApplication", logoWidths: { light: 131, dark: 170, "icon-light": 36, "icon-dark": 36 } },
  { slug: "marketplace", name: "DevMinds Marketplace", url: "https://marketplace.devminds.net/", descriptor: "Buy, sell & rent online", description: "Online marketplace to buy, sell and rent products, property and vehicles across Afghanistan.", category: "ShoppingApplication", logoWidths: { light: 128, dark: 205, "icon-light": 30, "icon-dark": 29 } },
  { slug: "jobs", name: "DevMinds Jobs", url: "https://jobs.devminds.net/", descriptor: "Jobs, companies & hiring", description: "Jobs platform to search jobs, explore companies, hire services and learn new skills.", category: "BusinessApplication", logoWidths: { light: 129, dark: 162, "icon-light": 39, "icon-dark": 38 } },
  { slug: "budget-manager", name: "Budget Manager", url: "https://budget-manager.devminds.net/", descriptor: "Budget planning & tracking", description: "Budget app to plan, allocate and track your income and expenses by category.", category: "FinanceApplication", logoWidths: { light: 414, dark: 383, "icon-light": 29, "icon-dark": 27 } },
  { slug: "restaurant-maps", name: "Restaurant Maps", url: "https://resturant-maps.devminds.net/", descriptor: "Find restaurants on a map", description: "Interactive map to discover restaurants nearby, with menus, opening hours and directions.", category: "TravelApplication", logoWidths: { light: 410, dark: 381, "icon-light": 26, "icon-dark": 26 } },
];

export function productLogoSrc(slug: ProductSlug, variant: LogoVariant): string {
  return `/brand/products/${slug}-${variant}.svg`;
}

export function hasWideLogo(product: DevmindsProduct): boolean {
  return Math.max(product.logoWidths.light, product.logoWidths.dark) >= WIDE_LOGO_MIN_WIDTH;
}
