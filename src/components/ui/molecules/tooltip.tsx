"use client";
import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Portal } from "@/components/ui/atoms/portal";

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

const GAP = 10;

const motionVariants = {
  top: {
    initial: { opacity: 0, y: 4, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  bottom: {
    initial: { opacity: 0, y: -4, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  left: {
    initial: { opacity: 0, x: 4, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
  right: {
    initial: { opacity: 0, x: -4, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
};

const arrowMap: Record<TooltipSide, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-[var(--card)] border-l-transparent border-r-transparent border-b-transparent border-[5px]",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-[var(--card)] border-l-transparent border-r-transparent border-t-transparent border-[5px]",
  left: "left-full top-1/2 -translate-y-1/2 border-l-[var(--card)] border-t-transparent border-b-transparent border-r-transparent border-[5px]",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-[var(--card)] border-t-transparent border-b-transparent border-l-transparent border-[5px]",
};

type Coords = { top: number; left: number; transform: string };

function coordsForSide(rect: DOMRect, side: TooltipSide): Coords {
  switch (side) {
    case "top":
      return {
        top: rect.top - GAP,
        left: rect.left + rect.width / 2,
        transform: "translate(-50%, -100%)",
      };
    case "bottom":
      return {
        top: rect.bottom + GAP,
        left: rect.left + rect.width / 2,
        transform: "translate(-50%, 0)",
      };
    case "left":
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - GAP,
        transform: "translate(-100%, -50%)",
      };
    case "right":
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + GAP,
        transform: "translate(0, -50%)",
      };
  }
}

/**
 * Universal Tooltip — portals to document.body with fixed positioning so
 * overflow parents (sticky nav, glass cards) cannot clip the bubble.
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
  const [coords, setCoords] = useState<Coords | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    setCoords(coordsForSide(el.getBoundingClientRect(), side));
  }, [side]);

  const open = useCallback(() => {
    if (disabled || !content) return;
    timerRef.current = setTimeout(() => {
      measure();
      setVisible(true);
    }, delay);
  }, [disabled, delay, content, measure]);

  const close = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;
    measure();
  }, [visible, measure]);

  useEffect(() => {
    if (!visible) return;
    const onReposition = () => measure();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [visible, measure]);

  return (
    <span
      ref={triggerRef}
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      <Portal>
        <AnimatePresence>
          {visible && coords && (
            <span
              className="pointer-events-none fixed z-[1000]"
              style={{
                top: coords.top,
                left: coords.left,
                transform: coords.transform,
              }}
            >
              <motion.span
                role="tooltip"
                initial={motionVariants[side].initial}
                animate={motionVariants[side].animate}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.1 } }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative block max-w-[260px]",
                  "rounded-xl border border-border",
                  "bg-[var(--card)]/95 text-[var(--foreground)]",
                  "shadow-token-lg backdrop-blur-2xl",
                  "px-3 py-1.5 app-text-caption font-medium leading-snug whitespace-normal",
                  contentClassName,
                )}
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-overlay-light/20 to-transparent" />
                <span
                  className={cn("pointer-events-none absolute", arrowMap[side])}
                />
                {content}
              </motion.span>
            </span>
          )}
        </AnimatePresence>
      </Portal>
    </span>
  );
}
