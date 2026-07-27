import { SUPPORTED_LOCALES } from "./navbar.constants";


export function getLocalizedHomeHref(pathname: string | null): string {
  if (!pathname) return "/";
  const [, firstSegment] = pathname.split("/");
  return firstSegment && SUPPORTED_LOCALES.has(firstSegment)
    ? `/${firstSegment}`
    : "/";
}

export function scrollToHash(hash: string) {
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Handles clicks on nav links.
 * - Hash links: prevents default, optionally defers scroll until after `onAfter` runs.
 * - Regular links: just calls `onAfter` (e.g. close a drawer).
 */
export function handleNavClick(
  e: React.MouseEvent,
  href: string,
  onAfter?: () => void,
) {
  if (!href.startsWith("#")) {
    onAfter?.();
    return;
  }
  e.preventDefault();
  if (onAfter) {
    onAfter();
    setTimeout(() => scrollToHash(href), 100);
  } else {
    scrollToHash(href);
  }
}