"use client";
import React from "react";
import { cn } from "@/lib/cn";

export const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[hsl(var(--foreground))]/10 before:to-transparent border border-[hsl(var(--border))]/50";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[hsl(var(--foreground))]/5 backdrop-blur-xl shadow-inner",
        shimmer,
        className
      )}
    />
  );
}

export function Block({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3 w-full",
            i === 0 && "h-4 w-2/3",
            i === lines - 1 && "w-1/3"
          )}
        />
      ))}
    </div>
  );
}
