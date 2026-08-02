"use client";

import * as React from "react";
import { TbInfoCircle, TbLayout, TbRestore } from "react-icons/tb";
import { useTheme } from "@repo/hooks";
import {
  formatLayoutDensityCSSValue,
  normalizeResponsiveLayoutDensity,
  parseLayoutDensityNumeric,
  resolveLayoutDensityToken,
  setDefaultTabTokenValue,
  setViewportTokenValue,
} from "@repo/constants";
import {
  Badge,
  Button,
  cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TokenRangeControl,
} from "@repo/ui";
import { AppearanceCategoryLivePreviewPanel } from "@/components/settings/appearance-category-live-preview-panel";
import { AppearancePageLivePreviewPanel } from "@/components/settings/appearance-page-live-preview-panel";
import { APPEARANCE_PAGE_OPTIONS } from "@/components/settings/appearance-preview-registry";
import {
  BREAKPOINTS,
  DENSITY_LABELS,
  TOKEN_CATEGORIES,
  UNITLESS_KEYS,
  buildPreviewStyle,
  buildTypographyTokenGroups,
  cloneDensityDraft,
  getBreakpointFromWidth,
  getScopeViewport,
  type AppearanceDensityTab,
  type DensityScope,
  type LayoutDensityTokenKey,
  type PageScope,
  type TokenMeta,
} from "@/components/settings/appearance-density-config";

export function AppearanceDensityStudio() {
  const { themeSettings, updateThemeSettings } = useTheme();
  const [scope, setScope] = React.useState<DensityScope>("xl");
  const [category, setCategory] = React.useState<AppearanceDensityTab>("typography");
  const [pageScope, setPageScope] = React.useState<PageScope>("global");

  React.useEffect(() => {
    const syncViewport = () => setScope(getBreakpointFromWidth(window.innerWidth));
    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const density = React.useMemo(
    () => normalizeResponsiveLayoutDensity(themeSettings.layoutDensity ?? null),
    [themeSettings.layoutDensity],
  );

  const activeBreakpoint =
    BREAKPOINTS.find((item) => item.key === (scope === "default" ? "xl" : scope)) ??
    BREAKPOINTS[4]!;
  const scopeViewport = getScopeViewport(scope);
  const pageTokenOverrides =
    pageScope === "global"
      ? undefined
      : themeSettings.layoutDensityByPage?.[pageScope];
  const previewStyle = buildPreviewStyle(density, scope, pageTokenOverrides);
  const hasAnyOverride = Boolean(
    (density &&
      (Object.keys(density.base ?? {}).length > 0 ||
        Object.keys(density.viewports ?? {}).length > 0)) ||
      Object.values(themeSettings.layoutDensityByPage ?? {}).some(
        (tokens) => tokens && Object.keys(tokens).length > 0,
      ),
  );

  const patchToken = React.useCallback(
    (key: LayoutDensityTokenKey, value: number) => {
      // Per-page mode: write to layoutDensityByPage
      if (pageScope !== "global") {
        const current = { ...(themeSettings.layoutDensityByPage ?? {}) };
        const page = { ...(current[pageScope] ?? {}) };
        page[key] = formatLayoutDensityCSSValue(key, value);
        updateThemeSettings(
          { layoutDensityByPage: { ...current, [pageScope]: page } },
          { persist: false },
        );
        return;
      }

      // Global mode: write to layoutDensity
      const current =
        normalizeResponsiveLayoutDensity(themeSettings.layoutDensity ?? null) ?? {
          base: {},
          viewports: {},
        };

      const next =
        scope === "default"
          ? setDefaultTabTokenValue(current, key, value)
          : setViewportTokenValue(current, scope, key, value);

      updateThemeSettings({ layoutDensity: next }, { persist: false });
    },
    [scope, pageScope, themeSettings.layoutDensity, themeSettings.layoutDensityByPage, updateThemeSettings],
  );

  const resetScope = React.useCallback(() => {
    if (pageScope !== "global") {
      const current = { ...(themeSettings.layoutDensityByPage ?? {}) };
      delete current[pageScope];
      updateThemeSettings({ layoutDensityByPage: current }, { persist: false });
      return;
    }

    const next = cloneDensityDraft(
      normalizeResponsiveLayoutDensity(themeSettings.layoutDensity ?? null),
    );
    if (!next) return;
    if (scope === "default") {
      delete next.base;
    } else if (next.viewports) {
      delete next.viewports[scope];
    }
    updateThemeSettings(
      { layoutDensity: normalizeResponsiveLayoutDensity(next) },
      { persist: false },
    );
  }, [scope, pageScope, themeSettings.layoutDensity, themeSettings.layoutDensityByPage, updateThemeSettings]);

  const resetAll = React.useCallback(() => {
    updateThemeSettings(
      { layoutDensity: null, layoutDensityByPage: null },
      { persist: false },
    );
  }, [updateThemeSettings]);

  const renderControl = (token: TokenMeta) => {
    const isUnitless = UNITLESS_KEYS.has(token.key);
    // When in page scope, read from per-page overrides; fallback to global
    const currentValue = pageScope !== "global"
      ? parseLayoutDensityNumeric(
          themeSettings.layoutDensityByPage?.[pageScope]?.[token.key],
          resolveLayoutDensityToken(scopeViewport, token.key, density),
        )
      : resolveLayoutDensityToken(scopeViewport, token.key, density);
    const displayUnit = token.unit !== undefined ? token.unit : (isUnitless ? "" : "rem");
    return (
      <TokenRangeControl
        key={token.key}
        label={token.label}
        description={token.description}
        icon={token.icon}
        valueRem={currentValue}
        onChangeRem={(value) => patchToken(token.key, value)}
        min={token.min}
        max={token.max}
        step={token.step}
        unit={displayUnit}
      />
    );
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border/70 bg-muted/15 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="app-text-heading-sm">{DENSITY_LABELS.title}</h3>
          <p className="mt-0.5 app-text-body text-muted-foreground">
            {DENSITY_LABELS.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={resetScope} className="shrink-0 cursor-pointer gap-1.5 app-text-caption">
            <TbRestore className="app-icon-xs" aria-hidden />
            Reset current scope
          </Button>
          {hasAnyOverride && (
            <Button type="button" variant="outline" size="sm" onClick={resetAll} className="shrink-0 cursor-pointer gap-1.5 app-text-caption">
              <TbRestore className="app-icon-xs" aria-hidden />
              {DENSITY_LABELS.resetAll}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 app-text-caption text-muted-foreground">
          <TbInfoCircle className="app-icon-xs shrink-0" aria-hidden />
          <span>Editing scope</span>
          <Badge variant="secondary" className="ml-auto px-1.5 app-text-micro font-mono">
            {pageScope !== "global"
              ? `page: ${pageScope}`
              : scope === "default"
                ? "Global (XL anchor)"
                : activeBreakpoint.hint}
          </Badge>
        </div>

        {/* Breakpoint selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => { setScope("default"); }}
            className={[
              "flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 app-text-caption transition-all duration-150",
              scope === "default"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            <TbLayout className="app-icon-xs shrink-0" />
            Default
          </button>
          {BREAKPOINTS.map((bp) => (
            <button
              key={bp.key}
              type="button"
              onClick={() => { setScope(bp.key); }}
              title={bp.hint}
              className={[
                "flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 app-text-caption transition-all duration-150",
                scope === bp.key
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              ].join(" ")}
            >
              {bp.icon}
              {bp.label}
            </button>
          ))}
        </div>

        {/* Per-page scope selector */}
        <div className="space-y-1">
          <p className="app-text-micro uppercase app-tracking-caps text-muted-foreground/70 flex items-center gap-1">
            <TbLayout className="app-icon-xs" />
            Page overrides
          </p>
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none flex-wrap">
            <button
              type="button"
              onClick={() => setPageScope("global")}
              className={[
                "flex shrink-0 items-center rounded-lg border px-2 py-1 app-text-micro transition-all duration-150",
                pageScope === "global"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border/40 bg-background/50 text-muted-foreground hover:border-primary/30 hover:text-foreground",
              ].join(" ")}
            >
              Global (None)
            </button>
            {APPEARANCE_PAGE_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPageScope(p.id)}
                className={[
                  "flex shrink-0 items-center rounded-lg border px-2 py-1 app-text-micro transition-all duration-150",
                  pageScope === p.id
                    ? "border-warning/40 bg-warning/10 text-warning dark:text-warning shadow-sm"
                    : "border-border/40 bg-background/50 text-muted-foreground hover:border-warning/40 hover:text-foreground",
                ].join(" ")}
              >
                {p.label}
                {themeSettings.layoutDensityByPage?.[p.id] &&
                  Object.keys(themeSettings.layoutDensityByPage[p.id]!).length > 0 && (
                    <span className="ml-1 rounded-full bg-warning/20 px-1 app-text-micro text-warning dark:text-warning">
                      •
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Tabs value={category} onValueChange={(value) => setCategory(value as AppearanceDensityTab)} className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-xl bg-muted/50 p-1">
          {TOKEN_CATEGORIES.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="min-w-28 flex-1 basis-[calc(25%-0.25rem)] gap-1 app-text-caption sm:app-text-body">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TOKEN_CATEGORIES.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {/** Typography has dense controls; group semantically to reduce cognitive load. */}
            {(() => {
              const groupedTypographyTokens =
                tab.id === "typography" ? buildTypographyTokenGroups(tab.tokens) : null;

              const isTypographyTab = tab.id === "typography";

              return (
                <div
                  className={cn(
                    "grid gap-4 xl:items-start",
                    // Typography keeps denser control column (60/40); other tabs favor live preview (30/70).
                    isTypographyTab
                      ? "xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
                      : "xl:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]",
                  )}
                >
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/50 bg-background/40 p-2">
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="app-text-caption uppercase app-tracking-caps text-muted-foreground">
                          {pageScope !== "global"
                            ? `Page override — ${APPEARANCE_PAGE_OPTIONS.find((p) => p.id === pageScope)?.label ?? pageScope}`
                            : scope === "default"
                              ? "Default fallback values"
                              : `${activeBreakpoint.label} viewport overrides`}
                        </span>
                        <Badge variant="outline" className="ml-auto px-1.5 app-text-micro font-mono">
                          {pageScope !== "global" ? pageScope : scope === "default" ? "global" : activeBreakpoint.cssMax}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {groupedTypographyTokens
                          ? groupedTypographyTokens.map((group) => (
                            <div
                              key={group.id}
                              className="w-full rounded-xl border border-border/50 bg-muted/20 p-2"
                            >
                              <div className="flex items-start gap-2">
                                <span className="mt-0.5 text-muted-foreground">{group.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="app-text-caption">{group.label}</p>
                                  <p className="app-text-micro text-muted-foreground">
                                    {group.description}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="px-1.5 app-text-micro">
                                  {group.tokens.length} controls
                                </Badge>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {group.tokens.map((token) => (
                                  <div key={token.key} className="min-w-0 flex-1 basis-52">
                                    {renderControl(token)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                          : tab.tokens.map((token) => (
                            <div key={token.key} className="min-w-0 flex-1 basis-52">
                              {renderControl(token)}
                            </div>
                          ))}
                      </div>
                    </div>

                    <p className="app-text-caption text-muted-foreground">
                      {pageScope !== "global"
                        ? `Overriding tokens for [data-app-page="${pageScope}"]. Applied on top of global density at every viewport while that page is active.`
                        : scope === "default"
                          ? "Default values feed every viewport unless a more specific breakpoint override exists."
                          : `You are editing ${activeBreakpoint.hint}. Changes update live immediately and are saved only when you press Save Changes.`}
                    </p>
                  </div>

                  <div className="min-h-0 space-y-3 xl:sticky xl:top-4">
                    {pageScope !== "global" ? (
                      <AppearancePageLivePreviewPanel
                        pageScope={pageScope}
                        previewStyle={previewStyle}
                        viewportWidthPx={Number.parseInt(activeBreakpoint.cssMax, 10)}
                        fitMode={isTypographyTab ? "contain" : "width"}
                      />
                    ) : (
                      <AppearanceCategoryLivePreviewPanel
                        category={tab.id}
                        previewVariant={tab.previewVariant}
                        previewStyle={previewStyle}
                        maxWidth={scope === "default" ? "100%" : activeBreakpoint.cssMax}
                      />
                    )}
                  </div>
                </div>
              );
            })()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
