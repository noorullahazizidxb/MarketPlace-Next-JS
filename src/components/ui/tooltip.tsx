"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
};

const arrowMap: Record<TooltipSide, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-[hsl(var(--card))] border-l-transparent border-r-transparent border-b-transparent border-[5px]",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[hsl(var(--card))] border-l-transparent border-r-transparent border-t-transparent border-[5px]",
  left: "left-full top-1/2 -translate-y-1/2 border-l-[hsl(var(--card))] border-t-transparent border-b-transparent border-r-transparent border-[5px]",
  right: "right-full top-1/2 -translate-y-1/2 border-r-[hsl(var(--card))] border-t-transparent border-b-transparent border-l-transparent border-[5px]",
};

const motionVariants = {
  top: { initial: { opacity: 0, y: 4, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 } },
  bottom: { initial: { opacity: 0, y: -4, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 } },
  left: { initial: { opacity: 0, x: 4, scale: 0.96 }, animate: { opacity: 1, x: 0, scale: 1 } },
  right: { initial: { opacity: 0, x: -4, scale: 0.96 }, animate: { opacity: 1, x: 0, scale: 1 } },
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
      <AnimatePresence>
        {visible && (
          <motion.span
            role="tooltip"
            initial={motionVariants[side].initial}
            animate={motionVariants[side].animate}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              // Positioning
              "pointer-events-none absolute z-[300] max-w-[260px]",
              // Visual — premium glassmorphic surface
              "rounded-xl border border-white/10",
              "bg-[hsl(var(--card))]/95 text-[hsl(var(--foreground))]",
              "shadow-[0_8px_32px_-6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl",
              // Typography
              "px-3 py-1.5 text-[11px] font-medium leading-snug whitespace-normal",
              sideMap[side],
              contentClassName
            )}
          >
            {/* top shimmer line */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {/* arrow */}
            <span className={cn("pointer-events-none absolute", arrowMap[side])} />
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
