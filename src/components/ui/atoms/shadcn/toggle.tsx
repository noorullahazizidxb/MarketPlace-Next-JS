import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/cn"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md admin-text-body hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:admin-icon-sm [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        brand:
          "border border-primary/30 bg-transparent text-foreground hover:bg-primary/10 data-[state=on]:brand-gradient data-[state=on]:hover-gradient data-[state=on]:brand-glow data-[state=on]:text-brand-foreground",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "min-h-[var(--ctrl-h)] px-2 min-w-[var(--ctrl-h)]",
        sm: "min-h-[var(--ctrl-h-sm)] px-1.5 min-w-[var(--ctrl-h-sm)]",
        lg: "min-h-[var(--ctrl-h)] px-2.5 min-w-[var(--ctrl-h)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
