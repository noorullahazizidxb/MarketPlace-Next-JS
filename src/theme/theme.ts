import presets from "./presets.json";
import { config } from "@/lib/config";

type ThemeTokens = any;

export function applyThemeTokens(tokens: ThemeTokens) {
  // tokens expected to have `light` and `dark` top-level keys with token.css strings
  const root = document.documentElement;
  const setImportant = (name: string, value: string) =>
    root.style.setProperty(name, value, "important");

  const toVarName = (k: string) => k.replace(/([A-Z])/g, "-$1").toLowerCase();

  const readVal = (v: any): string | undefined => {
    if (typeof v === "string") return v; // already an HSL like "240 10% 4%"
    if (v && typeof v === "object" && "css" in v) return (v as any).css.replace(/^hsl\(|\)$/g, "").trim() || (v as any).css;
    return undefined;
  };

  const applyPrefixed = (prefix: string, obj: Record<string, any>) => {
    for (const [k, v] of Object.entries(obj)) {
      const val = readVal(v);
      const varBase = `--${prefix}-${toVarName(k)}`;
      if (val) {
        // write base HSL parts (raw content)
        setImportant(varBase, val);
      }
      if (v && typeof v === "object") {
        // if token is an object, additionally expose hex/rgb if present
        if (v.hex && typeof v.hex === "string") {
          setImportant(`${varBase}-hex`, String(v.hex));
        }
        if (v.rgb && typeof v.rgb === "string") {
          setImportant(`${varBase}-rgb`, String(v.rgb));
        }
        // nested tokens - flatten by joining keys
        for (const [k2, v2] of Object.entries(v as Record<string, any>)) {
          const v2val = readVal(v2);
          if (v2val)
            setImportant(
              `--${prefix}-${toVarName(k)}-${toVarName(k2)}`,
              v2val,
            );
          if (v2 && typeof v2 === "object") {
            if ((v2 as any).hex)
              setImportant(
                `--${prefix}-${toVarName(k)}-${toVarName(k2)}-hex`,
                String((v2 as any).hex),
              );
            if ((v2 as any).rgb)
              setImportant(
                `--${prefix}-${toVarName(k)}-${toVarName(k2)}-rgb`,
                String((v2 as any).rgb),
              );
          }
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

  // If tokens include a preferredColorMode marker at top-level, write it for CSS/runtime
  try {
    const pref = (tokens as any)?.preferredColorMode || (tokens as any)?.preferred_color_mode || null;
    if (pref) setImportant("--preferred-color-mode", String(pref));
  } catch (_) { }
}

const asTokenObject = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj || {}).map(([k, v]) => [
      k,
      typeof v === "string" ? { css: `hsl(${v})` } : v,
    ])
  );

export async function loadFileThemes() {
  const res = await fetch(config.themeFileRoute, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load theme file: ${res.status}`);
  return (await res.json()) as any[];
}

export async function loadBundledThemeFallback() {
  return [
    {
      id: "bundled-fallback",
      name: "Bundled Fallback",
      tokens: {
        tokens: {
          light: asTokenObject((presets as any).light || {}),
          dark: asTokenObject((presets as any).dark || {}),
        },
        preferredColorMode: "HSL",
      },
    },
  ];
}

export function applyThemeScales(scales: any) {
  if (!scales) return;
  const root = document.documentElement;
  const toVarName = (k: string) => k.replace(/([A-Z])/g, "-$1").toLowerCase();
  const setImportant = (name: string, value: string) =>
    root.style.setProperty(name, value, "important");

  const setGroup = (prefix: string, obj?: Record<string, any>) => {
    if (!obj) return;
    for (const [k, v] of Object.entries(obj)) {
      setImportant(`--${prefix}-${toVarName(k)}`, String(v));
    }
  };

  // font scales
  if (scales.font) {
    setGroup("font-size", scales.font.sizes);
    if (scales.font.family)
      setImportant("--font-family", String(scales.font.family));
    if (scales.font.families?.english) {
      setImportant(
        "--font-family-english",
        String(scales.font.families.english)
      );
    }
    if (scales.font.families?.persian) {
      setImportant(
        "--font-family-persian",
        String(scales.font.families.persian)
      );
    }
    if (scales.font.families?.heading) {
      setImportant(
        "--font-family-heading",
        String(scales.font.families.heading)
      );
    }
    if (scales.font.families?.headingPersian) {
      setImportant(
        "--font-family-heading-persian",
        String(scales.font.families.headingPersian)
      );
    }
    if (scales.font.elements?.body) {
      setImportant("--font-size-body", String(scales.font.elements.body));
    }
    if (scales.font.elements?.heading) {
      setImportant(
        "--font-size-heading",
        String(scales.font.elements.heading)
      );
    }
    if (scales.font.elements?.ui) {
      setImportant("--font-size-ui", String(scales.font.elements.ui));
    }
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
          setImportant("--spring-damping", String(spr.damping));
        if (spr.stiffness != null)
          setImportant("--spring-stiffness", String(spr.stiffness));
        if (spr.type)
          setImportant("--spring-type", String(spr.type));
      } else {
        setImportant(`--transition-${toVarName(k)}`, String(v));
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
  const setImportant = (name: string, value: string) =>
    root.style.setProperty(name, value, "important");
  const setVar = (name: string, value: any) => {
    if (typeof value === "string" && value.startsWith("var(")) {
      setImportant(name, value);
      return;
    }
    const css = readCss(value);
    if (!css) return;
    setImportant(name, css);
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
    if (c.radius) setImportant("--radius-card", radiusRef(c.radius));
    if (c.shadow) setImportant("--card-shadow", shadowRef(c.shadow));
    if (c.border?.width)
      setImportant("--card-border-width", borderWidthRef(c.border.width));
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
      if (b.primary.hoverColor?.token)
        setVar("--btn-primary-hover-fg", tokenRef(b.primary.hoverColor.token));
      if (b.primary.activeBackground?.token)
        setVar("--btn-primary-active-bg", tokenRef(b.primary.activeBackground.token));
      if (b.primary.radius)
        setImportant("--radius-button", radiusRef(b.primary.radius));
      if (b.primary.shadow)
        setImportant("--btn-primary-shadow", shadowRef(b.primary.shadow));
      if (b.primary.hoverShadow)
        setImportant("--btn-primary-hover-shadow", shadowRef(b.primary.hoverShadow));
      if (b.primary.activeShadow)
        setImportant("--btn-primary-active-shadow", shadowRef(b.primary.activeShadow));
      if (b.primary.transition)
        setImportant("--btn-primary-transition", transitionRef(b.primary.transition));
    }
    if (b.accent) {
      if (b.accent.background?.token)
        setVar("--btn-accent-bg", tokenRef(b.accent.background.token));
      if (b.accent.color?.token)
        setVar("--btn-accent-fg", tokenRef(b.accent.color.token));
      if (b.accent.hoverBackground?.token)
        setVar("--btn-accent-hover-bg", tokenRef(b.accent.hoverBackground.token));
      if (b.accent.hoverColor?.token)
        setVar("--btn-accent-hover-fg", tokenRef(b.accent.hoverColor.token));
      if (b.accent.activeBackground?.token)
        setVar("--btn-accent-active-bg", tokenRef(b.accent.activeBackground.token));
      if (b.accent.shadow)
        setImportant("--btn-accent-shadow", shadowRef(b.accent.shadow));
      if (b.accent.hoverShadow)
        setImportant("--btn-accent-hover-shadow", shadowRef(b.accent.hoverShadow));
      if (b.accent.activeShadow)
        setImportant("--btn-accent-active-shadow", shadowRef(b.accent.activeShadow));
      if (b.accent.transition)
        setImportant("--btn-accent-transition", transitionRef(b.accent.transition));
    }
    if (b.secondary) {
      if (b.secondary.background?.token)
        setVar("--btn-secondary-bg", tokenRef(b.secondary.background.token));
      if (b.secondary.color?.token)
        setVar("--btn-secondary-fg", tokenRef(b.secondary.color.token));
      if (b.secondary.hoverBackground?.token)
        setVar("--btn-secondary-hover-bg", tokenRef(b.secondary.hoverBackground.token));
      if (b.secondary.hoverColor?.token)
        setVar("--btn-secondary-hover-fg", tokenRef(b.secondary.hoverColor.token));
      if (b.secondary.activeBackground?.token)
        setVar("--btn-secondary-active-bg", tokenRef(b.secondary.activeBackground.token));
      if (b.secondary.shadow)
        setImportant("--btn-secondary-shadow", shadowRef(b.secondary.shadow));
      if (b.secondary.hoverShadow)
        setImportant("--btn-secondary-hover-shadow", shadowRef(b.secondary.hoverShadow));
      if (b.secondary.activeShadow)
        setImportant("--btn-secondary-active-shadow", shadowRef(b.secondary.activeShadow));
      if (b.secondary.transition)
        setImportant("--btn-secondary-transition", transitionRef(b.secondary.transition));
    }
  }
  if (components.navbar) {
    const n = components.navbar;
    if (n.background?.token) setVar("--navbar-bg", tokenRef(n.background.token));
    if (n.border?.token) setVar("--navbar-border", tokenRef(n.border.token));
    if (n.border?.width)
      setImportant("--navbar-border-width", borderWidthRef(n.border.width));
    if (n.color?.token) setVar("--navbar-fg", tokenRef(n.color.token));
    if (n.height) setImportant("--navbar-height", String(n.height));
    if (n.shadow) setImportant("--navbar-shadow", shadowRef(n.shadow));
  }
  if (components.link) {
    const l = components.link;
    // Use resolved vars to avoid collisions with token-mapped unprefixed vars
    if (l.color?.token) setVar("--link-color-resolved", tokenRef(l.color.token));
    if (l.hoverColor?.token) setVar("--link-hover-color-resolved", tokenRef(l.hoverColor.token));
    if (l.underline?.token) setVar("--link-underline-resolved", tokenRef(l.underline.token));
    if (l.activeColor?.token) setVar("--link-active-color-resolved", tokenRef(l.activeColor.token));
    if (l.background?.token) setVar("--link-bg-resolved", tokenRef(l.background.token));
    if (l.hoverBackground?.token) setVar("--link-hover-bg-resolved", tokenRef(l.hoverBackground.token));
    if (l.transition)
      setImportant("--link-transition", transitionRef(l.transition));
  }
}
