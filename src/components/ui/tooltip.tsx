"use client";
import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Tooltip content — text or any React node */
  content: React.ReactNode;
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** Preferred side to display the tooltip bubble */
  side?: TooltipSide;
  /** Wrapper span className */
  className?: string;
  /** Tooltip bubble className for additional overrides */
  contentClassName?: string;
  /** Hover delay in ms before the tooltip appears (default 300) */
  delay?: number;
  /** Disable tooltip without removing the component */
  disabled?: boolean;
}

// ─── Position maps ────────────────────────────────────────────────────────────

const sideMap: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

/**
 * Universal Tooltip — background inherits from CSS `--card` / `--border` variables,
 * so it adapts to any theme automatically.
 *
 * @example
 *   <Tooltip content="Edit this item" side="right">
 *     <Button>Edit</Button>
 *   </Tooltip>
 */
export function Tooltip({
  content,
  children,
  side = "top",
  className,
  contentClassName,
  delay = 300,
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (disabled || !content) return;
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [disabled, delay, content]);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  return (
    <span
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cn(
            // Positioning
            "pointer-events-none absolute z-[300] max-w-[240px]",
            // Visual — inherits theme CSS variables
            "rounded-xl border border-[hsl(var(--border))]/70",
            "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]",
            "shadow-[0_8px_24px_-4px_rgba(0,0,0,0.25)] backdrop-blur-md",
            // Typography
            "px-3 py-1.5 text-[11px] font-medium leading-snug whitespace-normal",
            // Animation
            "animate-in fade-in-0 zoom-in-95 duration-100",
            sideMap[side],
            contentClassName
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
