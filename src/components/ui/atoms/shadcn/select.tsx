import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "../../lib/cn"

function Select({
  dir,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const resolvedDir =
    dir ??
    (typeof document !== "undefined"
      ? (document.documentElement.dir as "ltr" | "rtl")
      : undefined)
  return <SelectPrimitive.Root data-slot="select" dir={resolvedDir} {...props} />
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  style,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default" }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // Layout
        "flex w-fit items-center justify-between gap-2 whitespace-nowrap text-start",
        // Shape
        "rounded-squircle border border-border/60 bg-transparent",
        // Spacing
        "px-3 py-2",
        // Colours
        "text-foreground shadow-sm",
        "data-[placeholder]:text-muted-foreground",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        // Sizing
        "data-[size=default]:min-h-[var(--ctrl-h)] data-[size=sm]:min-h-[var(--ctrl-h-sm)]",
        // Focus
        "outline-none transition-all duration-200",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // Error
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Dark
        "dark:bg-input/30 dark:hover:bg-input/50",
        // Hover
        "hover:border-border",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Value slot
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        // SVG
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:admin-icon-sm",
        "admin-text-action",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="admin-icon-sm opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          // Surface
          "bg-popover text-popover-foreground rounded-squircle border border-border/60 shadow-xl",
          // Sizing
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem]",
          "origin-(--radix-select-content-transform-origin)",
          "overflow-x-hidden overflow-y-auto",
          // Animations
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1.5",
            position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  style,
  requiredMark,
  error,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label> & {
  requiredMark?: boolean
  error?: boolean
}) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 admin-text-caption uppercase tracking-wide",
        error ? "text-destructive" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        <span>{props.children}</span>
        {requiredMark && (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        )}
      </span>
    </SelectPrimitive.Label>
  )
}

function SelectItem({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-lg",
        "py-1.5 pe-8 ps-2 text-start outline-hidden select-none",
        "transition-colors duration-150",
        "focus:bg-accent focus:text-accent-foreground",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:admin-icon-sm",
        "admin-text-action",
        className
      )}
      {...props}
    >
      <span className="absolute end-2 flex admin-icon-xs items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="admin-icon-xs text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border/60 pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1 text-muted-foreground", className)}
      {...props}
    >
      <ChevronUpIcon className="admin-icon-sm" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1 text-muted-foreground", className)}
      {...props}
    >
      <ChevronDownIcon className="admin-icon-sm" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
  SelectScrollDownButton, SelectScrollUpButton, SelectSeparator,
  SelectTrigger, SelectValue,
}