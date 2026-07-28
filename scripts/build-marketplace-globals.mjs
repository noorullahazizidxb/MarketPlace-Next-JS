/**
 * Build marketplace globals.css from MFE reference + marketplace motion/fonts.
 * Run: node scripts/build-marketplace-globals.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mfeGlobals = path.resolve(
  root,
  "../../micro-front-end/packages/styles/globals.css",
);

if (!fs.existsSync(mfeGlobals)) {
  console.error("MFE globals not found:", mfeGlobals);
  process.exit(1);
}

let css = fs.readFileSync(mfeGlobals, "utf8");

// Drop MFE-specific @source / font-inter wiring; marketplace uses @fontsource + local faces.
css = css.replace(
  /@source[\s\S]*?@custom-variant dark[\s\S]*?;/,
  `@source "../**/*.{ts,tsx}";
@config "../../tailwind.config.ts";

@custom-variant dark (&:is(.dark *, [data-theme="dark"] *, [data-theme=dark] *));`,
);

// Remove MFE local font faces (Yekan/Inter Fallback) — marketplace has its own.
css = css.replace(
  /\/\* ─+[\s\S]*?LOCAL FONTS[\s\S]*?─+ \*\/[\s\S]*?(?=\/\* ─+[\s\S]*?THEME)/,
  `/* LOCAL FONTS — marketplace */
@font-face {
  font-family: 'PoppinsLocal';
  src: url('../english_font/Poppins-Regular.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'Coolvetica';
  src: url('../english_font/Coolvetica Rg.otf') format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'Yekan';
  src: url('../persian_font/Yekan.woff2') format('woff2'), url('../persian_font/Yekan.woff') format('woff');
  font-display: swap;
}
@font-face {
  font-family: 'HSDream';
  src: url('../persian_font/HSDreamRegular.woff2') format('woff2'), url('../persian_font/HSDreamRegular.woff') format('woff');
  font-display: swap;
}

`,
);

// Fix @theme font-sans that references --font-inter
css = css.replace(
  /--font-sans:\s*var\(--font-inter\),\s*"Inter Fallback",\s*system-ui,\s*-apple-system,\s*sans-serif;/,
  `--font-sans: var(--app-font-family, Inter, PoppinsLocal, ui-sans-serif, system-ui, sans-serif);`,
);
css = css.replace(
  /--app-font-family:\s*var\(--font-inter\),\s*"Inter Fallback",\s*system-ui,\s*-apple-system,\s*sans-serif;/,
  `--app-font-family: Inter, PoppinsLocal, ui-sans-serif, system-ui, sans-serif;`,
);

// Expand @theme color aliases with success/warning/info + OTA extras
const themeExtras = `
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-price: var(--price);
  --color-chip: var(--chip);
  --color-chip-foreground: var(--chip-foreground);
  --radius-squircle: var(--squircle-radius);
`;

css = css.replace(
  /(--color-sidebar-ring:\s*var\(--sidebar-ring\);)/,
  `$1\n${themeExtras}`,
);

// Inject OTA/brand defaults into :root after brand section if missing success
if (!css.includes("--success:")) {
  css = css.replace(
    /(--brand-glow:[^;]+;)/,
    `$1

  /* Semantic + marketplace OTA extras (from theme-data defaults) */
  --success: oklch(0.55 0.16 155);
  --success-foreground: oklch(0.98 0 0);
  --warning: oklch(0.75 0.15 70);
  --warning-foreground: oklch(0.25 0.05 70);
  --info: oklch(0.55 0.15 240);
  --info-foreground: oklch(0.98 0 0);
  --price: oklch(0.45 0.14 155);
  --price-sale: oklch(0.55 0.2 25);
  --price-original: oklch(0.55 0 0);
  --price-highlight-bg: oklch(0.92 0.05 155);
  --chip: oklch(0.965 0 0);
  --chip-foreground: oklch(0.3 0 0);
  --chip-selected: oklch(0.65 0.2 42);
  --chip-selected-foreground: oklch(0.98 0 0);
  --skeleton: oklch(0.94 0 0);
  --skeleton-shimmer: oklch(0.98 0 0);
  --scrollbar-track: oklch(0.96 0 0);
  --scrollbar-thumb: oklch(0.85 0 0);
  --scrollbar-thumb-hover: oklch(0.75 0 0);
  --font-family-english: Inter, PoppinsLocal, Roboto, Open Sans, Lato, ui-sans-serif, system-ui;
  --font-family-persian: Vazirmatn, Yekan, HSDream, Tahoma, sans-serif;
  --font-family-heading: Poppins, PoppinsLocal, Inter, ui-sans-serif, system-ui;
  --font-family-heading-persian: HSDream, Vazirmatn, Yekan, sans-serif;
  --app-heading-mask-image: url('/mask.png');
  --text-small: 0.75rem;
  --shell-header-h: 3.5rem;
`,
  );
}

// Dark mode OTA extras
if (!css.includes(".dark") || !css.match(/\.dark\s*\{[\s\S]*--success:/)) {
  css = css.replace(
    /(\.dark\s*\{[\s\S]*--brand-glow:[^;]+;)/,
    `$1

  --success: oklch(0.65 0.18 155);
  --success-foreground: oklch(0.15 0.05 155);
  --warning: oklch(0.75 0.15 85);
  --warning-foreground: oklch(0.2 0.05 85);
  --info: oklch(0.65 0.15 240);
  --info-foreground: oklch(0.15 0.05 240);
  --price: oklch(0.75 0.16 145);
  --price-sale: oklch(0.7 0.18 45);
  --price-original: oklch(0.55 0.02 250);
  --price-highlight-bg: oklch(0.28 0.03 260);
  --chip: oklch(0.28 0.02 260);
  --chip-foreground: oklch(0.9 0 0);
  --chip-selected: oklch(0.7 0.18 45);
  --chip-selected-foreground: oklch(0.15 0 0);
  --skeleton: oklch(0.25 0.02 260);
  --skeleton-shimmer: oklch(0.32 0.02 260);
  --scrollbar-track: oklch(0.18 0.02 260);
  --scrollbar-thumb: oklch(0.32 0.02 260);
  --scrollbar-thumb-hover: oklch(0.42 0.02 260);
`,
  );
}

// Rename admin-* utilities to app-*
css = css.replace(/@utility admin-/g, "@utility app-");
css = css.replace(/\.admin-/g, ".app-");

// Prefix imports for marketplace
const header = `@import "tailwindcss";
@import "tw-animate-css";
@import "../lib/theme/circular-transition.css";
@import "../styles/responsive-tokens.css";

`;

// Strip existing top imports from MFE file
css = css.replace(/^@import[^\n]*\n+/gm, "");

const marketplaceExtras = `
/* ── Marketplace locale fonts ── */
html[lang="en"] body {
  font-family: var(--app-font-family, var(--font-family-english, Inter, PoppinsLocal, ui-sans-serif, system-ui));
  font-size: var(--text-body);
}
html[lang="en"] h1,
html[lang="en"] h2,
html[lang="en"] h3,
html[lang="en"] h4,
html[lang="en"] h5,
html[lang="en"] h6 {
  font-family: var(--font-family-heading, Poppins, PoppinsLocal, Inter, sans-serif);
}
html[lang="fa"] { direction: rtl; }
html[lang="fa"] body {
  font-family: var(--font-family-persian, Vazirmatn, Yekan, HSDream, sans-serif);
  font-size: var(--text-body);
}
html[lang="fa"] h1,
html[lang="fa"] h2,
html[lang="fa"] h3,
html[lang="fa"] h4,
html[lang="fa"] h5,
html[lang="fa"] h6 {
  font-family: var(--font-family-heading-persian, HSDream, Vazirmatn, Yekan, sans-serif);
}

/* Textured heading mask */
:where(h1, h2, h3, h4, h5, h6) {
  -webkit-mask-image: var(--app-heading-mask-image);
  mask-image: var(--app-heading-mask-image);
  -webkit-mask-size: cover;
  mask-size: cover;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
:where(strong, b) {
  -webkit-mask-image: var(--app-heading-mask-image);
  mask-image: var(--app-heading-mask-image);
  -webkit-mask-size: cover;
  mask-size: cover;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.rounded-squircle,
.squircle {
  corner-shape: squircle;
  border-radius: var(--squircle-radius);
}

/* Marketplace motion — theme-var driven */
.bg-grid-overlay {
  background-image:
    linear-gradient(90deg, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px),
    linear-gradient(color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px);
  background-size: 80px 80px;
}
.bg-aurora-one {
  background: radial-gradient(closest-side, color-mix(in oklch, var(--primary) 55%, transparent), transparent 70%);
}
.bg-aurora-two {
  background: radial-gradient(closest-side, color-mix(in oklch, var(--secondary) 55%, transparent), transparent 70%);
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee { animation: marquee 28s linear infinite; }
.animate-marquee:hover { animation-play-state: paused; }
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spin-slow 60s linear infinite; }
@keyframes drift-a {
  0% { transform: translate(0, 0); }
  33% { transform: translate(20px, -10px); }
  66% { transform: translate(-10px, 15px); }
  100% { transform: translate(0, 0); }
}
@keyframes drift-b {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-16px, 12px); }
  66% { transform: translate(12px, -8px); }
  100% { transform: translate(0, 0); }
}
.animate-drift-a { animation: drift-a 20s ease-in-out infinite; }
.animate-drift-b { animation: drift-b 22s ease-in-out infinite; }

.glass {
  background-color: color-mix(in oklch, var(--background) 60%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in oklch, var(--border) 60%, transparent);
  box-shadow: var(--shadow-md, 0 10px 30px -12px color-mix(in oklch, var(--foreground) 20%, transparent));
}
.dark .glass {
  background-color: color-mix(in oklch, var(--card) 40%, transparent);
  border-color: color-mix(in oklch, var(--border) 70%, transparent);
}

.liquid-glass {
  position: relative;
  border-radius: var(--radius-lg, 1rem);
  background: color-mix(in oklch, var(--background) 18%, transparent);
  backdrop-filter: saturate(160%) blur(16px);
}
.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(from 180deg at 50% 50%, color-mix(in oklch, var(--primary) 85%, transparent), color-mix(in oklch, var(--secondary) 85%, transparent), color-mix(in oklch, var(--primary) 85%, transparent));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: .9;
}

.app-navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(8px);
  background-color: color-mix(in oklch, var(--navbar-bg, var(--background)) 92%, transparent);
  border-bottom: 1px solid var(--navbar-border, var(--border));
  color: var(--navbar-fg, var(--foreground));
  height: var(--navbar-height, var(--shell-header-h, 4rem));
  box-shadow: var(--navbar-shadow, none);
}

.card {
  border-radius: var(--radius-card, var(--radius-lg, 1rem));
  padding: var(--space-card);
  background-color: var(--card-bg, var(--card));
  color: var(--card-fg, var(--card-foreground, var(--foreground)));
  border: 1px solid var(--card-border, var(--border));
  box-shadow: var(--card-shadow, none);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover { transform: translateY(-2px); }

.theme-range {
  appearance: none;
  width: 100%;
  height: 0.5rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, color-mix(in oklch, var(--primary) 85%, transparent), color-mix(in oklch, var(--accent) 85%, transparent));
  outline: none;
}
.theme-range::-webkit-slider-thumb {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  border: 2px solid var(--card);
  background: var(--accent);
  cursor: pointer;
}

.bg-conic-primary-secondary {
  background: conic-gradient(from 180deg at 50% 50%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 30%, color-mix(in oklch, var(--secondary) 12%, transparent), transparent 70%, color-mix(in oklch, var(--primary) 12%, transparent));
}
.bg-radial-accent {
  background: radial-gradient(closest-side, color-mix(in oklch, var(--accent) 18%, transparent), transparent 70%);
}
.bg-radial-secondary {
  background: radial-gradient(closest-side, color-mix(in oklch, var(--secondary) 18%, transparent), transparent 70%);
}

.gradient-bg {
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top, color-mix(in oklch, var(--primary) 28%, transparent), transparent 58%),
    radial-gradient(circle at bottom, color-mix(in oklch, var(--accent) 22%, transparent), transparent 64%);
}

.go-to-slide,
button[aria-label^="Go to slide"],
.accent-btn {
  background-color: var(--accent);
  color: var(--accent-foreground);
  border-color: color-mix(in oklch, var(--accent) 85%, transparent);
}

.partners-marquee-track {
  width: max-content;
  animation: partners-marquee 24s linear infinite;
}
@keyframes partners-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .partners-marquee-track,
  .animate-marquee,
  .animate-spin-slow,
  .animate-drift-a,
  .animate-drift-b,
  .animate-logo-scroll {
    animation: none !important;
  }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.safe-pb { padding-bottom: calc(var(--safe-bottom, 0px) + 0.25rem); }
.safe-pt { padding-top: calc(var(--safe-top, 0px) + 0.25rem); }
.container-padded { @apply container px-4 md:px-6 lg:px-8; }

@media (max-width: 640px) {
  input, select, textarea {
    font-size: 16px !important;
    line-height: 1.35;
  }
}
`;

const out = `${header}${css}\n${marketplaceExtras}\n`;
fs.writeFileSync(path.join(root, "src/app/globals.css"), out);
console.log("Wrote src/app/globals.css", Buffer.byteLength(out), "bytes");

// Verify no hsl(var( bridges remain in @theme
const themeMatch = out.match(/@theme inline \{[\s\S]*?\n\}/);
if (themeMatch && /hsl\(var\(/.test(themeMatch[0])) {
  console.warn("WARNING: hsl(var()) still present in @theme");
} else {
  console.log("@theme uses var(--*) — OK");
}
