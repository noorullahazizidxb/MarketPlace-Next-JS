"use client";

import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { Logo } from "../logo";

interface BrandLogoProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> {
  src?: string | StaticImageData;
  alt?: string;
  size?: number;
}

export function BrandLogo({
  src,
  alt = "Brand logo",
  size = 24,
  className,
  ...props
}: BrandLogoProps) {
  // If no image source provided, fall back to the inline SVG Logo
  if (!src) {
    return <Logo size={size} className={className} {...(props as any)} />;
  }

  return (
    <div className={`leading-none ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        // allow callers to pass additional image props via `props` if needed
        {...(props as any)}
      />
    </div>
  );
}

export default BrandLogo;
