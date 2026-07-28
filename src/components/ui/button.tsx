"use client";

import * as React from "react";
import {
  Button as ShadcnButton,
  buttonVariants,
} from "@/components/ui/atoms/shadcn/button";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type ShadcnVariant = NonNullable<
  React.ComponentProps<typeof ShadcnButton>["variant"]
>;
type ShadcnSize = NonNullable<
  React.ComponentProps<typeof ShadcnButton>["size"]
>;

type ButtonProps = Omit<
  React.ComponentProps<typeof ShadcnButton>,
  "variant" | "size"
> & {
  LeftIcon?: IconType;
  RightIcon?: IconType;
  variant?: "primary" | "secondary" | "ghost" | "accent" | ShadcnVariant;
  size?: "sm" | "md" | "lg" | ShadcnSize;
  loading?: boolean;
};

const legacyVariantMap = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  accent: "brand",
} as const satisfies Record<string, ShadcnVariant>;

const legacySizeMap = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const satisfies Record<string, ShadcnSize>;

function mapVariant(variant: ButtonProps["variant"]): ShadcnVariant {
  if (!variant) return "default";
  if (variant in legacyVariantMap) {
    return legacyVariantMap[variant as keyof typeof legacyVariantMap];
  }
  return variant as ShadcnVariant;
}

function mapSize(size: ButtonProps["size"]): ShadcnSize {
  if (!size) return "default";
  if (size in legacySizeMap) {
    return legacySizeMap[size as keyof typeof legacySizeMap];
  }
  return size as ShadcnSize;
}

export function Button({
  className,
  LeftIcon,
  RightIcon,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  // Radix Slot requires a single React element child. Icon/loader siblings
  // turn `children` into an array and throw "Slot failed to slot onto its children".
  if (asChild) {
    return (
      <ShadcnButton
        variant={mapVariant(variant)}
        size={mapSize(size)}
        asChild
        disabled={disabled || loading}
        className={cn("[border-radius:var(--squircle-radius)]", className)}
        {...props}
      >
        {children}
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton
      variant={mapVariant(variant)}
      size={mapSize(size)}
      loading={loading}
      disabled={disabled || loading}
      className={cn("[border-radius:var(--squircle-radius)]", className)}
      {...props}
    >
      {loading ? (
        <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
      ) : LeftIcon ? (
        <LeftIcon className="size-4" />
      ) : null}
      {children}
      {!loading && RightIcon ? <RightIcon className="size-4" /> : null}
    </ShadcnButton>
  );
}

export { buttonVariants };
export type { ButtonProps };
