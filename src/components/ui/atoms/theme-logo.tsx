import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export const MARKETPLACE_LOGO = {
  light: "/brand/marketplace-logo-on-light.svg",
  dark: "/brand/marketplace-logo-on-dark.svg",
  lightPng: "/brand/marketplace-logo-on-light.png",
  darkPng: "/brand/marketplace-logo-on-dark.png",
} as const;

export const MARKETPLACE_MARK = {
  light: "/brand/marketplace-niche-icon-on-light.svg",
  dark: "/brand/marketplace-niche-icon-on-dark.svg",
} as const;

type ThemeLogoProps = {
  variant?: "logo" | "mark";
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  style?: CSSProperties;
};

const DIMENSIONS = {
  logo: {
    light: { width: 1392, height: 420 },
    dark: { width: 2147, height: 420 },
  },
  mark: {
    light: { width: 512, height: 512 },
    dark: { width: 512, height: 512 },
  },
} as const;

/**
 * Light mode uses the blue C lockup (logo-on-light).
 * Dark mode uses the orange D lockup (logo-on-dark).
 * The html.dark / data-theme switch wins; prefers-color-scheme applies
 * only before the theme class is set.
 */
export function ThemeLogo({
  variant = "logo",
  alt = "DevMinds Marketplace",
  className,
  imageClassName,
  priority = false,
  style,
}: ThemeLogoProps) {
  const sources = variant === "mark" ? MARKETPLACE_MARK : MARKETPLACE_LOGO;
  const size = DIMENSIONS[variant];
  const imageClass = cn("theme-logo-img", imageClassName);

  return (
    <span className={cn("theme-logo", className)} style={style}>
      <img
        src={sources.light}
        alt={alt}
        width={size.light.width}
        height={size.light.height}
        className={cn(imageClass, "theme-logo-light")}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
      <img
        src={sources.dark}
        alt={alt}
        width={size.dark.width}
        height={size.dark.height}
        className={cn(imageClass, "theme-logo-dark")}
        decoding="async"
      />
    </span>
  );
}
