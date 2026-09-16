/** Shared listing marketplace grid — keep CSS + JS column math aligned. */

/**
 * Tailwind grid: 1 → sm:2 → md:4 → lg+:5.
 * Cap at 5 on xl/2xl — 6-col left a dead track on typical laptop widths
 * (and at 2xl with a ~90rem content max the sixth slot looked empty).
 */
export const LISTING_GRID_CLASS =
  "grid grid-cols-1 items-stretch gap-[var(--space-gap)] sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 app-density-grid-gap";

/**
 * Column count for ad row breaks / page size.
 * Mirrors LISTING_GRID_CLASS breakpoints.
 */
export function listingGridNumCols(viewportWidth: number) {
  if (viewportWidth < 640) return 1;
  if (viewportWidth < 768) return 2;
  if (viewportWidth < 1024) return 4; // md
  return 5; // lg and up
}
