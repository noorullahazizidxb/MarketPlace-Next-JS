/**
 * Server-side theme bootstrap for FOUC-free first paint.
 * Reads `.data/ui-context.json` directly (no self-HTTP) and emits CSS via generateThemeCss.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultUiContextState } from "@/lib/theme/ui-context-defaults";
import type { ThemeSettings, UiContextState } from "@/lib/theme/types";
import { generateThemeCss } from "@/lib/theme/server-theme-css";

const DATA_DIR = path.join(process.cwd(), ".data");
const UI_CONTEXT_FILE = path.join(DATA_DIR, "ui-context.json");

const cloneDefault = (): UiContextState =>
  JSON.parse(JSON.stringify(defaultUiContextState)) as UiContextState;

const mergeUiContextState = (
  base: UiContextState,
  incoming?: Partial<UiContextState> | null,
): UiContextState => ({
  version: incoming?.version ?? base.version,
  theme: { ...base.theme, ...incoming?.theme },
  sidebar: { ...base.sidebar, ...incoming?.sidebar },
  updatedAt: incoming?.updatedAt ?? base.updatedAt ?? new Date().toISOString(),
});

const normalize = (incoming?: Partial<UiContextState> | null): UiContextState =>
  mergeUiContextState(cloneDefault(), incoming);

async function ensureUiContextFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(UI_CONTEXT_FILE, "utf-8");
  } catch {
    const initial = normalize({ updatedAt: new Date().toISOString() });
    await writeFile(
      UI_CONTEXT_FILE,
      `${JSON.stringify(initial, null, 2)}\n`,
      "utf-8",
    );
  }
}

/** Direct secured file read — preferred over self-HTTP in root layout. */
export async function getUiContextState(): Promise<UiContextState> {
  try {
    await ensureUiContextFile();
    const raw = await readFile(UI_CONTEXT_FILE, "utf-8");
    return normalize(JSON.parse(raw) as Partial<UiContextState>);
  } catch {
    return normalize({ updatedAt: new Date().toISOString() });
  }
}

export async function getInitialThemeCss(locale?: string | null): Promise<string> {
  const uiContext = await getUiContextState();
  return generateThemeCss(uiContext.theme, locale);
}

export async function getInitialThemeSettings(): Promise<ThemeSettings> {
  const uiContext = await getUiContextState();
  return uiContext.theme;
}

/**
 * Tiny pre-hydration mode script. Colors come from SSR `app-inline-css`;
 * this only toggles `.dark` / `data-theme` so the correct block applies.
 */
export function getThemeModeInitScript(modeHint?: string | null) {
  const safeMode = modeHint === "light" || modeHint === "dark" || modeHint === "system"
    ? modeHint
    : "system";

  return `(function(){try{var root=document.documentElement;var mode=${JSON.stringify(safeMode)};try{var saved=localStorage.getItem("theme-mode");if(saved==="light"||saved==="dark"||saved==="system")mode=saved;}catch(_){}var dark=mode==="dark"||(mode==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);root.classList.toggle("dark",dark);root.classList.toggle("light",!dark);root.setAttribute("data-theme",dark?"dark":"light");root.style.colorScheme=dark?"dark":"light";}catch(_){}})();`;
}
