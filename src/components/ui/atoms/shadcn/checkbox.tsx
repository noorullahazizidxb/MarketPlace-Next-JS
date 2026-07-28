"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "../../lib/cn"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive app-icon-sm shrink-0 rounded-squircle border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="app-icon-xs" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

type CheckboxFieldProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label: React.ReactNode
  requiredMark?: boolean
  helperText?: string
  error?: string | boolean
}

function CheckboxField({
  label,
  requiredMark,
  helperText,
  error,
  id,
  className,
  ...props
}: CheckboxFieldProps) {
  const generatedId = React.useId()
  const checkboxId = id ?? `checkbox-${generatedId}`
  const errorMessage = typeof error === "string" ? error : undefined
  const hasError = Boolean(error)

  return (
    <div className="space-y-1.5">
      <label htmlFor={checkboxId} className="flex items-start gap-2 cursor-pointer">
        <Checkbox
          id={checkboxId}
          aria-invalid={hasError ? "true" : undefined}
          className={className}
          {...props}
        />
        <span className="app-text-body text-foreground leading-5">
          <span className="inline-flex items-center gap-1">
            <span>{label}</span>
            {requiredMark && (
              <span className="text-destructive" aria-hidden>
                *
              </span>
            )}
          </span>
        </span>
      </label>
      {errorMessage ? (
        <p className="app-text-label text-destructive ps-6" role="alert">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="app-text-label text-muted-foreground ps-6">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export { Checkbox, CheckboxField }
