import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "../../lib/cn"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square admin-icon-sm shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 admin-icon-xs -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

type RadioOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type RadioGroupFieldProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  label: React.ReactNode
  options: RadioOption[]
  requiredMark?: boolean
  helperText?: string
  error?: string | boolean
}

function RadioGroupField({
  label,
  options,
  requiredMark,
  helperText,
  error,
  className,
  ...props
}: RadioGroupFieldProps) {
  const groupId = React.useId()
  const errorMessage = typeof error === "string" ? error : undefined
  const hasError = Boolean(error)

  return (
    <div className="space-y-2">
      <div className="admin-text-body text-foreground">
        <span className="inline-flex items-center gap-1">
          <span>{label}</span>
          {requiredMark && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </span>
      </div>
      <RadioGroup
        aria-invalid={hasError ? "true" : undefined}
        className={cn("gap-2", className)}
        {...props}
      >
        {options.map((option, index) => {
          const itemId = `${groupId}-${index}`
          return (
            <label
              key={`${option.value}-${index}`}
              htmlFor={itemId}
              className="flex items-center gap-2 cursor-pointer"
            >
              <RadioGroupItem
                id={itemId}
                value={option.value}
                disabled={option.disabled}
              />
              <span className="admin-text-body text-foreground">{option.label}</span>
            </label>
          )
        })}
      </RadioGroup>
      {errorMessage ? (
        <p className="text-destructive admin-text-label" role="alert">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-muted-foreground admin-text-label">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupField }
