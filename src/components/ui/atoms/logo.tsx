import * as React from "react";

const DEFAULT_LOGO_SRC = "/logo/logo.png";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  src?: string;
}

export function Logo({
  size = 24,
  src = DEFAULT_LOGO_SRC,
  className,
  alt = "Dev Minds",
  style,
  ...props
}: LogoProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-auto object-contain ${className ?? ""}`}
      style={{ height: size, width: "auto", ...style }}
      {...props}
    />
  );
}
