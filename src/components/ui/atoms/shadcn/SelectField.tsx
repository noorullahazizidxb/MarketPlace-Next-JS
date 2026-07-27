"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  label: string;
  error?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      error,
      options,
      placeholder = "Select...",
      className,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="relative">
        <select
          ref={ref}
          data-slot="input"
          className={cn(
            "w-full appearance-none cursor-pointer outline-none",
            "border bg-background",
            "dark:text-foreground transition-all duration-200",
            "min-h-[var(--ctrl-h)] px-[var(--ctrl-px)] pr-8",
            hasError
              ? "border-destructive/40 focus:border-destructive focus:ring-1 focus:ring-destructive/30"
              : "border-border/60 focus:border-ring focus:ring-1 focus:ring-ring/30",
            className,
          )}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          className={cn(
            "absolute left-4 -top-2.5 bg-background rounded px-1 admin-text-label",
            hasError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          <span className="inline-flex items-center gap-1">
            <span>{label}</span>
            {props.required && <span className="text-destructive">*</span>}
          </span>
        </label>
        {/* Chevron icon */}
        <svg
          className="absolute right-2.5 top-1/2 admin-icon-sm -translate-y-1/2 pointer-events-none text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {error && (
          <p
            className="mt-1 ps-[var(--text-input-padding-inline)] text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
