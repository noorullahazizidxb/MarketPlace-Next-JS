import * as React from "react"
import type {
  ChangeEvent,
  FocusEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from "react"
import { forwardRef } from "react"
import { cn } from "../../lib/cn"

/**
 * Textarea — plain backward-compatible element.
 *
 * Improvements:
 *  - rounded-xl to match the app-wide radius scale
 *  - border/ring use semantic tokens from globals.css
 *  - clamp font size via CSS var
 */
function Textarea({ className, style, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border/60 placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/30",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "dark:bg-input/30",
        "flex field-sizing-content min-h-[4rem] w-full",
        "rounded-squircle border bg-transparent",
        "px-[var(--ctrl-px)] py-3",
        "shadow-sm outline-none",
        "transition-[color,box-shadow] duration-200",
        "focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

// ── TextareaField (floating-label) ────────────────────────────────────────────

type BaseTextareaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "value"
> & {
  label: string
  error?: string | boolean
  helperText?: string
  icon?: ReactNode | null
}

type ControlledTextareaFieldProps = BaseTextareaFieldProps & {
  value: string
  onChange: (value: string) => void
}

type UncontrolledTextareaFieldProps = BaseTextareaFieldProps & {
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

type TextareaFieldProps =
  | ControlledTextareaFieldProps
  | UncontrolledTextareaFieldProps

function isControlledTextareaField(
  props: TextareaFieldProps,
): props is ControlledTextareaFieldProps {
  return "value" in props
}

/**
 * TextareaField — floating-label textarea atom.
 *
 * Improvements aligned with TextInputField and globals.css:
 *  - Font size: clamp via --text-body token
 *  - Label: clamp via --text-label token
 *  - Border / focus ring: semantic tokens, matches TextInputField exactly
 *  - rounded-xl, consistent padding
 */
const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (props, ref) => {
    const {
      label, error, helperText, className, onChange, onFocus, onBlur,
      id, disabled, icon, required, ...rest
    } = props

    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    React.useImperativeHandle(ref, () => textareaRef.current!)

    const errorMessage = typeof error === "string" ? error : undefined
    const hasError = Boolean(error)
    const [hasDOMValue, setHasDOMValue] = React.useState(false)

    // Sync hasDOMValue with actual input value
    React.useEffect(() => {
      const checkValue = () => {
        const val = textareaRef.current?.value ?? ""
        if ((val.length > 0) !== hasDOMValue) {
          setHasDOMValue(val.length > 0)
        }
      }
      checkValue()
      const timer = setTimeout(checkValue, 50)
      return () => clearTimeout(timer)
    }, [props, hasDOMValue])

    const hasValue = isControlledTextareaField(props)
      ? Boolean(props.value)
      : hasDOMValue
    const hasIcon = icon !== undefined && icon !== null

    const inputId =
      id || `textareafield-${label.toLowerCase().replace(/\s+/g, "-")}`

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setHasDOMValue(e.target.value.length > 0)
      if (!onChange) return
      if (isControlledTextareaField(props)) {
        ; (onChange as (value: string) => void)(e.target.value)
      } else {
        ; (onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void)(e)
      }
    }

    return (
      <div className="group relative w-full">
        {/* Optional icon — top-left, aligned to first line */}
        {hasIcon && (
          <span
            className={cn(
              "pointer-events-none absolute start-3.5 top-5 -translate-y-1/2 transition-colors duration-200",
              "text-muted-foreground/60 group-focus-within:text-foreground",
              hasError && "text-destructive",
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <textarea
          ref={textareaRef}
          id={inputId}
          data-slot="textarea"
          disabled={disabled}
          className={cn(
            "peer w-full border bg-background outline-none",
            "transition-all duration-200",
            // Vertical: top padding holds floating label
            "pt-7 pb-3 min-h-[6rem] resize-y",
            // Horizontal
            hasIcon ? "ps-10 pe-4" : "px-4",
            // Border / focus
            hasError
              ? "border-destructive/40 focus:border-destructive focus:ring-1 focus:ring-destructive/30"
              : "border-border/60 focus:border-ring focus:ring-1 focus:ring-ring/30",
            disabled && "cursor-not-allowed opacity-50",
            "[field-sizing:content]",
            className,
          )}
          // Single-space placeholder required for peer-[:not(:placeholder-shown)] trick
          placeholder=" "
          onChange={handleChange}
          onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={
            errorMessage
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...rest}
        />

        {/* Floating label */}
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute rounded px-1 transition-all duration-200 bg-transparent",
            hasIcon ? "start-10" : "start-4",
            // Default: sits inside the top padding area (acts as placeholder)
            "top-0 translate-y-[14px] text-muted-foreground",
            // Focused → float up + shrink
            "peer-focus:translate-y-[6px] peer-focus:admin-text-heading-sm peer-focus:text-foreground/70",
            // Filled → stay floated
            "peer-[:not(:placeholder-shown)]:translate-y-[6px] peer-[:not(:placeholder-shown)]:text-foreground/70",
            // Controlled with value → always floated
            hasValue && "translate-y-[6px] text-foreground/70",
            hasError && "text-destructive peer-focus:text-destructive",
          )}
        >
          <span className="inline-flex items-center gap-1">
            <span>{label}</span>
            {required && (
              <span className="text-destructive" aria-hidden>
                *
              </span>
            )}
          </span>
        </label>

        {errorMessage && (
          <p
            id={`${inputId}-error`}
            className="mt-1 ps-4 text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 ps-4 text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

TextareaField.displayName = "TextareaField"

export { Textarea, TextareaField }