"use client";
import * as React from "react";
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as AdPlacement)}
      className={cn(
        "rounded-2xl bg-input/20 border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 text-xs tracking-tight",
        size === "sm" ? "h-8 px-2" : "h-10 px-3 text-sm"
      )}
      aria-label="Ad Placement"
    >
      {AD_PLACEMENTS.map((p) => (
        <option key={p} value={p}>
          {p.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
};
