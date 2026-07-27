"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "../../lib/cn"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput>) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputContext = React.useContext(OTPInputContext)
  const slot = inputContext.slots[index] ?? {
    char: null,
    hasFakeCaret: false,
    isActive: false,
  }

  return (
    <div
      data-slot="input-otp-slot"
      className={cn(
        "relative flex min-h-[var(--ctrl-h)] min-w-[var(--ctrl-h)] items-center justify-center border-y border-r border-input admin-text-body admin-text-heading-sm shadow-xs transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        slot.isActive && "z-10 border-ring ring-2 ring-ring/30",
        className
      )}
      {...props}
    >
      {slot.char ?? ""}
      {slot.hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-pulse bg-foreground" />
        </div>
      ) : null}
    </div>
  )
}

function InputOTPSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("flex items-center justify-center px-1", className)}
      {...props}
    >
      {children ?? <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
