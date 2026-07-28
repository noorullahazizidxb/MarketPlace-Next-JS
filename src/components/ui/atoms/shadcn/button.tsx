import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Button — atom foundation.
 *
 * Improvements over the base:
 *  - Font size uses clamp() via CSS vars from globals.css
 *  - Height uses clamp() matching --action-btn-height token
 *  - Micro-interaction: active:scale-[0.97] on all variants
 *  - New `brand` variant using the violet→indigo gradient token
 *  - Improved focus ring consistency
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap app-text-label",
    "rounded-squircle",
    "transition-all duration-200",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:app-icon-xs shrink-0 [&_svg]:shrink-0",
    "outline-none",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary cursor-pointer text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive cursor-pointer text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border/60 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary cursor-pointer text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "cursor-pointer hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        /** Brand: violet→indigo gradient — matches --brand-gradient token from globals.css */
        brand:
          "border-0 cursor-pointer brand-gradient hover-gradient brand-glow text-brand-foreground shadow-md",
        /** Soft: lightly tinted surface for secondary emphasis */
        soft: "border border-border/40 cursor-pointer bg-muted/60 text-foreground hover:bg-muted shadow-sm",
      },
      size: {
        default:
          "min-h-[var(--ctrl-h-sm)] h-auto px-[var(--ctrl-px)] py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:app-icon-sm",
        sm: "min-h-[var(--ctrl-h-sm)] h-auto gap-1.5 px-3 py-1.5 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:app-icon-xs",
        lg: "min-h-[var(--ctrl-h)] h-auto px-6 py-2.5 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:app-icon-sm",
        icon: "size-[var(--ctrl-h-sm)] min-h-[var(--ctrl-h-sm)] min-w-[var(--ctrl-h-sm)] p-0 [&_svg:not([class*='size-'])]:size-full",
        xs: "min-h-7 h-auto gap-1 px-2.5 py-1 has-[>svg]:px-2 [&_svg:not([class*='size-'])]:app-icon-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      {loading ? (
        <>
          {/* Loader size follows button size tokens so it remains consistent with text/icon scale */}
          <Loader2
            className={cn(
              "animate-spin",
              size === "xs" || size === "sm"
                ? "app-icon-xs"
                : size === "icon"
                  ? "size-full"
                  : "app-icon-sm",
            )}
          />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
