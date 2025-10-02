import React from "react";
import { cn } from "@/lib/cn";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[hsl(var(--foreground))]/10 dark:bg-[hsl(var(--foreground))]/15",
        className
      )}
    />
  );
}
