import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "../../lib/cn"

function Switch({
  className,
  dir,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const resolvedDir =
    dir ??
    (typeof document !== "undefined"
      ? (document.documentElement.dir as "ltr" | "rtl")
      : undefined)

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      dir={resolvedDir}
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "data-[state=checked]:border-primary data-[state=unchecked]:border-border",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block app-icon-sm rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]",
          "bg-background"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
