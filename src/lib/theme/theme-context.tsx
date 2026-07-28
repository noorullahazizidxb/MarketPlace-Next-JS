"use client";

import * as React from "react";
// Importing all the default settings and lists of colors/fonts from the constants package.
import {
  colorThemes,
  brandThemes,
  sidebarThemes,
  defaultThemeSettings,
  densityViewportKeys,
  tweakcnThemes,
  fontFamilyValues,
  fontSizeValues,
  contentWidthValues,
  normalizeResponsiveLayoutDensity,
  buildLayoutDensityOverrideCss,
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

// This helper function removes old theme styles so we can apply new ones cleanly.
const resetThemeVars = () => {
  const root = document.documentElement;
  const allPossibleVars = [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
    "radius",
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
    "sidebar",
    "sidebar-background",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
    "font-sans",
    "font-serif",
    "font-mono",
    "shadow-2xs",
    "shadow-xs",
    "shadow-sm",
    "shadow",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
    "spacing",
    "tracking-normal",
    "card-header",
    "card-content",
    "card-footer",
    "muted-background",
    "accent-background",
    "destructive-background",
    "warning",
    "warning-foreground",
    "success",
    "success-foreground",
    "info",
    "info-foreground",
    "brand-gradient-start",
    "brand-gradient-end",
    "brand-gradient",
    "brand-glow",
    "app-font-family",
    "app-font-size",
    "app-content-width",
    "app-sidebar-width",
    "heading-text-decoration",
  ];

  allPossibleVars.forEach((varName) => {
    root.style.removeProperty(`--${varName}`);
  });

  const inlineStyles = root.style;
  for (let i = inlineStyles.length - 1; i >= 0; i -= 1) {
    const property = inlineStyles.item(i);
    if (!property) continue;
    if (property.startsWith("--")) {
      root.style.removeProperty(property);
    }
  }
};

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
  const byPage = settings.layoutDensityByPage;
  const pageParts: string[] = [];
  if (byPage) {
    for (const [pageId, tokens] of Object.entries(byPage)) {
      if (!tokens || Object.keys(tokens).length === 0) continue;
      const pageCss = buildLayoutDensityOverrideCss(
        { base: undefined, viewports: { xl: tokens } },
        { selector: `[data-app-page="${pageId}"]` },
      );
      if (pageCss) pageParts.push(pageCss);
    }
  }
  styleTag.textContent = [densityCss, ...pageParts].filter(Boolean).join("\n");
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
  layoutDensity: cloneResponsiveLayoutDensity(settings.layoutDensity),
});

const areThemeSettingsEqual = (a: ThemeSettings, b: ThemeSettings): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

/** Single client applicator — preset vars + density. Prefer this over any legacy HSL path. */
export const applyThemeSettings = (
  settings: ThemeSettings,
  isDarkMode: boolean,
) => {
  resetThemeVars();
  const root = document.documentElement;
  const body = document.body;

  if (settings.importedTheme) {
    const themeVars = isDarkMode
      ? settings.importedTheme.dark
      : settings.importedTheme.light;
    Object.entries(themeVars).forEach(([variable, value]) => {
      root.style.setProperty(`--${variable}`, value);
    });
  } else if (settings.selectedTweakcnTheme) {
    const preset = tweakcnThemes.find(
      (theme) => theme.value === settings.selectedTweakcnTheme,
    )?.preset;
    if (preset) {
      const styles = isDarkMode ? preset.styles.dark : preset.styles.light;
      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  } else if (settings.selectedBrandTheme) {
    const preset = brandThemes.find(
      (theme) => theme.value === settings.selectedBrandTheme,
    )?.preset;
    if (preset) {
      const styles = isDarkMode ? preset.styles.dark : preset.styles.light;
      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  } else if (settings.selectedSidebarTheme) {
    const preset = sidebarThemes.find(
      (theme) => theme.value === settings.selectedSidebarTheme,
    )?.preset;
    if (preset) {
      const styles = isDarkMode ? preset.styles.dark : preset.styles.light;
      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  } else if (settings.selectedTheme) {
    const preset = colorThemes.find(
      (theme) => theme.value === settings.selectedTheme,
    )?.preset;
    if (preset) {
      const styles = isDarkMode ? preset.styles.dark : preset.styles.light;
      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }

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
