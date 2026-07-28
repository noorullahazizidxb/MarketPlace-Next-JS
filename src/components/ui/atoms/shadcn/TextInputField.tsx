"use client";

import {
  type CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  ChangeEvent,
  FocusEvent,
  useState,
  type ReactElement,
  type RefAttributes,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { cn } from "../../lib/cn";

/**
 * TextInputField — floating-label input atom.
 * `label` is the visual placeholder (floats on focus/value).
 * Do not pass a user-facing `placeholder`; a space sentinel is locked in.
 */

type BaseTextInputFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "placeholder"
> & {
  label: string;
  error?: string | boolean;
  helperText?: string;
  icon?: ReactNode | null;
  suffix?: ReactNode | null;
  /** Decorative classes for the bordered shell (not the inner input). */
  className?: string;
  /** Optional classes for the inner input only. */
  inputClassName?: string;
};

type ControlledProps = BaseTextInputFieldProps & {
  value: string | number;
  onChange: (value: string) => void;
};

type UncontrolledProps = BaseTextInputFieldProps & {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

type TextInputFieldProps = ControlledProps | UncontrolledProps;

type TextInputFieldComponent = {
  (props: ControlledProps & RefAttributes<HTMLInputElement>): ReactElement | null;
  (props: UncontrolledProps & RefAttributes<HTMLInputElement>): ReactElement | null;
  displayName?: string;
};

function isControlled(props: TextInputFieldProps): props is ControlledProps {
  return "value" in props;
}

export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  (props, ref) => {
    const {
      label,
      error,
      helperText,
      className,
      inputClassName,
      onChange,
      onFocus,
      onBlur,
      id,
      disabled,
      icon,
      suffix,
      required,
      ...rest
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const [focused, setFocused] = useState(false);
    const [hasDOMValue, setHasDOMValue] = useState(false);

    useEffect(() => {
      const checkValue = () => {
        const val = inputRef.current?.value ?? "";
        if (val.length > 0 !== hasDOMValue) {
          setHasDOMValue(val.length > 0);
        }
      };

      checkValue();
      const timer = setTimeout(checkValue, 50);
      return () => clearTimeout(timer);
    }, [props, hasDOMValue]);

    const errorMessage = typeof error === "string" ? error : undefined;
    const hasError = Boolean(error);

    const hasValue = isControlled(props)
      ? props.value?.toString().trim().length > 0
      : hasDOMValue;

    const isActive = focused || hasValue;
    const hasIcon = icon !== undefined && icon !== null;

    const inputId =
      id || `TextInputField-${label.toLowerCase().replace(/\s+/g, "-")}`;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setHasDOMValue(e.target.value.trim().length > 0);

      if (!onChange) return;
      if (isControlled(props)) {
        (onChange as ControlledProps["onChange"])(e.target.value);
      } else {
        (onChange as UncontrolledProps["onChange"])?.(e);
      }
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="group w-full">
        <div
          data-control-shell
          className={cn(
            "relative flex w-full flex-row items-center gap-1.5 overflow-hidden rounded-squircle border bg-background",
            "px-[var(--ctrl-px)]",
            "transition-[border-color,box-shadow] duration-200",
            hasError
              ? "border-destructive/40 group-focus-within:border-destructive group-focus-within:ring-1 group-focus-within:ring-destructive/30"
              : "border-border/60 group-focus-within:border-ring group-focus-within:ring-1 group-focus-within:ring-ring/30",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          {hasIcon && (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center text-muted-foreground/60 transition-colors duration-200",
                "group-focus-within:text-foreground",
                "[&_svg]:app-icon-sm",
                hasError && "text-destructive",
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <div className="relative min-h-[var(--ctrl-h)] min-w-0 flex-1 self-stretch">
            <input
              ref={inputRef}
              id={inputId}
              data-slot="input"
              disabled={disabled}
              className={cn(
                "peer h-full w-full border-0 bg-transparent outline-none",
                "text-foreground caret-primary",
                "transition-[padding] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                rest.type === "number" &&
                  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                disabled && "cursor-not-allowed",
                inputClassName,
              )}
              style={
                {
                  fontSize: "var(--text-body)",
                  lineHeight: 1.25,
                  paddingTop: isActive
                    ? "var(--text-input-padding-block-start)"
                    : "var(--text-input-padding-block-start-rest)",
                  paddingBottom: "var(--text-input-padding-block-end)",
                  paddingInlineStart: 0,
                  paddingInlineEnd: 0,
                  transition: "padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                } as CSSProperties
              }
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={hasError ? "true" : undefined}
              aria-describedby={
                errorMessage
                  ? `${inputId}-error`
                  : helperText
                    ? `${inputId}-helper`
                    : undefined
              }
              {...rest}
              placeholder=" "
            />

            <label
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute leading-none transition-all duration-200",
                "start-0 top-1/2 -translate-y-1/2 app-text-body text-muted-foreground",
                "peer-focus:top-[var(--text-input-label-float-y)] peer-focus:translate-y-0 peer-focus:app-text-label peer-focus:text-foreground/70",
                "peer-[:not(:placeholder-shown)]:top-[var(--text-input-label-float-y)] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:app-text-label peer-[:not(:placeholder-shown)]:text-foreground/70",
                isActive &&
                  "top-[var(--text-input-label-float-y)] translate-y-0 app-text-label text-foreground/70",
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
          </div>

          {suffix && (
            <div
              className={cn(
                "flex shrink-0 items-center justify-center text-muted-foreground transition-colors duration-200",
                "group-focus-within:text-foreground",
              )}
            >
              {suffix}
            </div>
          )}
        </div>

        {errorMessage && (
          <p
            id={`${inputId}-error`}
            className="mt-1 ps-[var(--text-input-padding-inline)] app-text-label text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 ps-[var(--text-input-padding-inline)] app-text-label text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
) as TextInputFieldComponent;

TextInputField.displayName = "TextInputField";
