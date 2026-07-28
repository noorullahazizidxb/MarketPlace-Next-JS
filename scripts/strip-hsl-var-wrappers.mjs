/**
 * Mechanical cleanup: hsl(var(--*)) → var(--*) / color-mix for alpha.
 * Colors are full oklch via @theme; hsl() wrappers break them.
 *
 * Run: node scripts/strip-hsl-var-wrappers.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src");
const EXT = new Set([".tsx", ".ts", ".css", ".jsx", ".js"]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else if (EXT.has(path.extname(ent.name))) out.push(abs);
  }
  return out;
}

function stripHslVarWrappers(text) {
  let result = "";
  let i = 0;
  while (i < text.length) {
    const idx = text.indexOf("hsl(var(", i);
    if (idx === -1) {
      result += text.slice(i);
      break;
    }
    result += text.slice(i, idx);
    const varStart = idx + 4; // "var("
    let depth = 0;
    let j = varStart;
    for (; j < text.length; j++) {
      const ch = text[j];
      if (ch === "(") depth++;
      else if (ch === ")") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    if (depth !== 0) {
      result += text.slice(idx, idx + 4);
      i = idx + 4;
      continue;
    }
    const varExpr = text.slice(varStart, j);
    let alpha = null;
    if (text[j] === "/") {
      const alphaStart = j + 1;
      let k = alphaStart;
      while (k < text.length && /[0-9.%]/.test(text[k])) k++;
      alpha = text.slice(alphaStart, k);
      j = k;
    }
    if (text[j] !== ")") {
      result += text.slice(idx, idx + 4);
      i = idx + 4;
      continue;
    }
    j++;
    if (alpha) {
      const raw = parseFloat(alpha);
      const pct = alpha.endsWith("%")
        ? raw
        : raw <= 1
          ? raw * 100
          : raw;
      const rounded = Math.round(pct * 1000) / 1000;
      result += `color-mix(in oklab, ${varExpr} ${rounded}%, transparent)`;
    } else {
      result += varExpr;
    }
    i = j;
  }
  return result;
}

const files = walk(root);
let changed = 0;
let totalReplacements = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  if (!before.includes("hsl(var(")) continue;
  const after = stripHslVarWrappers(before);
  if (after === before) continue;
  const beforeCount = (before.match(/hsl\(var\(/g) || []).length;
  const afterCount = (after.match(/hsl\(var\(/g) || []).length;
  totalReplacements += beforeCount - afterCount;
  fs.writeFileSync(file, after);
  changed++;
  console.log("updated", path.relative(process.cwd(), file), `(${beforeCount - afterCount})`);
}

console.log(`\nDone. files=${changed} replacements≈${totalReplacements}`);
const leftover = walk(root).filter((f) =>
  fs.readFileSync(f, "utf8").includes("hsl(var("),
);
if (leftover.length) {
  console.log("leftover files:", leftover.length);
  for (const f of leftover.slice(0, 20)) {
    console.log(" ", path.relative(process.cwd(), f));
  }
}
