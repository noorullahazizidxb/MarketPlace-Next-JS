"use client";
import * as React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/atoms/shadcn/switch";
import { cn } from "@/lib/cn";

interface SwitchProps
  extends Omit<
    React.ComponentProps<typeof ShadcnSwitch>,
    "checked" | "onCheckedChange"
  > {
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
  return (
    <ShadcnSwitch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(size === "sm" && "h-4 w-7", className)}
      {...rest}
    />
  );
};
