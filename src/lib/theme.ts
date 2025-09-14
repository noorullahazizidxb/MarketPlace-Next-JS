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

export function applyThemeScales(scales: any) {
  if (!scales) return;
  const root = document.documentElement;
  const toVarName = (k: string) => k.replace(/([A-Z])/g, "-$1").toLowerCase();

  const setGroup = (prefix: string, obj?: Record<string, any>) => {
    if (!obj) return;
    for (const [k, v] of Object.entries(obj)) {
      root.style.setProperty(`--${prefix}-${toVarName(k)}`, String(v));
    }
  };

  // font scales
  if (scales.font) {
    setGroup("font-size", scales.font.sizes);
    if (scales.font.family)
      root.style.setProperty("--font-family", String(scales.font.family));
    setGroup("font-weight", scales.font.weights);
    setGroup("line-height", scales.font.lineHeights);
  }
  // radii, shadow, zIndex, spacing, borderWidth, transitions
  setGroup("radius", scales.radii);
  setGroup("shadow", scales.shadow);
  setGroup("z-index", scales.zIndex);
  setGroup("space", scales.spacing);
  setGroup("border-width", scales.borderWidth);
  if (scales.transitions) {
    for (const [k, v] of Object.entries(scales.transitions)) {
      if (k === "spring" && typeof v === "object") {
        const spr = v as any;
        if (spr.damping != null)
          root.style.setProperty("--spring-damping", String(spr.damping));
        if (spr.stiffness != null)
          root.style.setProperty("--spring-stiffness", String(spr.stiffness));
        if (spr.type)
          root.style.setProperty("--spring-type", String(spr.type));
      } else {
        root.style.setProperty(`--transition-${toVarName(k)}`, String(v));
      }
    }
  }
}

function readCss(v: any): string | undefined {
  if (typeof v === "string") return v.replace(/^hsl\(|\)$/g, "").trim() || v;
  if (v && typeof v === "object" && "css" in v) {
    const raw = (v as any).css;
    return String(raw).replace(/^hsl\(|\)$/g, "").trim() || raw;
  }
  return undefined;
}

export function applyThemeComponents(components: any) {
  if (!components) return;
  const root = document.documentElement;
  const setVar = (name: string, value: any) => {
    if (typeof value === "string" && value.startsWith("var(")) {
      root.style.setProperty(name, value);
      return;
    }
    const css = readCss(value);
    if (!css) return;
    root.style.setProperty(name, css);
  };
  const toVarName = (k: string) => k.replace(/([A-Z])/g, "-$1").toLowerCase();
  const tokenRef = (name: string) => `var(--${toVarName(name)})`;
  const radiusRef = (name: string) => `var(--radius-${toVarName(name)})`;
  const shadowRef = (name: string) => `var(--shadow-${toVarName(name)})`;
  const borderWidthRef = (name: string) => `var(--border-width-${toVarName(name)})`;
  const transitionRef = (name: string) => `var(--transition-${toVarName(name)})`;

  // Friendly well-known bindings
  if (components.card) {
    const c = components.card;
    if (c.background?.token) setVar("--card-bg", tokenRef(c.background.token));
    if (c.border?.token) setVar("--card-border", tokenRef(c.border.token));
    if (c.color?.token) setVar("--card-fg", tokenRef(c.color.token));
    if (c.radius) root.style.setProperty("--radius-card", radiusRef(c.radius));
    if (c.shadow) root.style.setProperty("--card-shadow", shadowRef(c.shadow));
    if (c.border?.width)
      root.style.setProperty("--card-border-width", borderWidthRef(c.border.width));
  }
  if (components.button) {
    const b = components.button;
    if (b.primary) {
      if (b.primary.background?.token)
        setVar("--btn-primary-bg", tokenRef(b.primary.background.token));
      if (b.primary.color?.token)
        setVar("--btn-primary-fg", tokenRef(b.primary.color.token));
      if (b.primary.hoverBackground?.token)
        setVar("--btn-primary-hover-bg", tokenRef(b.primary.hoverBackground.token));
      if (b.primary.radius)
        root.style.setProperty("--radius-button", radiusRef(b.primary.radius));
      if (b.primary.shadow)
        root.style.setProperty("--btn-primary-shadow", shadowRef(b.primary.shadow));
      if (b.primary.transition)
        root.style.setProperty("--btn-primary-transition", transitionRef(b.primary.transition));
    }
    if (b.accent) {
      if (b.accent.background?.token)
        setVar("--btn-accent-bg", tokenRef(b.accent.background.token));
      if (b.accent.color?.token)
        setVar("--btn-accent-fg", tokenRef(b.accent.color.token));
      if (b.accent.hoverBackground?.token)
        setVar("--btn-accent-hover-bg", tokenRef(b.accent.hoverBackground.token));
      if (b.accent.shadow)
        root.style.setProperty("--btn-accent-shadow", shadowRef(b.accent.shadow));
    }
    if (b.secondary) {
      if (b.secondary.background?.token)
        setVar("--btn-secondary-bg", tokenRef(b.secondary.background.token));
      if (b.secondary.color?.token)
        setVar("--btn-secondary-fg", tokenRef(b.secondary.color.token));
    }
  }
  if (components.navbar) {
    const n = components.navbar;
    if (n.background?.token) setVar("--navbar-bg", tokenRef(n.background.token));
    if (n.border?.token) setVar("--navbar-border", tokenRef(n.border.token));
    if (n.border?.width)
      root.style.setProperty("--navbar-border-width", borderWidthRef(n.border.width));
    if (n.color?.token) setVar("--navbar-fg", tokenRef(n.color.token));
    if (n.height) root.style.setProperty("--navbar-height", String(n.height));
    if (n.shadow) root.style.setProperty("--navbar-shadow", shadowRef(n.shadow));
  }
}
