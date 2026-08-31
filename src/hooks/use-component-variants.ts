"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchUiContextState,
  patchUiContextState,
} from "@/lib/theme/ui-context/context-store";
import type { ComponentVariantSettings } from "@/lib/theme/types";

const DEFAULT_VARIANTS: ComponentVariantSettings = {
  listingCard: "grid",
  navbar: "standard",
  footer: "standard",
  sidebar: "default",
  blogCard: "card",
};

/**
 * Lightweight hook to read and update per-component visual variants.
 * Syncs with the persistent ui-context store via /api/ui-context.
 */
export function useComponentVariants() {
  const [variants, setVariants] =
    useState<ComponentVariantSettings>(DEFAULT_VARIANTS);

  useEffect(() => {
    fetchUiContextState().then((ctx) => {
      if (ctx.componentVariants) {
        setVariants({ ...DEFAULT_VARIANTS, ...ctx.componentVariants });
      }
    });
  }, []);

  const updateVariant = useCallback(
    async <K extends keyof ComponentVariantSettings>(
      key: K,
      value: ComponentVariantSettings[K],
    ) => {
      const next = { ...variants, [key]: value };
      setVariants(next);
      await patchUiContextState({ componentVariants: next });
    },
    [variants],
  );

  const resetVariants = useCallback(async () => {
    setVariants(DEFAULT_VARIANTS);
    await patchUiContextState({ componentVariants: DEFAULT_VARIANTS });
  }, []);

  return { variants, updateVariant, resetVariants };
}
