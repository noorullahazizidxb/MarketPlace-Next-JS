#!/usr/bin/env node
/**
 * Invert Atomic Design stubs: move flat ui/*.tsx implementations into
 * organisms/ or molecules/, rewrite imports across src/, delete flat files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ui = path.join(root, "src", "components", "ui");
const srcRoot = path.join(root, "src");

/** flat basename → { layer: 'organisms'|'molecules', atomicName?: string } */
const MOVES = [
  { flat: "image-slider.tsx", layer: "organisms" },
  { flat: "listing-card.tsx", layer: "organisms" },
  { flat: "listing-card-variants.tsx", layer: "organisms" },
  { flat: "listing-card-selector.tsx", layer: "organisms" },
  { flat: "BottomNavigation.tsx", layer: "organisms" },
  { flat: "MobileQuickBar.tsx", layer: "organisms" },
  { flat: "StoryCreateModal.tsx", layer: "organisms" },
  { flat: "bottom-sheet.tsx", layer: "organisms" },
  { flat: "confirm-dialog.tsx", layer: "organisms" },
  { flat: "contact-form.tsx", layer: "organisms" },
  { flat: "filters-bar.tsx", layer: "organisms" },
  { flat: "home-promo-banner.tsx", layer: "organisms" },
  { flat: "listings-promo-banner.tsx", layer: "organisms" },
  { flat: "logo-carousel.tsx", layer: "organisms" },
  { flat: "partners.tsx", layer: "organisms" },
  { flat: "about-cta-banner.tsx", layer: "organisms" },
  { flat: "app-error-state.tsx", layer: "organisms" },
  { flat: "notifications-panel.tsx", layer: "organisms" },
  { flat: "approval-card.tsx", layer: "molecules" },
  { flat: "search-box.tsx", layer: "molecules" },
  { flat: "language-dropdown.tsx", layer: "molecules" },
  { flat: "tooltip.tsx", layer: "molecules" },
  { flat: "toaster.tsx", layer: "molecules" },
];

/** Flat shims that already re-export from atomic — just delete after import flip */
const FLAT_SHIMS = [
  { flat: "theme-toggle.tsx", to: "molecules/theme-toggle" },
  { flat: "animate-in.tsx", to: "atoms/animate-in" },
  { flat: "animated-bg.tsx", to: "atoms/animated-bg" },
  { flat: "animated-number.tsx", to: "atoms/animated-number" },
  { flat: "page-transition.tsx", to: "atoms/page-transition" },
  { flat: "portal.tsx", to: "atoms/portal" },
  { flat: "skip-link.tsx", to: "atoms/skip-link" },
  { flat: "spinner.tsx", to: "atoms/spinner" },
  { flat: "object-url-image.tsx", to: "atoms/object-url-image" },
  { flat: "component-loading.tsx", to: "molecules/component-loading" },
  { flat: "TextInputField.tsx", to: "atoms/shadcn/TextInputField" },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, files);
    } else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function rewriteImportsInText(text) {
  let out = text;

  // Flat → atomic for moved files
  for (const m of MOVES) {
    const base = m.flat.replace(/\.tsx$/, "");
    const dest = `@/components/ui/${m.layer}/${base}`;
    const patterns = [
      // @/components/ui/X
      new RegExp(`(@/components/ui/)${escapeReg(base)}(?=["'])`, "g"),
      // relative from ui/ subfolders: ../X or ../../ui/X — handled after moves for consumers
    ];
    for (const re of patterns) {
      out = out.replace(re, dest);
    }
  }

  // Flat shims → atomic
  for (const s of FLAT_SHIMS) {
    const base = s.flat.replace(/\.tsx$/, "");
    const dest = `@/components/ui/${s.to}`;
    out = out.replace(
      new RegExp(`(@/components/ui/)${escapeReg(base)}(?=["'])`, "g"),
      dest,
    );
  }

  return out;
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rewriteRelativeInMovedFile(content, layer) {
  // Inside organisms/foo.tsx, imports like `@/components/ui/image-slider` already rewritten by rewriteImportsInText
  // Relative `./image-slider` from same flat folder → organisms path
  let out = content;
  for (const m of MOVES) {
    const base = m.flat.replace(/\.tsx$/, "");
    const dest = `@/components/ui/${m.layer}/${base}`;
    out = out.replace(
      new RegExp(`from ["']\\.\\./${escapeReg(base)}["']`, "g"),
      `from "${dest}"`,
    );
    out = out.replace(
      new RegExp(`from ["']\\./${escapeReg(base)}["']`, "g"),
      `from "${dest}"`,
    );
  }
  for (const s of FLAT_SHIMS) {
    const base = s.flat.replace(/\.tsx$/, "");
    const dest = `@/components/ui/${s.to}`;
    out = out.replace(
      new RegExp(`from ["']\\.\\./${escapeReg(base)}["']`, "g"),
      `from "${dest}"`,
    );
    out = out.replace(
      new RegExp(`from ["']\\./${escapeReg(base)}["']`, "g"),
      `from "${dest}"`,
    );
  }
  // Relative imports to other flat siblings that stay (button, dialog, card, etc.)
  // `./button` from organisms → `@/components/ui/button`
  out = out.replace(
    /from ["']\.\/(button|dialog|card|input|switch|label|badge|command)["']/g,
    `from "@/components/ui/$1"`,
  );
  out = out.replace(
    /from ["']\.\.\/(button|dialog|card|input|switch|label|badge|command)["']/g,
    `from "@/components/ui/$1"`,
  );
  // lib helpers that lived as ./lib/x from flat ui
  if (layer === "organisms" || layer === "molecules") {
    out = out.replace(
      /from ["']\.\/lib\//g,
      `from "@/components/ui/lib/`,
    );
  }
  return out;
}

// 1) Move implementations
for (const m of MOVES) {
  const flatPath = path.join(ui, m.flat);
  const atomicPath = path.join(ui, m.layer, m.flat);
  if (!fs.existsSync(flatPath)) {
    console.warn("Missing flat:", m.flat);
    continue;
  }
  let content = fs.readFileSync(flatPath, "utf8");
  // Skip if flat is already a tiny re-export to atomic (shouldn't happen)
  if (
    content.length < 400 &&
    content.includes(`from "./${m.layer}/`)
  ) {
    console.log("Skip (already shim):", m.flat);
    continue;
  }
  content = rewriteRelativeInMovedFile(content, m.layer);
  content = rewriteImportsInText(content);
  fs.writeFileSync(atomicPath, content, "utf8");
  console.log("Moved", m.flat, "→", `${m.layer}/${m.flat}`);
}

// 2) Rewrite all src imports
const allFiles = walk(srcRoot);
let rewritten = 0;
for (const file of allFiles) {
  const before = fs.readFileSync(file, "utf8");
  let after = rewriteImportsInText(before);
  // Also fix relative imports from components that pointed at flat ui siblings
  // e.g. from "../../ui/image-slider" or from "@/components/ui/image-slider" already done
  for (const m of MOVES) {
    const base = m.flat.replace(/\.tsx$/, "");
    const dest = `@/components/ui/${m.layer}/${base}`;
    after = after.replace(
      new RegExp(
        `from ["'](\\.\\./)+ui/${escapeReg(base)}["']`,
        "g",
      ),
      `from "${dest}"`,
    );
    after = after.replace(
      new RegExp(
        `from ["'](\\.\\./)*components/ui/${escapeReg(base)}["']`,
        "g",
      ),
      `from "${dest}"`,
    );
  }
  for (const s of FLAT_SHIMS) {
    const base = s.flat.replace(/\.tsx$/, "");
    const dest = `@/components/ui/${s.to}`;
    after = after.replace(
      new RegExp(
        `from ["'](\\.\\./)+ui/${escapeReg(base)}["']`,
        "g",
      ),
      `from "${dest}"`,
    );
  }
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    rewritten += 1;
  }
}
console.log("Rewrote imports in", rewritten, "files");

// 3) Delete flat implementations and shims
for (const m of MOVES) {
  const flatPath = path.join(ui, m.flat);
  if (fs.existsSync(flatPath)) {
    fs.unlinkSync(flatPath);
    console.log("Deleted flat", m.flat);
  }
}
for (const s of FLAT_SHIMS) {
  const flatPath = path.join(ui, s.flat);
  if (fs.existsSync(flatPath)) {
    fs.unlinkSync(flatPath);
    console.log("Deleted shim", s.flat);
  }
}

console.log("Done.");
