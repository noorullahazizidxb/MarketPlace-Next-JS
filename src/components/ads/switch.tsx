"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface SwitchProps
  extends Omit<React.HTMLAttributes<HTMLLabelElement>, "onChange"> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "md" | "sm";
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  className,
  size = "md",
  id,
  ...rest
}) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "relative inline-flex items-center cursor-pointer select-none",
        className
      )}
      {...rest}
    >
      <input
        id={inputId}
        type="checkbox"
        aria-label="Toggle"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      <span
        className={cn(
          "block rounded-full transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50",
          checked ? "bg-[hsl(var(--primary))/0.8]" : "bg-white/15",
          size === "md" ? "h-6 w-11" : "h-5 w-9"
        )}
      >
        <span
          className={cn(
            "block rounded-full bg-white shadow transition-transform translate-x-0",
            size === "md" ? "h-5 w-5" : "h-4 w-4",
            checked
              ? size === "md"
                ? "translate-x-5"
                : "translate-x-4"
              : "translate-x-0"
          )}
        />
      </span>
    </label>
  );
};
