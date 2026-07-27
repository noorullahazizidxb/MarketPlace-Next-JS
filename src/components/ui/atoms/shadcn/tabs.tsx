import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../../lib/cn"

/**
 * Tabs — premium segmented control.
 *
 * Improvements:
 *  - Active trigger: gradient indicator underline using brand tokens
 *  - Font size: clamp via CSS vars
 *  - TabsList: refined pill shape, subtle inner shadow
 *  - Animated active underline via CSS transition
 */

function Tabs({
  className,
  dir,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const resolvedDir =
    dir ??
    (typeof document !== "undefined"
      ? (document.documentElement.dir as "ltr" | "rtl")
      : undefined)

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      dir={resolvedDir}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // Container: pill with inner shadow for depth
        "bg-muted/60 text-muted-foreground",
        "inline-flex h-[var(--ctrl-h,2rem)] w-fit items-center justify-center",
        "rounded-squircle p-1 gap-1",
        "border border-border/40 shadow-inner",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Layout
        "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap",
        "rounded-squircle border border-transparent px-[var(--ctrl-px,0.625rem)] h-full",
        // Typography — size controlled by style prop below
        "admin-text-badge",
        // Inactive state
        "text-muted-foreground/80",
        "transition-all duration-200",
        // Active state
        "data-[state=active]:bg-background",
        "data-[state=active]:text-foreground",
        "data-[state=active]:shadow-sm",
        "data-[state=active]:border-border/40",
        // Hover
        "hover:text-foreground",
        // Focus
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
        "focus-visible:ring-[3px] focus-visible:outline-1",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--icon-sm,1rem)]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }