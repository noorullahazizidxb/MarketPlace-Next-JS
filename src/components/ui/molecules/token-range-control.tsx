"use client";

import { RemRangeSlider } from "../atoms/shadcn/rem-range-slider";
import { cn } from "../lib/cn";

export type TokenRangeControlProps = {
  label: string;
  valueRem: number;
  onChangeRem: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  /** Unit suffix shown next to value. Pass empty string for unitless (font-weight). Defaults to "rem". */
  unit?: string;
};

export function TokenRangeControl({
  label,
  valueRem,
  onChangeRem,
  min = 0.55,
  max = 1.15,
  step = 0.005,
  description,
  icon,
  className,
  unit = "rem",
}: TokenRangeControlProps) {
  return (
    <RemRangeSlider
      label={label}
      value={valueRem}
      onChange={onChangeRem}
      min={min}
      max={max}
      step={step}
      description={description}
      icon={icon}
      className={cn(className)}
      unit={unit}
    />
  );
}
