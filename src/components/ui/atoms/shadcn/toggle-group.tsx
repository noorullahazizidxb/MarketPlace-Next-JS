"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"
import { toggleVariants } from "./toggle"

/**
 * ToggleGroup — segmented selection control.
 *
 * Improvements:
 *  - Rounded-xl container + items, matching the app's radius scale
 *  - Active item uses a subtle primary tint for clear selection state
 *  - Clamp font size applied uniformly
 *  - Border between items replaced with gap + rounded corners
 */

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
})

function ToggleGroup({
  className,
  variant,
  size,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center gap-0.5",
        "rounded-xl border border-border/50 bg-muted/40 p-0.5",
        "data-[variant=outline]:shadow-sm",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  style,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({ variant: context.variant || variant, size: context.size || size }),
        // Layout
        "min-w-0 flex-1 shrink-0 rounded-lg shadow-none",
        // Remove default border overrides from toggleVariants
        "border-0",
        // Active state — subtle brand tint
        "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
        // Hover
        "hover:bg-background/60 hover:text-foreground",
        // Focus
        "focus:z-10 focus-visible:z-10",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }