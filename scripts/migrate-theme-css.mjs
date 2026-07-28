/**
 * One-shot helper: extract preset keys + build CSS from MFE reference patterns.
 * Run: node scripts/migrate-theme-css.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mfeStyles = path.resolve(root, "../../micro-front-end/packages/styles/globals.css");
const mfeResponsive = path.resolve(
  root,
  "../../micro-front-end/apps/admin/styles/responsive-tokens.css",
);

const presetFiles = [
  "src/lib/theme/presets/shadcn-ui-theme-presets-v2.ts",
  "src/lib/theme/presets/shadcn-ui-theme-presets-with-sidebar.ts",
  "src/lib/theme/presets/brand-theme-presets.ts",
  "src/lib/theme/presets/theme-data.ts",
  "src/lib/theme/presets/tweakcn-theme-presets.ts",
];

function extractKeys() {
  const keys = new Set();
  const skip = new Set([
    "styles",
    "light",
    "dark",
    "label",
    "createdAt",
    "import",
    "export",
    "const",
    "type",
    "from",
    "return",
    "if",
    "else",
    "function",
    "true",
    "false",
    "null",
    "undefined",
  ]);

  for (const rel of presetFiles) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) continue;
    const txt = fs.readFileSync(abs, "utf8");
    for (const m of txt.matchAll(/["']([a-z][a-z0-9-]*)["']\s*:/g)) {
      keys.add(m[1]);
    }
  }

  return [...keys].filter((k) => !skip.has(k)).sort();
}

const CANONICAL_COLOR_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
];

const BRAND_OTA_KEYS = [
  "brand-gradient-start",
  "brand-gradient-end",
  "brand-gradient",
  "brand-glow",
  "hover-gradient-start",
  "hover-gradient-end",
  "hover-gradient",
  "price",
  "price-sale",
  "price-original",
  "price-highlight-bg",
  "switch-track-off",
  "switch-track-off-border",
  "switch-track-on",
  "switch-track-on-border",
  "switch-thumb",
  "switch-thumb-on",
  "switch-ring",
  "scrollbar-track",
  "scrollbar-thumb",
  "scrollbar-thumb-hover",
  "skeleton",
  "skeleton-shimmer",
  "badge-cheap",
  "badge-cheap-text",
  "badge-best",
  "badge-best-text",
  "badge-fast",
  "badge-fast-text",
  "airline-logo-bg",
  "layover-line",
  "selected-flight",
  "selected-flight-border",
  "chip",
  "chip-foreground",
  "chip-selected",
  "chip-selected-foreground",
];

const DENSITY_KEYS = [
  "text-micro",
  "text-caption",
  "text-label",
  "text-body",
  "text-action",
  "text-badge",
  "text-mono",
  "text-heading-sm",
  "text-heading",
  "text-h1",
  "text-h2",
  "text-h3",
  "text-h4",
  "text-h5",
  "text-h6",
  "text-stat",
  "text-small",
  "leading-body",
  "leading-heading",
  "leading-heading-sm",
  "leading-caption",
  "leading-label",
  "leading-action",
  "leading-badge",
  "leading-stat",
  "leading-mono",
  "leading-micro",
  "leading-h1",
  "leading-h2",
  "leading-h3",
  "leading-h4",
  "leading-h5",
  "leading-h6",
  "tracking-body",
  "tracking-heading",
  "tracking-heading-sm",
  "tracking-caps",
  "tracking-mono",
  "tracking-badge",
  "tracking-label",
  "weight-body",
  "weight-label",
  "weight-heading",
  "weight-h1",
  "weight-h2",
  "weight-h3",
  "weight-h4",
  "weight-h5",
  "weight-h6",
  "weight-action",
  "weight-badge",
  "weight-table-head",
  "icon-xs",
  "icon-sm",
  "icon-md",
  "icon-lg",
  "ctrl-h",
  "ctrl-h-sm",
  "ctrl-px",
  "ctrl-py",
  "space-page-x",
  "space-page-y",
  "space-section",
  "space-card",
  "space-filter",
  "space-gap",
  "table-head-text",
  "table-cell-text",
  "table-head-h",
  "table-cell-py",
  "table-cell-px",
  "table-cell-leading",
  "table-head-tracking",
  "table-cell-tracking",
  "sb-text-label",
  "sb-text-item",
  "sb-text-sub",
  "sb-text-badge",
  "pill-h",
  "pill-px",
  "badge-h",
  "badge-px",
  "badge-py",
  "nav-item-px",
  "nav-item-py",
  "nav-icon-size",
  "card-gap",
  "hero-accent-h",
  "hero-orb-lg",
  "hero-orb-sm",
  "hero-icon-pad",
  "shell-header-h",
  "loading-spinner-scale",
  "radius",
  "squircle-radius",
  "app-content-width",
  "app-sidebar-width",
  "app-font-family",
  "app-font-size",
  "heading-text-decoration",
];

const extracted = extractKeys();
const checklist = {
  generatedAt: new Date().toISOString(),
  colors: CANONICAL_COLOR_KEYS,
  brandAndOta: BRAND_OTA_KEYS,
  density: DENSITY_KEYS,
  extractedFromPresets: extracted,
};

fs.mkdirSync(path.join(root, "src/lib/theme"), { recursive: true });
fs.writeFileSync(
  path.join(root, "src/lib/theme/canonical-token-checklist.json"),
  `${JSON.stringify(checklist, null, 2)}\n`,
);

console.log("Wrote canonical-token-checklist.json");
console.log("extracted keys:", extracted.length);

// ── responsive-tokens.css ──────────────────────────────────────────────────
if (fs.existsSync(mfeResponsive)) {
  let responsive = fs.readFileSync(mfeResponsive, "utf8");
  responsive = responsive
    .replace(/ADMIN RESPONSIVE TOKENS/g, "APP RESPONSIVE TOKENS")
    .replace(/apps\/admin\/styles\/responsive-tokens\.css/g, "src/styles/responsive-tokens.css")
    .replace(/Admin-specific/g, "App-specific")
    .replace(/admin MFE only/g, "marketplace app only")
    .replace(/admin-text-/g, "app-text-")
    .replace(/packages\/styles\/globals\.css/g, "src/app/globals.css")
    .replace(/@repo\/styles\/globals\.css/g, "src/app/globals.css");
  fs.mkdirSync(path.join(root, "src/styles"), { recursive: true });
  fs.writeFileSync(path.join(root, "src/styles/responsive-tokens.css"), responsive);
  console.log("Wrote responsive-tokens.css");
} else {
  console.warn("MFE responsive-tokens not found at", mfeResponsive);
}

console.log("Done. globals.css is authored separately.");
