"use client";

import * as React from "react";
// Importing all the default settings and lists of colors/fonts from the constants package.
import {
  defaultThemeSettings,
  densityViewportKeys,
  fontFamilyValues,
  fontSizeValues,
  contentWidthValues,
  normalizeResponsiveLayoutDensity,
  buildLayoutDensityOverrideCss,
  buildPageDensityOverrideCss,
  LAYOUT_DENSITY_CSS_VAR_MAP,
  getBaseDelta,
} from "@repo/constants";
import type {
  DensityViewportKey,
  LayoutDensityTokens,
  ResponsiveLayoutDensity,
  ThemeMode,
  ThemeSettings,
} from "@repo/types";
import {
  fetchUiContextState,
  patchUiContextState,
} from "./ui-context/context-store";
import {
  replaceAppliedThemeVariables,
  resolveThemePresetStyles,
} from "./theme-preset-resolver";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
  initialThemeSettings?: ThemeSettings;
};

type ThemeUpdateOptions = {
  persist?: boolean;
};

// This defines what information our Theme context holds.
type ThemeProviderState = {
  theme: ThemeMode; // 'dark' or 'light'
  setTheme: (theme: ThemeMode) => void; // function to change mode
  themeSettings: ThemeSettings; // complex object with fonts, colors, etc.
  updateThemeSettings: (
    settings: Partial<ThemeSettings>,
    options?: ThemeUpdateOptions,
  ) => void; // function to update specific settings
  saveThemeSettings: (nextSettings?: ThemeSettings) => Promise<boolean>;
  resetThemeSettingsToSaved: () => void;
  hasUnsavedChanges: boolean;
  isReady: boolean; // is the theme loaded?
};

// Giving it some starting values so it doesn't crash before loading.
const initialState: ThemeProviderState = {
  theme: defaultThemeSettings.mode,
  setTheme: () => null,
  themeSettings: defaultThemeSettings,
  updateThemeSettings: () => null,
  saveThemeSettings: async () => false,
  resetThemeSettingsToSaved: () => null,
  hasUnsavedChanges: false,
  isReady: false,
};

export const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

export function useTheme() {
  return React.useContext(ThemeProviderContext);
}

const LAYOUT_DENSITY_CSS_MAP = LAYOUT_DENSITY_CSS_VAR_MAP;

const DENSITY_STYLE_TAG_ID = "responsive-layout-density-overrides";

function clearLayoutDensityCssVars(root: HTMLElement) {
  (Object.keys(LAYOUT_DENSITY_CSS_MAP) as Array<keyof LayoutDensityTokens>).forEach(
    (key) => {
      root.style.removeProperty(`--${LAYOUT_DENSITY_CSS_MAP[key]}`);
    },
  );
}

function getOrCreateDensityStyleTag() {
  let styleTag = document.getElementById(DENSITY_STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = DENSITY_STYLE_TAG_ID;
    const container = document.body ?? document.head;
    container.appendChild(styleTag);
  }
  // Keep overrides last in `<body>` so they win over SSR inline style blocks.
  const container = document.body ?? document.head;
  container.appendChild(styleTag);
  return styleTag;
}

function applyLayoutDensityCssVars(settings: ThemeSettings) {
  const root = document.documentElement;
  clearLayoutDensityCssVars(root);
  const density = normalizeResponsiveLayoutDensity(
    settings.layoutDensity as ResponsiveLayoutDensity | LayoutDensityTokens | null | undefined,
  );
  const styleTag = getOrCreateDensityStyleTag();
  const densityCss = buildLayoutDensityOverrideCss(density);
  const pageDensityCss = buildPageDensityOverrideCss(
    settings.layoutDensityByPage,
  );
  styleTag.textContent = [densityCss, pageDensityCss].filter(Boolean).join("\n");
}

const resolveIsDarkMode = (mode: ThemeMode) => {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const resolveThemeLocale = (locale?: string | null): "en" | "fa" | "ar" | "tr" => {
  if (locale === "fa" || locale === "ar" || locale === "tr") {
    return locale;
  }

  return "en";
};

const resolveFontFamilyOption = (
  settings: ThemeSettings,
  locale: string | null | undefined,
) => {
  const resolvedLocale = resolveThemeLocale(locale);
  return settings.fontFamilyByLocale?.[resolvedLocale] ?? settings.fontFamily;
};

const cloneResponsiveLayoutDensity = (
  density: ResponsiveLayoutDensity | LayoutDensityTokens | null | undefined,
): ResponsiveLayoutDensity | null => {
  const normalized = normalizeResponsiveLayoutDensity(density);
  if (!normalized) return null;

  const viewports = normalized.viewports
    ? (Object.fromEntries(
      Object.entries(normalized.viewports).map(([viewport, tokens]) => [
        viewport,
        { ...(tokens ?? {}) },
      ]),
    ) as ResponsiveLayoutDensity["viewports"])
    : undefined;

  return {
    base: normalized.base ? { ...normalized.base } : undefined,
    viewports,
  };
};

const cloneThemeSettings = (settings: ThemeSettings): ThemeSettings => ({
  ...settings,
  brandColors: settings.brandColors ? { ...settings.brandColors } : {},
  fontFamilyByLocale: settings.fontFamilyByLocale
    ? { ...settings.fontFamilyByLocale }
    : undefined,
  importedTheme: settings.importedTheme
    ? {
      ...settings.importedTheme,
      light: { ...settings.importedTheme.light },
      dark: { ...settings.importedTheme.dark },
    }
    : null,
  customThemePresets: (settings.customThemePresets ?? []).map((preset) => ({
    ...preset,
    styles: {
      light: { ...preset.styles.light },
      dark: { ...preset.styles.dark },
    },
  })),
  layoutDensity: cloneResponsiveLayoutDensity(settings.layoutDensity),
  layoutDensityByPage: settings.layoutDensityByPage
    ? Object.fromEntries(
        Object.entries(settings.layoutDensityByPage).map(([pageId, tokens]) => [
          pageId,
          { ...(tokens ?? {}) },
        ]),
      )
    : null,
});

const areThemeSettingsEqual = (a: ThemeSettings, b: ThemeSettings): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

/** Single client applicator — preset vars + density. Prefer this over any legacy HSL path. */
export const applyThemeSettings = (
  settings: ThemeSettings,
  isDarkMode: boolean,
) => {
  const root = document.documentElement;
  const body = document.body;

  const preset = resolveThemePresetStyles(settings);
  replaceAppliedThemeVariables(
    root,
    preset ? (isDarkMode ? preset.dark : preset.light) : {},
  );

  if (settings.selectedRadius) {
    root.style.setProperty("--radius", settings.selectedRadius);
  }

  if (settings.brandColors && Object.keys(settings.brandColors).length > 0) {
    Object.entries(settings.brandColors).forEach(([cssVar, value]) => {
      if (!value) return;
      root.style.setProperty(cssVar, value);
    });
  }

  const fontFamilyOption = resolveFontFamilyOption(settings, root.lang);
  const fontFamily =
    fontFamilyValues[fontFamilyOption] ?? fontFamilyValues.inter;
  root.style.setProperty("--app-font-family", fontFamily);
  root.style.setProperty("--heading-text-decoration", settings.headingTextDecoration ?? "none");
  if (body) {
    body.style.fontFamily = fontFamily;
  }

  const fontSize =
    fontSizeValues[settings.fontSize] ??
    fontSizeValues[defaultThemeSettings.fontSize];
  const normalizedDensity = normalizeResponsiveLayoutDensity(
    settings.layoutDensity as ResponsiveLayoutDensity | LayoutDensityTokens | null | undefined,
  );
  const hasTextBodyCustomization =
    Boolean(normalizedDensity) &&
    (getBaseDelta(normalizedDensity, "textBody") !== 0 ||
      densityViewportKeys.some(
        (viewport) => normalizedDensity?.viewports?.[viewport]?.textBody,
      ));
  if (!hasTextBodyCustomization) {
    root.style.setProperty("--text-body", fontSize);
  }

  const contentWidth =
    contentWidthValues[settings.contentWidth] ?? contentWidthValues.fluid;
  root.style.setProperty("--app-content-width", contentWidth);

  applyLayoutDensityCssVars(settings);
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
  storageKey: _storageKey,
  initialThemeSettings,
  ...props
}) => {
  // Kept for API compatibility with the former localStorage-backed provider.
  void _storageKey;
  const initialResolvedSettings = React.useMemo<ThemeSettings>(() => {
    if (initialThemeSettings) {
      return cloneThemeSettings({
        ...defaultThemeSettings,
        ...initialThemeSettings,
      });
    }

    return cloneThemeSettings({ ...defaultThemeSettings, mode: defaultTheme });
  }, [defaultTheme, initialThemeSettings]);

  const [themeSettings, setThemeSettings] = React.useState<ThemeSettings>(
    initialResolvedSettings,
  );
  const persistedThemeSettingsRef = React.useRef<ThemeSettings>(initialResolvedSettings);
  const [isHydrating, setIsHydrating] =
    React.useState<boolean>(!initialThemeSettings);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (initialThemeSettings) return;

    let isActive = true;
    fetchUiContextState()
      .then((state) => {
        if (!isActive) return;
        const nextSettings = cloneThemeSettings({
          ...defaultThemeSettings,
          ...state.theme,
        });
        persistedThemeSettingsRef.current = nextSettings;
        setThemeSettings(nextSettings);
        setIsHydrating(false);
      })
      .catch(() => {
        setIsHydrating(false);
      });

    return () => {
      isActive = false;
    };
  }, [initialThemeSettings]);

  React.useEffect(() => {
    if (initialThemeSettings) {
      setIsHydrating(false);
    }
  }, [initialThemeSettings]);

  // Debounce ref — prevents rapid concurrent PATCH requests when multiple
  // settings change in quick succession (e.g. form watch fires theme + sidebar
  // updates simultaneously).
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistThemeSettings = React.useCallback(
    async (settings: ThemeSettings) => {
      const response = await patchUiContextState({ theme: settings });
      if (!response?.theme) return false;

      persistedThemeSettingsRef.current = cloneThemeSettings({
        ...defaultThemeSettings,
        ...response.theme,
      });
      return true;
    },
    [],
  );

  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const updateThemeSettings = React.useCallback(
    (updates: Partial<ThemeSettings>, options?: ThemeUpdateOptions) => {
      const shouldPersist = options?.persist ?? true;
      setThemeSettings((prev) => {
        const { layoutDensity: layoutDensityUpdate, ...restUpdates } = updates;
        const nextSettings: ThemeSettings = { ...prev, ...restUpdates };

        if (layoutDensityUpdate === undefined) {
          // leave prev.layoutDensity
        } else if (layoutDensityUpdate === null) {
          nextSettings.layoutDensity = null;
        } else {
          nextSettings.layoutDensity = normalizeResponsiveLayoutDensity(
            layoutDensityUpdate as ResponsiveLayoutDensity | LayoutDensityTokens,
          );
        }

        const snapshot = cloneThemeSettings(nextSettings);
        if (areThemeSettingsEqual(prev, snapshot)) {
          return prev;
        }

        if (!shouldPersist) {
          return snapshot;
        }

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          void persistThemeSettings(snapshot);
        }, 200);
        return snapshot;
      });
    },
    [persistThemeSettings],
  );

  const saveThemeSettings = React.useCallback(async (nextSettings?: ThemeSettings) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const snapshot = nextSettings
      ? cloneThemeSettings(nextSettings)
      : cloneThemeSettings(themeSettings);

    setThemeSettings((prev) => {
      if (areThemeSettingsEqual(prev, snapshot)) return prev;
      return snapshot;
    });

    return persistThemeSettings(snapshot);
  }, [persistThemeSettings, themeSettings]);

  const resetThemeSettingsToSaved = React.useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setThemeSettings(cloneThemeSettings(persistedThemeSettingsRef.current));
  }, []);

  const setTheme = React.useCallback(
    (mode: ThemeMode) => {
      updateThemeSettings({ mode });
    },
    [updateThemeSettings],
  );

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (isHydrating) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const isDarkMode = resolveIsDarkMode(themeSettings.mode);
    root.classList.add(isDarkMode ? "dark" : "light");
    root.dataset.theme = isDarkMode ? "dark" : "light";
    applyThemeSettings(themeSettings, isDarkMode);
    setIsReady(true);
  }, [themeSettings, isHydrating]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (isHydrating) return;

    const root = window.document.documentElement;
    const reapplySettings = () => {
      const isDarkMode = resolveIsDarkMode(themeSettings.mode);
      applyThemeSettings(themeSettings, isDarkMode);
    };

    const observer = new MutationObserver((mutations) => {
      const langChanged = mutations.some(
        (mutation) => mutation.type === "attributes" && mutation.attributeName === "lang",
      );

      if (langChanged) {
        reapplySettings();
      }
    });

    observer.observe(root, { attributes: true, attributeFilter: ["lang"] });

    if (themeSettings.mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", reapplySettings);

      return () => {
        observer.disconnect();
        mediaQuery.removeEventListener("change", reapplySettings);
      };
    }

    return () => {
      observer.disconnect();
    };
  }, [themeSettings, isHydrating]);

  const hasUnsavedChanges = React.useMemo(
    () =>
      JSON.stringify(themeSettings) !==
      JSON.stringify(persistedThemeSettingsRef.current),
    [themeSettings],
  );

  const value = React.useMemo(
    () => ({
      theme: themeSettings.mode,
      setTheme,
      themeSettings,
      updateThemeSettings,
      saveThemeSettings,
      resetThemeSettingsToSaved,
      hasUnsavedChanges,
      isReady,
    }),
    [
      themeSettings,
      setTheme,
      updateThemeSettings,
      saveThemeSettings,
      resetThemeSettingsToSaved,
      hasUnsavedChanges,
      isReady,
    ],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

// Circular transition hook
import { useRef, useCallback } from "react";

interface CircularTransitionHook {
  startTransition: (
    coords: { x: number; y: number },
    callback: () => void,
  ) => void;
  toggleTheme: (event: React.MouseEvent) => void;
  isTransitioning: () => boolean;
}

export function useCircularTransition(): CircularTransitionHook {
  const context = React.useContext(ThemeProviderContext);

  if (!context) {
    throw new Error(
      "useCircularTransition must be used within a ThemeProvider",
    );
  }

  const { theme, setTheme } = context;
  const isTransitioningRef = useRef(false);

  const startTransition = useCallback(
    (coords: { x: number; y: number }, callback: () => void) => {
      if (isTransitioningRef.current) return;

      isTransitioningRef.current = true;

      const x = (coords.x / window.innerWidth) * 100;
      const y = (coords.y / window.innerHeight) * 100;

      document.documentElement.style.setProperty("--x", `${x}%`);
      document.documentElement.style.setProperty("--y", `${y}%`);

      if ("startViewTransition" in document) {
        const transition = (
          document as Document & {
            startViewTransition: (callback: () => void) => {
              finished: Promise<void>;
            };
          }
        ).startViewTransition(() => {
          callback();
        });

        transition.finished.finally(() => {
          isTransitioningRef.current = false;
        });
      } else {
        callback();
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 400);
      }
    },
    [],
  );

  const toggleTheme = useCallback(
    (event: React.MouseEvent) => {
      const coords = {
        x: event.clientX,
        y: event.clientY,
      };

      startTransition(coords, () => {
        setTheme(theme === "dark" ? "light" : "dark");
      });
    },
    [theme, setTheme, startTransition],
  );

  const isTransitioning = useCallback(() => isTransitioningRef.current, []);

  return {
    startTransition,
    toggleTheme,
    isTransitioning,
  };
}
