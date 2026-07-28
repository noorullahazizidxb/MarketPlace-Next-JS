/**
 * Rename admin-* token utility classes → app-* across src.
 * Run: node scripts/rename-admin-to-app-utils.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src");
const exts = new Set([".ts", ".tsx", ".css", ".jsx", ".js"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(root);
let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  // Only rename utility class prefixes, not words like "admin-shell.tsx" paths
  let after = before
    .replace(/\badmin-text-/g, "app-text-")
    .replace(/\badmin-icon-/g, "app-icon-")
    .replace(/\badmin-shell-/g, "app-shell-")
    .replace(/\badmin-weight-/g, "app-weight-")
    .replace(/\badmin-leading-/g, "app-leading-")
    .replace(/\badmin-tracking-/g, "app-tracking-")
    .replace(/\badmin-density-/g, "app-density-")
    .replace(/\badmin-hero-/g, "app-hero-")
    .replace(/\badmin-typo-/g, "app-typo-")
    .replace(/\badmin-ui-/g, "app-ui-")
    .replace(/\badmin-input-/g, "app-input-")
    .replace(/\badmin-break-/g, "app-break-");
  // Fix accidental double prefixes from prior partial renames
  after = after.replace(/\bapp-ui-app-text-/g, "app-text-");
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}
console.log(`Updated ${changed} files`);
