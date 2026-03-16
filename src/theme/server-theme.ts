import { readFile } from "fs/promises";
import path from "node:path";

type JsonRecord = Record<string, unknown>;

type ThemeDefinition = {
  scales?: JsonRecord;
  tokens?: JsonRecord;
  components?: JsonRecord;
};

const ACTIVE_THEME_PATH = path.join(process.cwd(), "theme-data", "active-theme.json");
const DEFAULT_THEME_PATH = path.join(process.cwd(), "theme-data", "default-theme.json");

function toVarName(value: string) {
  return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function readCssValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.replace(/^hsl\(|\)$/g, "").trim() || value;
  }

  if (value && typeof value === "object" && "css" in value) {
    const css = (value as { css?: string }).css;
    if (typeof css === "string") {
      return css.replace(/^hsl\(|\)$/g, "").trim() || css;
    }
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function pushTokenVars(lines: string[], prefix: string, record?: JsonRecord) {
  if (!record) return;

  for (const [key, rawValue] of Object.entries(record)) {
    const cssValue = readCssValue(rawValue);
    const varName = `--${prefix}-${toVarName(key)}`;

    if (cssValue) {
      lines.push(`${varName}:${cssValue} !important;`);
    }

    if (rawValue && typeof rawValue === "object") {
      const nested = rawValue as JsonRecord;

      if (typeof nested.hex === "string") {
        lines.push(`${varName}-hex:${nested.hex} !important;`);
      }

      if (typeof nested.rgb === "string") {
        lines.push(`${varName}-rgb:${nested.rgb} !important;`);
      }

      for (const [nestedKey, nestedValue] of Object.entries(nested)) {
        const nestedCssValue = readCssValue(nestedValue);
        if (!nestedCssValue) continue;

        const nestedVarName = `${varName}-${toVarName(nestedKey)}`;
        lines.push(`${nestedVarName}:${nestedCssValue} !important;`);
      }
    }
  }
}

function pushScaleVars(lines: string[], scales?: JsonRecord) {
  if (!scales) return;

  const setGroup = (prefix: string, group?: JsonRecord) => {
    if (!group) return;
    for (const [key, value] of Object.entries(group)) {
      lines.push(`--${prefix}-${toVarName(key)}:${String(value)} !important;`);
    }
  };

  const font = scales.font as JsonRecord | undefined;
  if (font) {
    setGroup("font-size", font.sizes as JsonRecord | undefined);
    setGroup("font-weight", font.weights as JsonRecord | undefined);
    setGroup("line-height", font.lineHeights as JsonRecord | undefined);

    const elements = font.elements as JsonRecord | undefined;
    if (elements) {
      if (elements.body) lines.push(`--font-size-body:${String(elements.body)} !important;`);
      if (elements.heading) lines.push(`--font-size-heading:${String(elements.heading)} !important;`);
      if (elements.ui) lines.push(`--font-size-ui:${String(elements.ui)} !important;`);
    }

    const families = font.families as JsonRecord | undefined;
    if (typeof font.family === "string") lines.push(`--font-family:${font.family} !important;`);
    if (families) {
      if (typeof families.english === "string") lines.push(`--font-family-english:${families.english} !important;`);
      if (typeof families.persian === "string") lines.push(`--font-family-persian:${families.persian} !important;`);
      if (typeof families.heading === "string") lines.push(`--font-family-heading:${families.heading} !important;`);
    }
  }

  setGroup("radius", scales.radii as JsonRecord | undefined);
  setGroup("shadow", scales.shadow as JsonRecord | undefined);
  setGroup("z-index", scales.zIndex as JsonRecord | undefined);
  setGroup("space", scales.spacing as JsonRecord | undefined);
  setGroup("border-width", scales.borderWidth as JsonRecord | undefined);

  const transitions = scales.transitions as JsonRecord | undefined;
  if (transitions) {
    for (const [key, value] of Object.entries(transitions)) {
      if (key === "spring" && value && typeof value === "object") {
        const spring = value as JsonRecord;
        if (spring.damping !== undefined) lines.push(`--spring-damping:${String(spring.damping)} !important;`);
        if (spring.stiffness !== undefined) lines.push(`--spring-stiffness:${String(spring.stiffness)} !important;`);
        if (spring.type !== undefined) lines.push(`--spring-type:${String(spring.type)} !important;`);
        continue;
      }
      lines.push(`--transition-${toVarName(key)}:${String(value)} !important;`);
    }
  }
}

function pushComponentVars(lines: string[], components?: JsonRecord) {
  if (!components) return;

  const tokenRef = (name: string) => `var(--${toVarName(name)})`;
  const radiusRef = (name: string) => `var(--radius-${toVarName(name)})`;
  const shadowRef = (name: string) => `var(--shadow-${toVarName(name)})`;
  const borderWidthRef = (name: string) => `var(--border-width-${toVarName(name)})`;
  const transitionRef = (name: string) => `var(--transition-${toVarName(name)})`;
  const setVar = (name: string, value?: string) => {
    if (value) lines.push(`${name}:${value} !important;`);
  };

  const card = components.card as JsonRecord | undefined;
  if (card) {
    const background = card.background as JsonRecord | undefined;
    const border = card.border as JsonRecord | undefined;
    const color = card.color as JsonRecord | undefined;
    if (typeof background?.token === "string") setVar("--card-bg", tokenRef(background.token));
    if (typeof border?.token === "string") setVar("--card-border", tokenRef(border.token));
    if (typeof color?.token === "string") setVar("--card-fg", tokenRef(color.token));
    if (typeof card.radius === "string") setVar("--radius-card", radiusRef(card.radius));
    if (typeof card.shadow === "string") setVar("--card-shadow", shadowRef(card.shadow));
    if (typeof border?.width === "string") setVar("--card-border-width", borderWidthRef(border.width));
  }

  const button = components.button as JsonRecord | undefined;
  const pushButtonGroup = (prefix: string, group?: JsonRecord) => {
    if (!group) return;
    const background = group.background as JsonRecord | undefined;
    const color = group.color as JsonRecord | undefined;
    const hoverBackground = group.hoverBackground as JsonRecord | undefined;
    const hoverColor = group.hoverColor as JsonRecord | undefined;
    const activeBackground = group.activeBackground as JsonRecord | undefined;

    if (typeof background?.token === "string") setVar(`--btn-${prefix}-bg`, tokenRef(background.token));
    if (typeof color?.token === "string") setVar(`--btn-${prefix}-fg`, tokenRef(color.token));
    if (typeof hoverBackground?.token === "string") setVar(`--btn-${prefix}-hover-bg`, tokenRef(hoverBackground.token));
    if (typeof hoverColor?.token === "string") setVar(`--btn-${prefix}-hover-fg`, tokenRef(hoverColor.token));
    if (typeof activeBackground?.token === "string") setVar(`--btn-${prefix}-active-bg`, tokenRef(activeBackground.token));
    if (typeof group.radius === "string") setVar("--radius-button", radiusRef(group.radius));
    if (typeof group.shadow === "string") setVar(`--btn-${prefix}-shadow`, shadowRef(group.shadow));
    if (typeof group.hoverShadow === "string") setVar(`--btn-${prefix}-hover-shadow`, shadowRef(group.hoverShadow));
    if (typeof group.activeShadow === "string") setVar(`--btn-${prefix}-active-shadow`, shadowRef(group.activeShadow));
    if (typeof group.transition === "string") setVar(`--btn-${prefix}-transition`, transitionRef(group.transition));
  };

  if (button) {
    pushButtonGroup("primary", button.primary as JsonRecord | undefined);
    pushButtonGroup("accent", button.accent as JsonRecord | undefined);
    pushButtonGroup("secondary", button.secondary as JsonRecord | undefined);
  }

  const navbar = components.navbar as JsonRecord | undefined;
  if (navbar) {
    const background = navbar.background as JsonRecord | undefined;
    const border = navbar.border as JsonRecord | undefined;
    const color = navbar.color as JsonRecord | undefined;
    if (typeof background?.token === "string") setVar("--navbar-bg", tokenRef(background.token));
    if (typeof border?.token === "string") setVar("--navbar-border", tokenRef(border.token));
    if (typeof border?.width === "string") setVar("--navbar-border-width", borderWidthRef(border.width));
    if (typeof color?.token === "string") setVar("--navbar-fg", tokenRef(color.token));
    if (typeof navbar.height === "string") setVar("--navbar-height", navbar.height);
    if (typeof navbar.shadow === "string") setVar("--navbar-shadow", shadowRef(navbar.shadow));
  }

  const link = components.link as JsonRecord | undefined;
  if (link) {
    const color = link.color as JsonRecord | undefined;
    const hoverColor = link.hoverColor as JsonRecord | undefined;
    const underline = link.underline as JsonRecord | undefined;
    const activeColor = link.activeColor as JsonRecord | undefined;
    const background = link.background as JsonRecord | undefined;
    const hoverBackground = link.hoverBackground as JsonRecord | undefined;

    if (typeof color?.token === "string") setVar("--link-color-resolved", tokenRef(color.token));
    if (typeof hoverColor?.token === "string") setVar("--link-hover-color-resolved", tokenRef(hoverColor.token));
    if (typeof underline?.token === "string") setVar("--link-underline-resolved", tokenRef(underline.token));
    if (typeof activeColor?.token === "string") setVar("--link-active-color-resolved", tokenRef(activeColor.token));
    if (typeof background?.token === "string") setVar("--link-bg-resolved", tokenRef(background.token));
    if (typeof hoverBackground?.token === "string") setVar("--link-hover-bg-resolved", tokenRef(hoverBackground.token));
    if (typeof link.transition === "string") setVar("--link-transition", transitionRef(link.transition));
  }
}

function serializeThemeCss(theme: ThemeDefinition) {
  const lines: string[] = [];
  pushTokenVars(lines, "light", theme.tokens?.light as JsonRecord | undefined);
  pushTokenVars(lines, "dark", theme.tokens?.dark as JsonRecord | undefined);
  pushScaleVars(lines, theme.scales);
  pushComponentVars(lines, theme.components);
  return `:root{${lines.join("")}}`;
}

export async function getInitialThemeCss() {
  const theme = await readInitialTheme();
  return serializeThemeCss(theme);
}

async function readThemeFile(filePath: string) {
  const content = await readFile(filePath, "utf8");
  const parsed = JSON.parse(content) as ThemeDefinition[];
  return parsed[0];
}

async function readInitialTheme() {
  try {
    return await readThemeFile(ACTIVE_THEME_PATH);
  } catch {
    return await readThemeFile(DEFAULT_THEME_PATH);
  }
}

export function getThemeModeInitScript() {
  return `(function(){try{var root=document.documentElement;var saved=localStorage.getItem("theme-mode");var mode=saved||"system";var dark=mode==="dark"||(mode==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);root.classList.toggle("dark",dark);root.setAttribute("data-theme",dark?"dark":"light");root.style.colorScheme=dark?"dark":"light";var preferred=localStorage.getItem("preferred-color-mode");if(preferred){root.style.setProperty("--preferred-color-mode",preferred);}}catch(_){}})();`;
}
