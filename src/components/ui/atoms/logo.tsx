import type { CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";
import { ThemeLogo } from "./theme-logo";

interface LogoProps extends Omit<ImageProps, "src" | "width" | "height" | "alt"> {
  size?: number;
  src?: ImageProps["src"];
  alt?: string;
  style?: CSSProperties;
}

export function Logo({
  size = 24,
  src,
  className,
  alt = "DevMinds Marketplace",
  style,
  priority,
}: LogoProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className={`w-auto object-contain ${className ?? ""}`}
        style={{ height: size, width: "auto", ...style }}
      />
    );
  }

  return (
    <ThemeLogo
      alt={alt}
      priority={Boolean(priority)}
      className={className}
      style={{ height: size, width: "auto", ...style }}
    />
  );
}
