"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useThemeStore } from "@/store/theme.store";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalGet, useLocalMutation } from "@/lib/api-hooks";
import { applyThemeScales, applyThemeTokens } from "../../../theme/theme";
import { Button } from "@/components/ui/button";
import { applyThemeComponents } from "../../../theme/theme";
import { ThemeToggle } from "../../../theme/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { config } from "@/lib/config";

type ThemeTokensShape = {
  light: Record<string, any>;
  dark: Record<string, any>;
};

type ScalesShape = Record<string, any>;
type ComponentsShape = Record<string, any>;
type ColorMode = "HSL" | "RGB" | "HEX";

const toCssString = (v: any): string => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "css" in v) return String(v.css);
  return "";
};

const wrapCss = (v: string) => ({ css: v });

const ENGLISH_FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Nunito",
  "Work Sans",
  "Coolvetica",
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
];

const PERSIAN_FONT_OPTIONS = [
  "Vazirmatn",
  "Noto Sans Arabic",
  "Noto Naskh Arabic",
  "Cairo",
  "Yekan",
  "HSDream",
  "Tahoma",
  "Arial",
];

const toRemNumber = (value: any, fallback: number) => {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw.replace(/rem|px/gi, ""));
  if (!Number.isFinite(parsed)) return fallback;
  if (/px$/i.test(raw)) {
    return Number((parsed / 16).toFixed(3));
  }
  return parsed;
};

const toRemString = (value: any, fallback: number) => {
  const next = toRemNumber(value, fallback);
  const compact = next.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  return `${compact}rem`;
};

const isPlainObject = (value: any) =>
  !!value && typeof value === "object" && !Array.isArray(value);

const deepMerge = (base: any, override: any): any => {
  if (!isPlainObject(base)) return override;
  if (!isPlainObject(override)) return base;
  const merged: Record<string, any> = { ...base };
  Object.keys(override).forEach((key) => {
    const left = merged[key];
    const right = override[key];
    if (isPlainObject(left) && isPlainObject(right)) {
      merged[key] = deepMerge(left, right);
      return;
    }
    merged[key] = right;
  });
  return merged;
};

const normalizeScalesPayload = (incoming: ScalesShape | null) => {
  if (!incoming || typeof incoming !== "object") return incoming;
  const next: any = JSON.parse(JSON.stringify(incoming));
  if (!next.font || typeof next.font !== "object") return next;

  const font = next.font;
  if (!font.families || typeof font.families !== "object") {
    font.families = {};
  }
  if (font.family && !font.families.english) {
    font.families.english = font.family;
  }
  if (!font.families.english) font.families.english = "Inter";
  if (!font.families.persian) font.families.persian = "Vazirmatn";
  if (!font.families.heading) font.families.heading = "Poppins";
  if (!font.families.headingPersian) font.families.headingPersian = "HSDream";
  delete font.family;

  if (!font.sizes || typeof font.sizes !== "object") font.sizes = {};
  if (!font.elements || typeof font.elements !== "object") font.elements = {};

  font.sizes.base = toRemString(font.sizes.base ?? font.elements.body, 1);
  font.elements.body = toRemString(font.elements.body ?? font.sizes.base, 1);
  font.elements.heading = toRemString(
    font.elements.heading ?? font.sizes.xl,
    1.25,
  );

  return next as ScalesShape;
};

// Color conversion helpers used for payload serialization
const hslCssToHex = (hslCss: string): string => {
  try {
    const s = hslCss.trim().replace(/^hsl\(|\)$/g, "");
    const [hRaw, sRaw, lRaw] = s.split(/\s+/);
    const h = parseFloat(hRaw);
    const sv = parseFloat(sRaw);
    const lv = parseFloat(lRaw);
    const sPct = isNaN(sv) ? 0 : sv / 100;
    const lPct = isNaN(lv) ? 0 : lv / 100;
    const c = (1 - Math.abs(2 * lPct - 1)) * sPct;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lPct - c / 2;
    let r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
    else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
    else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
    else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
    else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];
    const toHex = (n: number) => {
      const v = Math.round((n + m) * 255);
      return (v < 16 ? "0" : "") + v.toString(16);
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch {
    return "";
  }
};

const hslCssToRgb = (hslCss: string): string => {
  try {
    const s = hslCss.trim().replace(/^hsl\(|\)$/g, "");
    const [hRaw, sRaw, lRaw] = s.split(/\s+/);
    const h = parseFloat(hRaw);
    const sv = parseFloat(sRaw) / 100;
    const lv = parseFloat(lRaw) / 100;
    const c = (1 - Math.abs(2 * lv - 1)) * sv;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lv - c / 2;
    let r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
    else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
    else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
    else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
    else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];
    const to255 = (n: number) => Math.round((n + m) * 255);
    return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`;
  } catch {
    return "";
  }
};

const hexToHslCss = (hex: string): string => {
  try {
    const v = hex.replace("#", "");
    const r = parseInt(v.substring(0, 2), 16) / 255;
    const g = parseInt(v.substring(2, 4), 16) / 255;
    const b = parseInt(v.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r:
          h = ((g - b) / d) % 6;
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
      if (h < 0) h += 360;
    }
    return `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(
      l * 100,
    )}%)`;
  } catch {
    return hex;
  }
};

export default function ThemeSettingsPage() {
  const setTokensStore = useThemeStore((s) => s.setTokens);
  const setScalesStore = useThemeStore((s) => s.setScales);
  const setComponentsStore = useThemeStore((s) => s.setComponents);
  const [tokens, setTokens] = useState<ThemeTokensShape | null>(null);
  const [scales, setScales] = useState<ScalesShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    try {
      const ls = localStorage.getItem("preferred-color-mode");
      if (ls === "HEX" || ls === "RGB" || ls === "HSL") return ls as ColorMode;
    } catch { }
    return "HSL";
  });
  const [themeMeta, setThemeMeta] = useState<any | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const qc = useQueryClient();
  const [components, setComponents] = useState<ComponentsShape | null>(null);
  const [activeTab, setActiveTab] = useState<
    "colors" | "scales" | "components"
  >("colors");
  const [tokenQuery, setTokenQuery] = useState("");
  const radiiKeys = useMemo(
    () => Object.keys((scales as any)?.radii || {}),
    [scales],
  );
  const shadowKeys = useMemo(
    () => Object.keys((scales as any)?.shadow || {}),
    [scales],
  );
  const borderWidthKeys = useMemo(
    () => Object.keys((scales as any)?.borderWidth || {}),
    [scales],
  );
  const transitionKeys = useMemo(
    () =>
      Object.keys((scales as any)?.transitions || {}).filter(
        (k) => k !== "spring",
      ),
    [scales],
  );
  const scalesEditorData = useMemo(() => {
    if (!scales || typeof scales !== "object") return null;
    const next: any = JSON.parse(JSON.stringify(scales));
    if (next.font && typeof next.font === "object") {
      delete next.font.sizes;
      delete next.font.elements;
      delete next.font.families;
      delete next.font.family;
      if (Object.keys(next.font).length === 0) {
        delete next.font;
      }
    }
    return next as ScalesShape;
  }, [scales]);

  // Derive current Quick Option values from components for controlled inputs
  const quickValues = useMemo(() => {
    const b = (components as any)?.button || {};
    const link = (components as any)?.link || {};
    return {
      linkColorToken: link?.color?.token || "",
      linkUnderlineToken: link?.underline?.token || "",
      btnHoverToken: b?.primary?.hoverBackground?.token || "",
      btnActiveToken: b?.primary?.activeBackground?.token || "",
      btnHoverShadow: b?.primary?.hoverShadow || "",
      btnActiveShadow: b?.primary?.activeShadow || "",
      btnHoverTextToken: b?.primary?.hoverColor?.token || "",
      linkHoverToken: link?.hoverColor?.token || "",
      linkActiveToken: link?.activeColor?.token || "",
      linkBgToken: link?.background?.token || "",
      linkHoverBgToken: link?.hoverBackground?.token || "",
      btnRadius: b?.primary?.radius || "",
    };
  }, [components]);

  // Fetch via centralized SWR hook
  const {
    data: themesData,
    isLoading: isThemesLoading,
    error: themesError,
    mutate: refetchThemes,
  } = useLocalGet<any[]>(["themes-file"], config.themeFileRoute);

  // Drive local UI state from SWR
  useEffect(() => {
    setLoading(!!isThemesLoading);
  }, [isThemesLoading]);
  useEffect(() => {
    if (themesError)
      setError((themesError as any)?.message || "Failed to load theme");
  }, [themesError]);
  useEffect(() => {
    if (!themesData) return;
    const first = Array.isArray(themesData) ? themesData[0] : themesData;
    const envelope = (first?.tokens as any) || null;
    const rawTokens = envelope ?? null;
    const normalized: ThemeTokensShape | null = rawTokens?.tokens
      ? rawTokens.tokens
      : rawTokens;
    const mergedScales = deepMerge(
      (first?.scales as any) || {},
      envelope?.scales || {},
    );
    const mergedComponents = deepMerge(
      (first?.components as any) || {},
      envelope?.components || {},
    );

    const foundScales: ScalesShape | null =
      Object.keys(mergedScales || {}).length > 0
        ? normalizeScalesPayload(mergedScales)
        : null;
    const foundComponents: ComponentsShape | null =
      Object.keys(mergedComponents || {}).length > 0 ? mergedComponents : null;

    if (first) setThemeMeta(first);
    if (normalized) setTokens(normalized);
    if (foundScales) setScales(foundScales);
    if (foundComponents) setComponents(foundComponents);
    // if payload included preferredColorMode, adopt it
    const pref =
      envelope?.preferredColorMode ??
      (first as any)?.preferredColorMode ??
      null;
    if (pref && (pref === "HEX" || pref === "RGB" || pref === "HSL")) {
      setColorMode(pref as ColorMode);
      try {
        localStorage.setItem("preferred-color-mode", pref);
      } catch { }
    }
  }, [themesData]);

  // apply on load
  useEffect(() => {
    if (tokens) applyThemeTokens(tokens);
    if (scales) applyThemeScales(scales);
    if (components) applyThemeComponents(components);
    // keep store in sync for global access
    setTokensStore(tokens);
    setScalesStore(scales);
    setComponentsStore(components);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, scales, components]);

  const tokenKeys = useMemo(() => {
    if (!tokens) return [] as string[];
    const keys = new Set<string>();
    [tokens.light, tokens.dark].forEach((side) => {
      Object.keys(side || {}).forEach((k) => keys.add(k));
    });
    let list = Array.from(keys);
    ["linkBg", "linkHoverBg"].forEach((extra) => {
      if (!list.includes(extra)) list.push(extra);
    });
    if (tokenQuery.trim()) {
      const q = tokenQuery.trim().toLowerCase();
      list = list.filter((k) => k.toLowerCase().includes(q));
    }
    return list;
  }, [tokens, tokenQuery]);

  const handleColorChange = (
    mode: "light" | "dark",
    key: string,
    value: string,
  ) => {
    setTokens((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        [mode]: { ...prev[mode], [key]: wrapCss(value) },
      } as ThemeTokensShape;
      // apply live
      applyThemeTokens(next);
      return next;
    });
  };

  const handleScaleChange = (path: string, value: string) => {
    setScales((prev) => {
      const base: any = prev ? JSON.parse(JSON.stringify(prev)) : {};
      const parts = path.split(".");
      let curr = base;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (typeof curr[p] !== "object" || curr[p] === null) curr[p] = {};
        curr = curr[p];
      }
      curr[parts[parts.length - 1]] = value;
      applyThemeScales(base);
      return base as ScalesShape;
    });
  };

  const handleFontSizeRangeChange = (
    key: "base" | "body" | "heading",
    next: number,
  ) => {
    const value = `${next}rem`;
    setScales((prev) => {
      const base: any = prev ? JSON.parse(JSON.stringify(prev)) : {};
      if (!base.font || typeof base.font !== "object") base.font = {};
      if (!base.font.sizes || typeof base.font.sizes !== "object") {
        base.font.sizes = {};
      }
      if (!base.font.elements || typeof base.font.elements !== "object") {
        base.font.elements = {};
      }

      if (key === "base") {
        base.font.sizes.base = value;
        base.font.elements.body = value;
      } else if (key === "body") {
        base.font.elements.body = value;
      } else {
        base.font.elements.heading = value;
      }

      applyThemeScales(base);
      return base as ScalesShape;
    });
  };

  const resetFromRemote = async () => {
    setLoading(true);
    setError(null);
    try {
      await refetchThemes();
    } catch (e: any) {
      setError(e?.message || "Failed to reload theme file");
    } finally {
      setLoading(false);
    }
  };

  // Build normalized payload with css + hsl per token
  const parseHsl = (css: string): [number, number, number] | null => {
    try {
      let v = css.trim();
      if (/^hsl\(/i.test(v)) {
        v = v.replace(/^hsl\(|\)$/g, "");
        const parts = v.split(/\s+/);
        if (parts.length < 3) return null;
        const h = parseFloat(parts[0]);
        const s = parseFloat(parts[1]);
        const l = parseFloat(parts[2]);
        if ([h, s, l].some((x) => Number.isNaN(x))) return null;
        return [Math.round(h), Math.round(s), Math.round(l)];
      }
      if (/^rgb\(/i.test(v)) {
        // Convert to HSL CSS first via hex path to reuse one function
        const m = v.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        if (m) {
          const toHex = (n: number) => (n < 16 ? "0" : "") + n.toString(16);
          const hex = `#${toHex(parseInt(m[1], 10))}${toHex(
            parseInt(m[2], 10),
          )}${toHex(parseInt(m[3], 10))}`;
          const hslCss = hexToHslCss(hex);
          return parseHsl(hslCss);
        }
        return null;
      }
      if (/^#/i.test(v)) {
        const hslCss = hexToHslCss(v);
        return parseHsl(hslCss);
      }
      return null;
    } catch {
      return null;
    }
  };

  const normalizeSide = (side: Record<string, any>): Record<string, any> => {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(side || {})) {
      if (v && typeof v === "object" && !("css" in v) && !Array.isArray(v)) {
        out[k] = normalizeSide(v as Record<string, any>);
      } else {
        const cssHsl = toCssString(v);
        const hsl = parseHsl(cssHsl) || null;
        // Always include hsl/css for frontend runtime. Optionally enrich with hex/rgb for backend consumers.
        const base: Record<string, any> = {
          css: cssHsl,
          ...(hsl ? { hsl } : {}),
        };
        if (hsl) {
          if (colorMode === "HEX") base.hex = hslCssToHex(cssHsl);
          else if (colorMode === "RGB") base.rgb = hslCssToRgb(cssHsl);
        }
        out[k] = base;
      }
    }
    return out;
  };

  const buildPayload = () => {
    if (!tokens) return null;
    const normalizedTokens = {
      light: normalizeSide(tokens.light || {}),
      dark: normalizeSide(tokens.dark || {}),
    };
    const payload: any = {
      tokens: normalizedTokens,
      preferredColorMode: colorMode,
    };
    // include only id/name/notes if present; drop other meta fields
    if (themeMeta) {
      if (typeof themeMeta.id !== "undefined") payload.id = themeMeta.id;
      if (typeof themeMeta.name !== "undefined") payload.name = themeMeta.name;
      if (typeof themeMeta.notes !== "undefined")
        payload.notes = themeMeta.notes;
    }
    if (scales) payload.scales = normalizeScalesPayload(scales);
    if (components) payload.components = components;
    return payload;
  };

  const saveMutation = useLocalMutation<any>("put", config.themeFileRoute, {
    onSuccess: (data: any) => {
      setSaveMessage("Saved");
      setTimeout(() => setSaveMessage(null), 1500);
      // If API returns updated theme, adopt it
      if (data) {
        const first = Array.isArray(data) ? data[0] : data;
        if (first) setThemeMeta(first);
      }
      // Re-apply and persist current edits
      if (tokens) applyThemeTokens(tokens);
      if (scales) applyThemeScales(scales);
      if (components) applyThemeComponents(components);
      qc.invalidateQueries();
    },
    onError: (e: any) => {
      setSaveMessage(e?.message || "Save failed");
      setTimeout(() => setSaveMessage(null), 2500);
    },
  });

  const { t } = useLanguage();

  return (
    <div className="container-padded py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-xl">{t("configureThemes")}</h1>
          <p className="subtle">{t("editThemeHint")}</p>
        </div>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <Button variant="ghost" onClick={resetFromRemote}>
            {t("reset")}
          </Button>
          <Button
            onClick={() => {
              const body = buildPayload();
              if (!body) return;
              saveMutation.mutate(body as any);
            }}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1.5 rounded-full border ${activeTab === "colors"
            ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent"
            : "border-[hsl(var(--border))]"
            }`}
          onClick={() => setActiveTab("colors")}
        >
          {t("colors")}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border ${activeTab === "scales"
            ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent"
            : "border-[hsl(var(--border))]"
            }`}
          onClick={() => setActiveTab("scales")}
        >
          {t("scales")}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border ${activeTab === "components"
            ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent"
            : "border-[hsl(var(--border))]"
            }`}
          onClick={() => setActiveTab("components")}
        >
          {t("components")}
        </button>
        <div className="ml-auto flex items-center gap-2">
          {saveMessage && <span className="text-sm subtle">{saveMessage}</span>}
        </div>
      </div>

      {loading && <div className="card">Loading theme…</div>}
      {error && <div className="card text-rose-500">{error}</div>}

      {!loading && tokens && activeTab === "colors" && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{t("colors")}</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm">Mode</label>
              <select
                className="h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                aria-label="Color input mode"
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value as ColorMode)}
              >
                <option value="HSL">HSL</option>
                <option value="RGB">RGB</option>
                <option value="HEX">HEX</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              className="h-9 w-full md:w-72 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
              placeholder={t("search") + " tokens…"}
              value={tokenQuery}
              onChange={(e) => setTokenQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-auto pr-1">
            <div className="hidden md:grid md:grid-cols-[12rem_1fr_1fr] px-2 py-1 text-xs subtle">
              <div>Token</div>
              <div>Light</div>
              <div>Dark</div>
            </div>
            {tokenKeys.map((k) => (
              <div
                key={k}
                className="grid grid-cols-1 md:grid-cols-[12rem_1fr_1fr] gap-2 items-center p-2 rounded-xl border border-[hsl(var(--border))]"
              >
                <div className="text-sm font-medium" title={k}>
                  {k}
                </div>
                <div>
                  <ColorField
                    label={"Light"}
                    value={toCssString((tokens.light as any)[k])}
                    onChange={(v) => handleColorChange("light", k, v)}
                    colorMode={colorMode}
                  />
                </div>
                <div>
                  <ColorField
                    label={"Dark"}
                    value={toCssString((tokens.dark as any)[k])}
                    onChange={(v) => handleColorChange("dark", k, v)}
                    colorMode={colorMode}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && scales && activeTab === "scales" && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Scales</h2>
          {scales?.font && (
            <div className="rounded-2xl border border-[hsl(var(--border))] p-4 mb-4 space-y-4">
              <div className="text-sm font-medium">Typography</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-3">
                  <span className="text-sm w-36">English font</span>
                  <select
                    aria-label="English font family"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={String(scales?.font?.families?.english ?? "Inter")}
                    onChange={(e) =>
                      handleScaleChange("font.families.english", e.target.value)
                    }
                  >
                    {ENGLISH_FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-36">Persian font</span>
                  <select
                    aria-label="Persian font family"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={String(
                      scales?.font?.families?.persian ?? "Vazirmatn",
                    )}
                    onChange={(e) =>
                      handleScaleChange("font.families.persian", e.target.value)
                    }
                  >
                    {PERSIAN_FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-36">English Heading</span>
                  <select
                    aria-label="English Heading font family"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={String(scales?.font?.families?.heading ?? "Poppins")}
                    onChange={(e) =>
                      handleScaleChange("font.families.heading", e.target.value)
                    }
                  >
                    {ENGLISH_FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-36">Persian Heading</span>
                  <select
                    aria-label="Persian Heading font family"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={String(scales?.font?.families?.headingPersian ?? "HSDream")}
                    onChange={(e) =>
                      handleScaleChange("font.families.headingPersian", e.target.value)
                    }
                  >
                    {PERSIAN_FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ThemeRange
                  label="Base size"
                  min={0.625}
                  max={1.5}
                  step={0.01}
                  value={toRemNumber(scales?.font?.sizes?.base, 1)}
                  onChange={(next) => handleFontSizeRangeChange("base", next)}
                />
                <ThemeRange
                  label="Body size"
                  min={0.625}
                  max={1.375}
                  step={0.01}
                  value={toRemNumber(
                    scales?.font?.elements?.body ?? scales?.font?.sizes?.base,
                    1,
                  )}
                  onChange={(next) => handleFontSizeRangeChange("body", next)}
                />
                <ThemeRange
                  label="Heading size"
                  min={0.75}
                  max={2.25}
                  step={0.01}
                  value={toRemNumber(
                    scales?.font?.elements?.heading ?? scales?.font?.sizes?.xl,
                    1.25,
                  )}
                  onChange={(next) =>
                    handleFontSizeRangeChange("heading", next)
                  }
                />
              </div>
            </div>
          )}
          {scalesEditorData && (
            <ScalesEditor
              basePath=""
              data={scalesEditorData}
              onChange={handleScaleChange}
            />
          )}
        </div>
      )}

      <PreviewPanel />

      {/* Components editor */}
      {!loading && components && activeTab === "components" && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Components</h2>
          <div className="space-y-4">
            {/* Quick Options for hover/active and link states */}
            <div className="p-2 rounded-xl border border-[hsl(var(--border))] space-y-2">
              <div className="text-sm font-medium">Quick Options</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Button hover text</span>
                  <select
                    aria-label="Button hover text"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.btnHoverTextToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        const ensureToken = (obj: any) => {
                          obj = ensure(obj);
                          obj.hoverColor = ensure(obj.hoverColor);
                          obj.hoverColor.token = val;
                          return obj;
                        };
                        next.button = ensure(next.button);
                        next.button.primary = ensureToken(next.button.primary);
                        next.button.accent = ensureToken(next.button.accent);
                        next.button.secondary = ensureToken(
                          next.button.secondary,
                        );
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Link color</span>
                  <select
                    aria-label="Link color"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.linkColorToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.link = ensure(next.link);
                        next.link.color = ensure(next.link.color);
                        next.link.color.token = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Link underline color</span>
                  <select
                    aria-label="Link underline color"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.linkUnderlineToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.link = ensure(next.link);
                        next.link.underline = ensure(next.link.underline);
                        next.link.underline.token = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Button hover color</span>
                  <select
                    aria-label="Button hover color"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.btnHoverToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        const ensureToken = (obj: any) => {
                          obj = ensure(obj);
                          obj.hoverBackground = ensure(obj.hoverBackground);
                          obj.hoverBackground.token = val;
                          return obj;
                        };
                        next.button = ensure(next.button);
                        next.button.primary = ensureToken(next.button.primary);
                        next.button.accent = ensureToken(next.button.accent);
                        next.button.secondary = ensureToken(
                          next.button.secondary,
                        );
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Button active color</span>
                  <select
                    aria-label="Button active color"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.btnActiveToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        const ensureToken = (obj: any) => {
                          obj = ensure(obj);
                          obj.activeBackground = ensure(obj.activeBackground);
                          obj.activeBackground.token = val;
                          return obj;
                        };
                        next.button = ensure(next.button);
                        next.button.primary = ensureToken(next.button.primary);
                        next.button.accent = ensureToken(next.button.accent);
                        next.button.secondary = ensureToken(
                          next.button.secondary,
                        );
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Button hover shadow</span>
                  <select
                    aria-label="Button hover shadow"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.btnHoverShadow}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.button = ensure(next.button);
                        next.button.primary = ensure(next.button.primary);
                        next.button.accent = ensure(next.button.accent);
                        next.button.secondary = ensure(next.button.secondary);
                        next.button.primary.hoverShadow = val;
                        next.button.accent.hoverShadow = val;
                        next.button.secondary.hoverShadow = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {shadowKeys.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Button active shadow</span>
                  <select
                    aria-label="Button active shadow"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.btnActiveShadow}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.button = ensure(next.button);
                        next.button.primary = ensure(next.button.primary);
                        next.button.accent = ensure(next.button.accent);
                        next.button.secondary = ensure(next.button.secondary);
                        next.button.primary.activeShadow = val;
                        next.button.accent.activeShadow = val;
                        next.button.secondary.activeShadow = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {shadowKeys.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Link hover color</span>
                  <select
                    aria-label="Link hover color"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.linkHoverToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.link = ensure(next.link);
                        next.link.hoverColor = ensure(next.link.hoverColor);
                        next.link.hoverColor.token = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Link active color</span>
                  <select
                    aria-label="Link active color"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.linkActiveToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.link = ensure(next.link);
                        next.link.activeColor = ensure(next.link.activeColor);
                        next.link.activeColor.token = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Link background color</span>
                  <select
                    aria-label="Link background color"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.linkBgToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.link = ensure(next.link);
                        next.link.background = ensure(next.link.background);
                        next.link.background.token = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3">
                  <span className="text-sm w-44">Link hover background</span>
                  <select
                    aria-label="Link hover background"
                    className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                    value={quickValues.linkHoverBgToken}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComponents((prev) => {
                        const next = JSON.parse(JSON.stringify(prev || {}));
                        const ensure = (v: any) =>
                          v && typeof v === "object" ? v : {};
                        next.link = ensure(next.link);
                        next.link.hoverBackground = ensure(
                          next.link.hoverBackground,
                        );
                        next.link.hoverBackground.token = val;
                        applyThemeComponents(next);
                        return next;
                      });
                    }}
                  >
                    <option value="">-- none --</option>
                    {tokenKeys.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-xl border border-[hsl(var(--border))]">
              <span className="text-sm w-44">Button radius</span>
              <select
                aria-label="Button radius"
                className="h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                value={quickValues.btnRadius || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setComponents((prev) => {
                    const next = JSON.parse(JSON.stringify(prev || {}));
                    const ensure = (v: any) =>
                      v && typeof v === "object" ? v : {};
                    next.button = ensure(next.button);
                    next.button.primary = ensure(next.button.primary);
                    next.button.accent = ensure(next.button.accent);
                    next.button.secondary = ensure(next.button.secondary);
                    next.button.primary.radius = val || undefined;
                    next.button.accent.radius = val || undefined;
                    next.button.secondary.radius = val || undefined;
                    applyThemeComponents(next);
                    return next;
                  });
                }}
              >
                <option value="">-- none --</option>
                {radiiKeys.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Button
                variant="ghost"
                onClick={() =>
                  setComponents((prev) => {
                    const next = JSON.parse(JSON.stringify(prev || {}));
                    if (next?.button?.primary)
                      delete next.button.primary.radius;
                    if (next?.button?.accent) delete next.button.accent.radius;
                    if (next?.button?.secondary)
                      delete next.button.secondary.radius;
                    applyThemeComponents(next);
                    return next;
                  })
                }
              >
                Reset
              </Button>
            </div>
            <ComponentsEditor
              data={components}
              tokenOptions={tokenKeys}
              radiusOptions={radiiKeys}
              shadowOptions={shadowKeys}
              borderWidthOptions={borderWidthKeys}
              transitionOptions={transitionKeys}
              onChange={(next) => {
                setComponents(next);
                applyThemeComponents(next);
              }}
            />
            <div className="flex justify-end gap-2" />
          </div>
        </div>
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
  colorMode = "HSL",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colorMode?: "HSL" | "RGB" | "HEX";
}) {
  // Try to convert hsl(…) to hex for the color input; fall back to blank.
  const hslToHex = (hslCss: string): string => {
    try {
      const s = hslCss.trim().replace(/^hsl\(|\)$/g, "");
      const [hRaw, sRaw, lRaw] = s.split(/\s+/);
      const h = parseFloat(hRaw);
      const sv = parseFloat(sRaw);
      const lv = parseFloat(lRaw);
      const sPct = isNaN(sv) ? 0 : sv / 100;
      const lPct = isNaN(lv) ? 0 : lv / 100;
      const c = (1 - Math.abs(2 * lPct - 1)) * sPct;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = lPct - c / 2;
      let r = 0,
        g = 0,
        b = 0;
      if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
      else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
      else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
      else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
      else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
      else[r, g, b] = [c, 0, x];
      const toHex = (n: number) => {
        const v = Math.round((n + m) * 255);
        return (v < 16 ? "0" : "") + v.toString(16);
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch {
      return "";
    }
  };
  const hexToHslCss = (hex: string): string => {
    try {
      const v = hex.replace("#", "");
      const r = parseInt(v.substring(0, 2), 16) / 255;
      const g = parseInt(v.substring(2, 4), 16) / 255;
      const b = parseInt(v.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;
      const d = max - min;
      if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1));
        switch (max) {
          case r:
            h = ((g - b) / d) % 6;
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          default:
            h = (r - g) / d + 4;
            break;
        }
        h *= 60;
        if (h < 0) h += 360;
      }
      return `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(
        l * 100,
      )}%)`;
    } catch {
      return value;
    }
  };

  const hex = useMemo(() => hslToHex(value), [value]);
  const rgbString = useMemo(() => {
    try {
      // parse hsl to rgb string
      const s = value.trim().replace(/^hsl\(|\)$/g, "");
      const [hRaw, sRaw, lRaw] = s.split(/\s+/);
      const h = parseFloat(hRaw);
      const sv = parseFloat(sRaw) / 100;
      const lv = parseFloat(lRaw) / 100;
      const c = (1 - Math.abs(2 * lv - 1)) * sv;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = lv - c / 2;
      let r = 0,
        g = 0,
        b = 0;
      if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
      else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
      else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
      else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
      else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
      else[r, g, b] = [c, 0, x];
      const to255 = (n: number) => Math.round((n + m) * 255);
      return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`;
    } catch {
      return "";
    }
  }, [value]);

  return (
    <label className="flex items-center gap-3 p-2 rounded-xl border border-[hsl(var(--border))]">
      <span className="text-sm w-36 truncate" title={label}>
        {label}
      </span>
      {colorMode === "HEX" && (
        <input
          type="color"
          className="h-9 w-12 rounded-md border border-[hsl(var(--border))]"
          value={hex}
          onChange={(e) => onChange(hexToHslCss(e.target.value))}
        />
      )}
      <input
        type="text"
        className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
        value={
          colorMode === "HEX" ? hex : colorMode === "RGB" ? rgbString : value
        }
        onChange={(e) => {
          const v = e.target.value;
          if (colorMode === "HEX") onChange(hexToHslCss(v));
          else if (colorMode === "RGB") {
            // Expect rgb(r,g,b)
            try {
              const m = v.match(
                /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,
              );
              if (m) {
                const r = parseInt(m[1], 10),
                  g = parseInt(m[2], 10),
                  b = parseInt(m[3], 10);
                // convert to hex then to hsl using existing util
                const toHex = (n: number) =>
                  (n < 16 ? "0" : "") + n.toString(16);
                const hexVal = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                onChange(hexToHslCss(hexVal));
                return;
              }
            } catch { }
            // fallback: pass-through
            onChange(v);
          } else {
            onChange(v);
          }
        }}
        placeholder={
          colorMode === "HEX"
            ? "#RRGGBB"
            : colorMode === "RGB"
              ? "rgb(r, g, b)"
              : "hsl(h s% l%)"
        }
      />
    </label>
  );
}

function ScaleFieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const hasOptions = Array.isArray(options) && options.length > 0;
  const isCustom = !hasOptions || (value && !options.includes(value));
  return (
    <label className="flex items-center gap-3 p-2 rounded-xl border border-[hsl(var(--border))]">
      <span className="text-sm w-44 truncate" title={label}>
        {label}
      </span>
      {hasOptions && (
        <select
          aria-label={`${label} preset`}
          className="h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
          value={isCustom ? "__custom__" : value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "__custom__") return; // show input below
            onChange(v);
          }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__custom__">Custom…</option>
        </select>
      )}
      {(isCustom || !hasOptions) && (
        <input
          type="text"
          aria-label={`${label} custom`}
          className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter custom value"
        />
      )}
    </label>
  );
}

function ThemeRange({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
}) {
  const display = Number.isFinite(value)
    ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")
    : "1";
  return (
    <label className="rounded-xl border border-[hsl(var(--border))] p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span>{label}</span>
        <span className="text-xs subtle">{display}rem</span>
      </div>
      <input
        type="range"
        className="theme-range"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : min}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        aria-label={`${label} range`}
      />
    </label>
  );
}

function ScalesEditor({
  basePath,
  data,
  onChange,
}: {
  basePath: string;
  data: any;
  onChange: (path: string, v: string) => void;
}) {
  const entries = Object.entries(data || {});
  const getOptions = (path: string, val: any): string[] => {
    // Derive options from group values where it makes sense
    const root = (p: string) => p.split(".")[0];
    const top = root(path);
    try {
      switch (top) {
        case "radii":
          return Object.values((data as any).radii || {}) as string[];
        case "spacing":
          return Object.values((data as any).spacing || {}) as string[];
        case "shadow":
          return Object.values((data as any).shadow || {}) as string[];
        case "zIndex":
          return Object.values((data as any).zIndex || {}).map(String);
        case "borderWidth":
          return Object.values((data as any).borderWidth || {}) as string[];
        case "font": {
          if (path.includes("sizes"))
            return Object.values(
              ((data as any).font || {}).sizes || {},
            ) as string[];
          if (path.includes("weights"))
            return Object.values(((data as any).font || {}).weights || {}).map(
              String,
            );
          if (path.includes("lineHeights"))
            return Object.values(
              ((data as any).font || {}).lineHeights || {},
            ).map(String);
          return [];
        }
        case "transitions":
          return Object.values((data as any).transitions || {}).filter(
            (v) => typeof v === "string",
          ) as string[];
        default:
          return [];
      }
    } catch {
      return [];
    }
  };
  return (
    <div className="space-y-6">
      {entries.map(([key, val]) => {
        const path = basePath ? `${basePath}.${key}` : key;
        if (val && typeof val === "object" && !Array.isArray(val)) {
          return (
            <div key={path}>
              <h3 className="font-medium mb-2">{path}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(val).map(([k2, v2]) =>
                  v2 && typeof v2 === "object" && !Array.isArray(v2) ? (
                    <ScalesEditor
                      key={`${path}.${k2}`}
                      basePath={`${path}.${k2}`}
                      data={v2}
                      onChange={onChange}
                    />
                  ) : (
                    <ScaleFieldSelect
                      key={`${path}.${k2}`}
                      label={`${path}.${k2}`}
                      value={String(v2)}
                      options={getOptions(`${path}.${k2}`, v2)}
                      onChange={(v) => onChange(`${path}.${k2}`, v)}
                    />
                  ),
                )}
              </div>
            </div>
          );
        }
        return (
          <ScaleFieldSelect
            key={path}
            label={path}
            value={String(val)}
            options={getOptions(path, val)}
            onChange={(v) => onChange(path, v)}
          />
        );
      })}
    </div>
  );
}

function ComponentsEditor({
  data,
  tokenOptions = [],
  radiusOptions = [],
  shadowOptions = [],
  borderWidthOptions = [],
  transitionOptions = [],
  onChange,
}: {
  data: Record<string, any>;
  tokenOptions?: string[];
  radiusOptions?: string[];
  shadowOptions?: string[];
  borderWidthOptions?: string[];
  transitionOptions?: string[];
  onChange: (next: Record<string, any>) => void;
}) {
  const setAtPath = (path: string[], value: any) => {
    const clone = JSON.parse(JSON.stringify(data || {}));
    let curr: any = clone;
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      if (!curr[p] || typeof curr[p] !== "object") curr[p] = {};
      curr = curr[p];
    }
    curr[path[path.length - 1]] = value;
    onChange(clone);
  };

  const renderNode = (node: any, path: string[] = []) => {
    if (
      node &&
      typeof node === "object" &&
      !Array.isArray(node) &&
      !("css" in node)
    ) {
      return (
        <div className="space-y-3">
          {Object.entries(node).map(([k, v]) => (
            <div key={[...path, k].join(".")}>
              {renderNode(v, [...path, k])}
            </div>
          ))}
        </div>
      );
    }
    const label = path.join(".");
    const isObject = typeof node === "object" && node !== null;
    const isCssObj = isObject && "css" in (node as any);
    const currentValue = isCssObj
      ? String((node as any).css)
      : String(node ?? "");
    const updateValue = (val: string) => {
      if (isCssObj) {
        const next = { ...(node as any), css: val };
        setAtPath(path, next);
      } else {
        setAtPath(path, val);
      }
    };

    const isTokenRef = label.endsWith(".token");
    const isRadius = label.endsWith(".radius");
    const isShadow =
      label.endsWith(".shadow") ||
      label.endsWith(".hoverShadow") ||
      label.endsWith(".activeShadow");
    const isBorderWidth = label.endsWith(".border.width");
    const isTransition = label.endsWith(".transition");
    return (
      <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] items-center gap-3 p-2 rounded-xl border border-[hsl(var(--border))]">
        <div className="text-sm font-medium truncate" title={label}>
          {label}
        </div>
        <div className="flex items-center gap-2">
          {isTokenRef ? (
            <select
              aria-label="Token reference"
              className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
              value={currentValue}
              onChange={(e) => updateValue(e.target.value)}
            >
              <option value="">-- select token --</option>
              {tokenOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : isRadius ? (
            <select
              aria-label="Radius"
              className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
              value={currentValue}
              onChange={(e) => updateValue(e.target.value)}
            >
              <option value="">-- select radius --</option>
              {radiusOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          ) : isShadow ? (
            <select
              aria-label="Shadow"
              className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
              value={currentValue}
              onChange={(e) => updateValue(e.target.value)}
            >
              <option value="">-- select shadow --</option>
              {shadowOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : isBorderWidth ? (
            <select
              aria-label="Border width"
              className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
              value={currentValue}
              onChange={(e) => updateValue(e.target.value)}
            >
              <option value="">-- select border width --</option>
              {borderWidthOptions.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          ) : isTransition ? (
            <select
              aria-label="Transition"
              className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
              value={currentValue}
              onChange={(e) => updateValue(e.target.value)}
            >
              <option value="">-- select transition --</option>
              {transitionOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
              value={currentValue}
              onChange={(e) => updateValue(e.target.value)}
              placeholder="token name, width, or hsl(…)"
            />
          )}
        </div>
      </div>
    );
  };

  return <div className="space-y-3">{renderNode(data)}</div>;
}

function PreviewPanel() {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">Preview</h2>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <a href="#" className="link">
          Link
        </a>
        <a href="#" className="link link-hover-primary">
          Hover → Primary
        </a>
        <a href="#" className="link link-hover-secondary">
          Hover → Secondary
        </a>
        <div className="glass rounded-2xl p-4 border w-full md:w-auto mt-2">
          <div className="text-sm subtle">Card</div>
          <div className="text-base font-medium">Beautiful modern card</div>
        </div>
      </div>
    </div>
  );
}
