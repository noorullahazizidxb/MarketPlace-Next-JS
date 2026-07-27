"use client";

import * as React from "react";
import { defaultSidebarSettings } from "@repo/constants";
import {
  fetchUiContextState,
  patchUiContextState,
} from "../ui-context/context-store";
import { sidebarWidthValues } from "@repo/constants";

export interface SidebarConfig {
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  side: "left" | "right";
  width: keyof typeof sidebarWidthValues;
}

type SidebarUpdateOptions = {
  persist?: boolean;
};

export interface SidebarContextValue {
  config: SidebarConfig;
  updateConfig: (
    config: Partial<SidebarConfig>,
    options?: SidebarUpdateOptions,
  ) => void;
  saveConfig: (nextConfig?: SidebarConfig) => Promise<boolean>;
  resetConfigToSaved: () => void;
  hasUnsavedChanges: boolean;
  /** Current text direction. Set by the consuming layout via setDirection(). */
  direction: "ltr" | "rtl";
  setDirection: (direction: "ltr" | "rtl") => void;
  /**
   * The physical side the sidebar appears on, accounting for RTL direction.
   * In RTL mode the stored `config.side` ("left"→right, "right"→left) is flipped
   * so the sidebar always sits at the inline-start of the page.
   */
  effectiveSide: "left" | "right";
}

export const SidebarContext = React.createContext<SidebarContextValue | null>(
  null,
);

const areSidebarConfigsEqual = (
  a: SidebarConfig,
  b: SidebarConfig,
): boolean =>
  a.variant === b.variant &&
  a.collapsible === b.collapsible &&
  a.side === b.side &&
  a.width === b.width;

export function SidebarConfigProvider({
  children,
  initialConfig,
  initialDirection = "ltr",
}: {
  children: React.ReactNode;
  initialConfig?: SidebarConfig;
  initialDirection?: "ltr" | "rtl";
}) {
  const initialResolvedConfig = React.useMemo<SidebarConfig>(
    () => ({ ...(initialConfig ?? defaultSidebarSettings) }),
    [initialConfig],
  );
  const [config, setConfig] = React.useState<SidebarConfig>(
    initialResolvedConfig,
  );
  const persistedConfigRef = React.useRef<SidebarConfig>(initialResolvedConfig);
  const [direction, setDirection] = React.useState<"ltr" | "rtl">(
    initialDirection,
  );

  React.useEffect(() => {
    const widthValue =
      sidebarWidthValues[config.width] ?? sidebarWidthValues.comfortable;
    document.documentElement.style.setProperty(
      "--app-sidebar-width",
      widthValue,
    );
    document.documentElement.style.setProperty("--sidebar-width", widthValue);
  }, [config.width]);

  React.useEffect(() => {
    if (initialConfig) return;

    let isActive = true;
    fetchUiContextState()
      .then((state) => {
        if (!isActive) return;
        const nextConfig = { ...state.sidebar };
        persistedConfigRef.current = nextConfig;
        setConfig(nextConfig);
      })
      .catch(() => null);

    return () => {
      isActive = false;
    };
  }, [initialConfig]);

  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistSidebarConfig = React.useCallback(async (nextConfig: SidebarConfig) => {
    const response = await patchUiContextState({ sidebar: nextConfig });
    if (!response?.sidebar) return false;
    const savedConfig = { ...response.sidebar };
    persistedConfigRef.current = savedConfig;
    return true;
  }, []);

  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const updateConfig = React.useCallback(
    (newConfig: Partial<SidebarConfig>, options?: SidebarUpdateOptions) => {
      const shouldPersist = options?.persist ?? true;
      setConfig((prev) => {
        const nextConfig = { ...prev, ...newConfig };
        if (areSidebarConfigsEqual(prev, nextConfig)) {
          return prev;
        }

        if (!shouldPersist) return nextConfig;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          void persistSidebarConfig(nextConfig);
        }, 200);
        return nextConfig;
      });
    },
    [persistSidebarConfig],
  );

  const saveConfig = React.useCallback(async (nextConfig?: SidebarConfig) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const snapshot = nextConfig ? { ...nextConfig } : { ...config };

    setConfig((prev) => (areSidebarConfigsEqual(prev, snapshot) ? prev : snapshot));

    return persistSidebarConfig(snapshot);
  }, [config, persistSidebarConfig]);

  const resetConfigToSaved = React.useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setConfig({ ...persistedConfigRef.current });
  }, []);

  const hasUnsavedChanges = React.useMemo(
    () => !areSidebarConfigsEqual(config, persistedConfigRef.current),
    [config],
  );

  return (
    <SidebarContext.Provider
      value={{
        config,
        updateConfig,
        saveConfig,
        resetConfigToSaved,
        hasUnsavedChanges,
        direction,
        setDirection,
        effectiveSide:
          direction === "rtl"
            ? config.side === "left"
              ? "right"
              : "left"
            : config.side,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
