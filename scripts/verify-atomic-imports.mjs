import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next"].includes(entry.name)) continue;
      walk(p, acc);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) acc.push(p);
  }
  return acc;
}

const staleNames = [
  "image-slider",
  "listing-card",
  "listing-card-variants",
  "listing-card-selector",
  "BottomNavigation",
  "MobileQuickBar",
  "StoryCreateModal",
  "bottom-sheet",
  "confirm-dialog",
  "contact-form",
  "filters-bar",
  "approval-card",
  "search-box",
  "language-dropdown",
  "tooltip",
  "toaster",
];

const re = new RegExp(
  `from ['"]@/components/ui/(${staleNames.join("|")})['"]`,
  "g",
);

const hits = [];
for (const file of walk("src")) {
  const text = fs.readFileSync(file, "utf8");
  let m;
  while ((m = re.exec(text))) hits.push(`${file}: ${m[0]}`);
}

console.log(hits.length ? hits.join("\n") : "NO_STALE_FLAT_IMPORTS");
console.log(
  "bottom-nav module:",
  fs.existsSync(
    "src/components/ui/organisms/bottom-navigation/BottomNavigation.tsx",
  ),
);
console.log(
  "aspect map present:",
  fs
    .readFileSync("src/components/ui/organisms/image-slider.tsx", "utf8")
    .includes("ASPECT_CLASS_MAP"),
);
