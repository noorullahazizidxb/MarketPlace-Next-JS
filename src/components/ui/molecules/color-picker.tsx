"use client";

import * as React from "react";
import { Hash } from "lucide-react";
import { Button } from "../atoms/shadcn/button";
import { Label } from "../atoms/shadcn/label";
import { TextInputField } from "../atoms/shadcn/TextInputField";

interface ColorPickerProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (cssVar: string, value: string) => void;
}

export function ColorPicker({
  label,
  cssVar,
  value,
  onChange,
}: ColorPickerProps) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalValue(newColor);
    onChange(cssVar, newColor);
  };

  const handleTextChange = (next: string) => {
    setLocalValue(next);
    onChange(cssVar, next);
  };

  const displayColor = React.useMemo(() => {
    if (localValue && localValue.startsWith("#")) {
      return localValue;
    }

    if (typeof document === "undefined") return "#000000";

    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();
    if (computed && computed.startsWith("#")) {
      return computed;
    }

    return "#000000";
  }, [localValue, cssVar]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`color-${cssVar}`} className="admin-text-label">
        {label}
      </Label>
      <div className="flex items-start gap-2">
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className="min-h-[var(--ctrl-h-sm)] w-8 p-0 overflow-hidden cursor-pointer"
            style={{ backgroundColor: displayColor }}
          >
            <input
              type="color"
              id={`color-${cssVar}`}
              value={displayColor}
              onChange={handleColorChange}
              className="absolute inset-0 size-full opacity-0 cursor-pointer"
            />
          </Button>
        </div>
        <div className="flex-1">
          <TextInputField
            label="Color value"
            icon={<Hash className="admin-icon-sm" aria-hidden />}
            value={localValue}
            onChange={handleTextChange}
          />
        </div>
      </div>
    </div>
  );
}
