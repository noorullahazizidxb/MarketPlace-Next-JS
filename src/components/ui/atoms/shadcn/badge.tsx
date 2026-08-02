import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Badge — atom-level status pill.
 *
 * Design decisions aligned with globals.css:
 *  - Font size / height: `--text-badge` and `--badge-h` from globals.css
 *  - Shape:     rounded-full (pill) by default — consistent with all status
 *               badges in the contracts / table UIs
 *  - All colours reference semantic tokens so they flip in dark mode
 */
const badgeVariants = cva(
  [
    // Layout
    "inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0",
    // Shape — pill by default, square optional via className
    "rounded-squircle border",
    // Spacing — pairs with the clamp height below
    "px-[var(--ctrl-px,0.625rem)]",
    "h-[var(--badge-h,1.25rem)]",
    // Icon handling
    "[&>svg]:app-icon-xs gap-1.5 [&>svg]:pointer-events-none",
    // Accessibility / interaction
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    // Transition
    "transition-[color,box-shadow] overflow-hidden",
    // Font handled via tokens
    "app-text-badge uppercase tracking-wider",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        brand:
          "border-transparent brand-gradient hover-gradient brand-glow text-brand-foreground [a&]:hover:text-brand-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground border-border/60 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // New: soft muted variant used for neutral tags
        muted:
          "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
        // New: success variant aligned with emerald tokens used throughout
        success:
          "border-transparent bg-[var(--success)] text-[var(--success-foreground)] [a&]:hover:opacity-90",
        // New: warning variant aligned with amber tokens
        warning:
          "border-transparent bg-[var(--warning)] text-[var(--warning-foreground)] [a&]:hover:opacity-90",
        info:
          "border-transparent bg-[var(--info)] text-[var(--info-foreground)] [a&]:hover:opacity-90",
        price:
          "border-transparent bg-[var(--price-highlight-bg)] text-[var(--price)] [a&]:hover:opacity-90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      style={style}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
