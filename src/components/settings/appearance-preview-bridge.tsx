"use client";

import { useEffect } from "react";
import { useComponentVariantsStore } from "@/store/component-variants.store";
import type { ComponentVariantSettings } from "@/lib/theme/types";

const PREVIEW_UPDATE = "marketplace:appearance-preview:update";
const PREVIEW_READY = "marketplace:appearance-preview:ready";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function AppearancePreviewBridge() {
  const applyPreviewVariants = useComponentVariantsStore(
    (state) => state.applyPreviewVariants,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("appearance-preview") !== "1" ||
      window.parent === window
    ) {
      return;
    }

    let parentOrigin: string;
    try {
      parentOrigin = new URL(document.referrer).origin;
    } catch {
      return;
    }

    let appliedProperties = new Set<string>();
    let readyInterval: number | undefined;

    const onMessage = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.origin !== parentOrigin ||
        !isRecord(event.data) ||
        event.data.type !== PREVIEW_UPDATE
      ) {
        return;
      }

      if (readyInterval) {
        window.clearInterval(readyInterval);
        readyInterval = undefined;
      }

      const root = document.documentElement;
      const theme = event.data.theme;
      const dark = event.data.dark;
      if (typeof theme === "string" && theme.length <= 80) {
        root.dataset.theme = theme;
      }
      if (typeof dark === "boolean") {
        root.classList.toggle("dark", dark);
        root.classList.toggle("light", !dark);
      }
      root.dataset.appearancePreview = "true";

      const styles = isRecord(event.data.styles) ? event.data.styles : {};
      const nextProperties = new Set<string>();
      for (const [property, value] of Object.entries(styles)) {
        if (
          !/^--[a-zA-Z0-9-]+$/.test(property) ||
          typeof value !== "string" ||
          value.length > 100 ||
          /[;:{}]|url\s*\(/i.test(value)
        ) {
          continue;
        }

        root.style.setProperty(property, value);
        nextProperties.add(property);
      }
      for (const property of appliedProperties) {
        if (!nextProperties.has(property)) root.style.removeProperty(property);
      }
      appliedProperties = nextProperties;

      if (isRecord(event.data.variants)) {
        applyPreviewVariants(
          event.data.variants as Partial<ComponentVariantSettings>,
        );
      }
    };

    window.addEventListener("message", onMessage);
    const announceReady = () =>
      window.parent.postMessage({ type: PREVIEW_READY }, parentOrigin);
    announceReady();
    readyInterval = window.setInterval(announceReady, 200);

    return () => {
      if (readyInterval) window.clearInterval(readyInterval);
      window.removeEventListener("message", onMessage);
    };
  }, [applyPreviewVariants]);

  return null;
}
