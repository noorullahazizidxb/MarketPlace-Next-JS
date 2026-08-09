"use client";

import Image, { type ImageProps, type StaticImageData } from "next/image";
import { Logo } from "../logo";

interface BrandLogoProps extends Omit<ImageProps, "src" | "width" | "height" | "alt"> {
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
    return <Logo size={size} className={className} alt={alt} {...props} />;
  }

  return (
    <div className={`leading-none ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        {...props}
      />
    </div>
  );
}

export default BrandLogo;
