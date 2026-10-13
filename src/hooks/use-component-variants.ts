"use client";

import { useEffect } from "react";
import { useComponentVariantsStore } from "@/store/component-variants.store";
import type { ComponentVariantSettings } from "@/lib/theme/types";

/**
 * Shares component variant state across mounted components and browser tabs.
 */
export function useComponentVariants() {
  const variants = useComponentVariantsStore(
    (state) => state.previewVariants ?? state.variants,
  );
  const error = useComponentVariantsStore((state) => state.error);
  const initialize = useComponentVariantsStore((state) => state.initialize);
  const updateVariant = useComponentVariantsStore((state) => state.updateVariant);
  const resetVariants = useComponentVariantsStore((state) => state.resetVariants);

  useEffect(initialize, [initialize]);

  return { variants, error, updateVariant, resetVariants };
}
