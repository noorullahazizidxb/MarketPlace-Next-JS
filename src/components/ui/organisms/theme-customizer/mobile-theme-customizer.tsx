"use client";

import { ThemeCustomizer } from "./index";
import type { ThemeCustomizerProps } from "./index";

/** Props for the dedicated mobile bottom-sheet customizer (same options as desktop). */
export type MobileThemeCustomizerProps = Omit<ThemeCustomizerProps, "layout">;

/**
 * Mobile-only presentation: forces the theme/layout customizer into a bottom sheet.
 * Prefer `<ThemeCustomizer layout="auto" />` when a single responsive entry is enough.
 */
export function MobileThemeCustomizer(props: MobileThemeCustomizerProps) {
  return <ThemeCustomizer {...props} layout="bottom" />;
}

/** @deprecated Alias for `MobileThemeCustomizer` — same component. */
export const MobileThemeCustomizerSheetContent = MobileThemeCustomizer;
