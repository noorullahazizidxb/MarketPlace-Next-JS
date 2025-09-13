import { api } from "./axiosClient";
import presets from "../theme/presets.json";

type ThemeTokens = any;

export function applyThemeTokens(tokens: ThemeTokens) {
  // tokens expected to have `light` and `dark` top-level keys with token.css strings
  const root = document.documentElement;

  const toVarName = (k: string) => k.replace(/([A-Z])/g, "-$1").toLowerCase();

  const readVal = (v: any): string | undefined => {
    if (typeof v === "string") return v; // already an HSL like "240 10% 4%"
    if (v && typeof v === "object" && "css" in v) return (v as any).css.replace(/^hsl\(|\)$/g, "").trim() || (v as any).css;
    return undefined;
  };

  const applyPrefixed = (prefix: string, obj: Record<string, any>) => {
    for (const [k, v] of Object.entries(obj)) {
      const val = readVal(v);
      if (val) {
        root.style.setProperty(`--${prefix}-${toVarName(k)}`, val);
      } else if (v && typeof v === "object") {
        // nested tokens - flatten by joining keys
        for (const [k2, v2] of Object.entries(v as Record<string, any>)) {
          const v2val = readVal(v2);
          if (v2val) root.style.setProperty(`--${prefix}-${toVarName(k)}-${toVarName(k2)}`, v2val);
        }
      }
    }
  };

  // 1) Always write prefixed variables for reference/debugging
  if (tokens.light) applyPrefixed("light", tokens.light);
  if (tokens.dark) applyPrefixed("dark", tokens.dark);

  // 2) Clear any previously set unprefixed vars so CSS mapping controls them on toggle
  const collected = new Set<string>();
  const collectKeys = (obj: Record<string, any>) => {
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && !readVal(v)) {
        for (const [k2] of Object.entries(v as Record<string, any>)) {
          collected.add(toVarName(k2));
        }
      } else {
        collected.add(toVarName(k));
      }
    }
  };
  if (tokens.light) collectKeys(tokens.light as Record<string, any>);
  if (tokens.dark) collectKeys(tokens.dark as Record<string, any>);
  collected.forEach((name) => {
    root.style.removeProperty(`--${name}`);
  });
}

export async function fetchRemoteThemes() {
  try {
  const res = await api.get<any[]>("/themes");
  return res;
  } catch (e) {
    throw e;
  }
}

export async function loadLocalPresets() {
  // return bundled presets.json so dev server doesn't need to serve static JSON
  return presets;
}
