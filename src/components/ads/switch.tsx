"use client";
import * as React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/atoms/shadcn/switch";
import { cn } from "@/lib/cn";

interface SwitchProps
  extends Omit<React.ComponentProps<typeof ShadcnSwitch>, "checked" | "onCheckedChange"> {
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
  return (
    <ShadcnSwitch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(size === "sm" && "h-4 w-7", className)}
      {...rest}
    />
  );
};
