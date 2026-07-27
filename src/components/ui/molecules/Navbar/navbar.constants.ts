/**
 * Auth modal steps passed to `AuthPage` via Navbar `initialStep`.
 * Must stay aligned with `@repo/auth` `AuthStep` string literals (UI does not depend on auth package).
 */
export const NAVBAR_AUTH_MODAL_STEPS = {
  signIn: "loginWithPassword",
  signUp: "register",
  recoverPassword: "recoverPassword",
} as const;

export type NavbarAuthModalStep =
  (typeof NAVBAR_AUTH_MODAL_STEPS)[keyof typeof NAVBAR_AUTH_MODAL_STEPS];

export const BRAND_URL = "https://otatraveltours.com";

export const DEFAULT_BRAND_NAME = "Travel Tours";

/** @deprecated Use `useBrandName()` or `resolveBrandName()` for domain-aware branding. */
export const BRAND_NAME = DEFAULT_BRAND_NAME;

export const BRAND_BY_HOST = {
  "otatraveltours.com": "Travel Tours",
  "new.arghavansafar.com": "Arghavan Safar",
  "otaflights.com": "Flights",
} as const satisfies Record<string, string>;

export function normalizeBrandHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");
}

export function resolveBrandName(host: string | null | undefined): string {
  if (!host) return DEFAULT_BRAND_NAME;
  return (
    BRAND_BY_HOST[normalizeBrandHost(host) as keyof typeof BRAND_BY_HOST] ??
    DEFAULT_BRAND_NAME
  );
}

export const SUPPORTED_LOCALES = new Set(["en", "fa", "ar"]);

export type NavItem = {
  name: string;
  href: string;
  hasMegaMenu?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/" },
  // { name: "Features", href: "#features" },
  // { name: "Solutions", href: "#features", hasMegaMenu: true },
  // { name: "FAQ", href: "#faq" },
  { name: "Teams", href: "#teams" },
  { name: "Contact", href: "#contact" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Address", href: "/address" },
  { name: "About Us", href: "/about-us" },
];

export type SolutionItem =
  | { kind: "header"; title: string }
  | { kind: "link"; name: string; href: string };

export const SOLUTIONS_ITEMS: SolutionItem[] = [
  { kind: "header", title: "Browse Products" },
  { kind: "link", name: "Free Blocks", href: "#free-blocks" },
  { kind: "link", name: "Premium Templates", href: "#premium-templates" },
  { kind: "link", name: "Admin Dashboards", href: "#admin-dashboards" },
  { kind: "link", name: "Landing Pages", href: "#landing-pages" },
  { kind: "header", title: "Categories" },
  { kind: "link", name: "E-commerce", href: "#ecommerce" },
  { kind: "link", name: "SaaS Dashboards", href: "#saas-dashboards" },
  { kind: "link", name: "Analytics", href: "#analytics" },
  { kind: "link", name: "Authentication", href: "#authentication" },
  { kind: "header", title: "Resources" },
  { kind: "link", name: "Documentation", href: "#docs" },
  { kind: "link", name: "Component Showcase", href: "#showcase" },
  { kind: "link", name: "GitHub Repository", href: "#github" },
  { kind: "link", name: "Design System", href: "#design-system" },
];