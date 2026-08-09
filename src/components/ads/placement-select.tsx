"use client";
import * as React from "react";
import { SelectField } from "@/components/ui/atoms/shadcn/SelectField";
import { cn } from "@/lib/cn";

const AD_PLACEMENTS = [
  "HOME_PAGE_1ST",
  "HOME_PAGE_2ND",
  "HOME_PAGE_3RD",
  "DETAIL_PAGE_1ST",
  "DETAIL_PAGE_2ND",
  "DETAIL_PAGE_SIDEBAR",
] as const;

type AdPlacement = (typeof AD_PLACEMENTS)[number];

const PLACEMENT_OPTIONS = AD_PLACEMENTS.map((p) => ({
  value: p,
  label: p.replace(/_/g, " "),
}));

interface PlacementSelectProps {
  value: AdPlacement | string;
  onChange: (value: AdPlacement) => void;
  size?: "sm" | "md";
}

export const PlacementSelect: React.FC<PlacementSelectProps> = ({
  value,
  onChange,
  size = "md",
}) => {
  return (
    <SelectField
      label="Placement"
      aria-label="Ad Placement"
      value={value}
      onChange={(v) => onChange(v as AdPlacement)}
      options={PLACEMENT_OPTIONS}
      placeholder="Select placement"
      className={cn(
        "rounded-2xl bg-input/20 app-text-caption tracking-tight",
        size === "sm" ? "h-8 min-h-8 app-text-caption" : "h-10 min-h-10 app-text-body",
      )}
    />
  );
};
