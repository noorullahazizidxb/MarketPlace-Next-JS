import * as React from "react";
import Image, { type ImageProps } from "next/image";

const DEFAULT_LOGO_SRC = "/brand/devminds-logo.png";

interface LogoProps extends Omit<ImageProps, "src" | "width" | "height" | "alt"> {
  size?: number;
  src?: ImageProps["src"];
  alt?: string;
}

export function Logo({
  size = 24,
  src = DEFAULT_LOGO_SRC,
  className,
  alt = "DevMinds",
  style,
  ...props
}: LogoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={`w-auto object-contain ${className ?? ""}`}
      style={{ height: size, width: "auto", ...style }}
      {...props}
    />
  );
}
