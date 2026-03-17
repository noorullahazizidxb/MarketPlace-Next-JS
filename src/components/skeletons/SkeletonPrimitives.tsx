"use client";
import React from "react";
import { cn } from "@/lib/cn";

export const shimmer =
  "animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.18),rgba(255,255,255,0.06))] bg-[length:200%_100%]";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-[hsl(var(--foreground))/0.06]",
        shimmer,
        className
      )}
    />
  );
}

export function Block({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
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
