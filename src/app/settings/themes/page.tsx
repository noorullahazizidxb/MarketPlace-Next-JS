"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useThemeStore } from "@/store/theme.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axiosClient";
import {
  applyThemeScales,
  applyThemeTokens,
  fetchRemoteThemes,
} from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { applyThemeComponents } from "@/lib/theme";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/components/language-provider";

type ThemeTokensShape = {
  light: Record<string, any>;
  dark: Record<string, any>;
};

type ScalesShape = Record<string, any>;
type ComponentsShape = Record<string, any>;

const toCssString = (v: any): string => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "css" in v) return String(v.css);
  return "";
};

const wrapCss = (v: string) => ({ css: v });

export default function ThemeSettingsPage() {
  const setTokensStore = useThemeStore((s) => s.setTokens);
  const setScalesStore = useThemeStore((s) => s.setScales);
  const setComponentsStore = useThemeStore((s) => s.setComponents);
  const [tokens, setTokens] = useState<ThemeTokensShape | null>(null);
  const [scales, setScales] = useState<ScalesShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    [scales]
  );
  const shadowKeys = useMemo(
    () => Object.keys((scales as any)?.shadow || {}),
    [scales]
  );
  const borderWidthKeys = useMemo(
    () => Object.keys((scales as any)?.borderWidth || {}),
    [scales]
  );
  const transitionKeys = useMemo(
    () =>
      Object.keys((scales as any)?.transitions || {}).filter(
        (k) => k !== "spring"
      ),
    [scales]
  );

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
      linkHoverToken: link?.hoverColor?.token || "",
      linkActiveToken: link?.activeColor?.token || "",
      linkBgToken: link?.background?.token || "",
      linkHoverBgToken: link?.hoverBackground?.token || "",
      btnRadius: b?.primary?.radius || "",
    };
  }, [components]);

  // init: fetch from /themes only (no localStorage)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchRemoteThemes();
        const first = Array.isArray(data) ? data[0] : undefined;
        const envelope = (first?.tokens as any) || null;
        const rawTokens = envelope ?? null;
        const normalized: ThemeTokensShape | null = rawTokens?.tokens
          ? rawTokens.tokens
          : rawTokens;
        let foundScales: ScalesShape | null = (first?.scales as any) || null;
        let foundComponents: ComponentsShape | null =
          (first?.components as any) || null;
        if (!foundScales && envelope?.scales) foundScales = envelope.scales;
        if (!foundComponents && envelope?.components)
          foundComponents = envelope.components;
        if (mounted) {
          if (envelope) setThemeMeta(envelope);
          if (normalized) setTokens(normalized);
          if (foundScales) setScales(foundScales);
          if (foundComponents) setComponents(foundComponents);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load theme");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
    value: string
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

  const resetFromRemote = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRemoteThemes();
      const first = Array.isArray(data) ? data[0] : undefined;
      const envelope = (first?.tokens as any) || null;
      const rawTokens = envelope ?? null;
      const normalized: ThemeTokensShape | null = rawTokens?.tokens
        ? rawTokens.tokens
        : rawTokens;
      let foundScales: ScalesShape | null = (first?.scales as any) || null;
      let foundComponents: ComponentsShape | null =
        (first?.components as any) || null;
      if (!foundScales && envelope?.scales) foundScales = envelope.scales;
      if (!foundComponents && envelope?.components)
        foundComponents = envelope.components;
      if (envelope) setThemeMeta(envelope);
      if (normalized) {
        setTokens(normalized);
        applyThemeTokens(normalized);
      }
      if (foundScales) {
        setScales(foundScales);
        applyThemeScales(foundScales);
      }
      if (foundComponents) {
        setComponents(foundComponents);
        applyThemeComponents(foundComponents);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to reload /themes");
    } finally {
      setLoading(false);
    }
  };

  // Build normalized payload with css + hsl per token
  const parseHsl = (css: string): [number, number, number] | null => {
    try {
      let v = css.trim();
      if (v.startsWith("hsl(")) v = v.replace(/^hsl\(|\)$/g, "");
      const parts = v.split(/\s+/);
      if (parts.length < 3) return null;
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      const l = parseFloat(parts[2]);
      if ([h, s, l].some((x) => Number.isNaN(x))) return null;
      return [Math.round(h), Math.round(s), Math.round(l)];
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
        const css = toCssString(v);
        const hsl = parseHsl(css) || null;
        out[k] = { css, ...(hsl ? { hsl } : {}) };
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
    const envelope: any = { tokens: normalizedTokens };
    // include only id/name/notes if present; drop other meta fields
    if (themeMeta) {
      if (typeof themeMeta.id !== "undefined") envelope.id = themeMeta.id;
      if (typeof themeMeta.name !== "undefined") envelope.name = themeMeta.name;
      if (typeof themeMeta.notes !== "undefined")
        envelope.notes = themeMeta.notes;
    }
    if (scales) envelope.scales = scales;
    if (components) envelope.components = components;
    return { tokens: envelope };
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = buildPayload();
      if (!body) throw new Error("Nothing to save yet");
      const next = await api.put<any>("/themes", body);
      return next ?? null;
    },
    onSuccess: (data: any) => {
      setSaveMessage("Saved");
      setTimeout(() => setSaveMessage(null), 1500);
      // If API returns updated theme, adopt it
      if (data) {
        const first = Array.isArray(data) ? data[0] : data;
        if (first) setThemeMeta(first);
      }
      // Re-apply and persist current edits
      if (tokens) {
        applyThemeTokens(tokens);
      }
      if (scales) {
        applyThemeScales(scales);
      }
      if (components) {
        applyThemeComponents(components);
      }
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
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1.5 rounded-full border ${
            activeTab === "colors"
              ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent"
              : "border-[hsl(var(--border))]"
          }`}
          onClick={() => setActiveTab("colors")}
        >
          {t("colors")}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border ${
            activeTab === "scales"
              ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent"
              : "border-[hsl(var(--border))]"
          }`}
          onClick={() => setActiveTab("scales")}
        >
          {t("scales")}
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border ${
            activeTab === "components"
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
            <div className="flex items-center gap-2" />
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
                  />
                </div>
                <div>
                  <ColorField
                    label={"Dark"}
                    value={toCssString((tokens.dark as any)[k])}
                    onChange={(v) => handleColorChange("dark", k, v)}
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
          {/* Quick Option: Font base size */}
          {scales?.font?.sizes && (
            <div className="flex items-center gap-3 p-2 rounded-xl border border-[hsl(var(--border))] mb-4">
              <span className="text-sm w-44">Font base size</span>
              <select
                aria-label="Font base size"
                className="h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
                value={String(scales.font.sizes.base ?? "")}
                onChange={(e) =>
                  handleScaleChange("font.sizes.base", e.target.value)
                }
              >
                {Object.values(scales.font.sizes).map((v: any) => (
                  <option key={String(v)} value={String(v)}>
                    {String(v)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <ScalesEditor
            basePath=""
            data={scales}
            onChange={handleScaleChange}
          />
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
                          next.button.secondary
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
                          next.button.secondary
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
                          next.link.hoverBackground
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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
      else [r, g, b] = [c, 0, x];
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
        l * 100
      )}%)`;
    } catch {
      return value;
    }
  };

  const hex = useMemo(() => hslToHex(value), [value]);

  return (
    <label className="flex items-center gap-3 p-2 rounded-xl border border-[hsl(var(--border))]">
      <span className="text-sm w-36 truncate" title={label}>
        {label}
      </span>
      <input
        type="color"
        className="h-9 w-12 rounded-md border border-[hsl(var(--border))]"
        value={hex}
        onChange={(e) => onChange(hexToHslCss(e.target.value))}
      />
      <input
        type="text"
        className="flex-1 h-9 rounded-md bg-transparent border border-[hsl(var(--border))] px-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="hsl(…)"
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
              ((data as any).font || {}).sizes || {}
            ) as string[];
          if (path.includes("weights"))
            return Object.values(((data as any).font || {}).weights || {}).map(
              String
            );
          if (path.includes("lineHeights"))
            return Object.values(
              ((data as any).font || {}).lineHeights || {}
            ).map(String);
          return [];
        }
        case "transitions":
          return Object.values((data as any).transitions || {}).filter(
            (v) => typeof v === "string"
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
                  )
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
