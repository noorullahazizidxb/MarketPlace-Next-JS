"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (val: boolean) => void;
  size?: "sm" | "md";
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  size = "md",
  className,
  ...rest
}) => {
  const buttonClassName = cn(
    "relative inline-flex items-center transition-colors rounded-full border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:ring-offset-1",
    size === "sm" ? "h-5 w-9" : "h-6 w-11",
    checked ? "bg-[hsl(var(--accent))]" : "bg-[hsl(var(--muted))/0.5]",
    className
  );

  const spanClassName = cn(
    "absolute bg-white rounded-full shadow transition-transform duration-300 ease-out",
    size === "sm" ? "size-4 translate-x-0.5" : "size-5 translate-x-1",
    checked &&
      (size === "sm" ? "translate-x-[1.1rem]" : "translate-x-[1.35rem]")
  );

  const buttonProps = {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    onClick: () => onCheckedChange?.(!checked),
    className: buttonClassName,
    ...rest,
  } as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return React.createElement(
    "button",
    buttonProps,
    React.createElement("span", { className: spanClassName })
  );
};
