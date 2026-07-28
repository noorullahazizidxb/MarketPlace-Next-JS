import React from "react";
import { cn } from "@/lib/cn";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--foreground)]/10 dark:bg-[var(--foreground)]/15",
        className
      )}
    />
  );
}
