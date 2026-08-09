"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ObjectUrlImageProps = {
  file: Blob;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ObjectUrlImage({
  file,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: ObjectUrlImageProps) {
  const [source, setSource] = useState<string>();

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setSource(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!source) {
    return <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-muted" />;
  }

  return (
    <Image
      src={source}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className={className}
    />
  );
}
