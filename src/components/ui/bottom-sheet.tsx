"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { X } from "lucide-react";

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  snapPoints?: number[]; // values 0-1 representing vh fraction
  initialSnap?: number; // index of snapPoints
  closable?: boolean;
  id?: string;
}

// Utility: clamp number
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  title,
  children,
  className = "",
  snapPoints = [0.4, 0.75, 1],
  initialSnap = 0,
  closable = true,
  id,
}) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const [dragY, setDragY] = useState(0);
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const focusablesRef = useRef<HTMLElement[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Sort & sanitize snap points
  const snaps = [...new Set(snapPoints.map((p) => clamp(p, 0.15, 1)))].sort(
    (a, b) => a - b
  );
  const activeHeight = snaps[currentSnap] ?? snaps[0];

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        // Focus trap
        if (!focusablesRef.current.length) return;
        const list = focusablesRef.current;
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !list.includes(active as any)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      // Save last focused element for return on close
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // Collect focusable elements after next tick
      requestAnimationFrame(() => {
        const node = sheetRef.current;
        if (!node) return;
        const selectors = [
          "button",
          "a[href]",
          "input",
          "select",
          "textarea",
          '[tabindex]:not([tabindex="-1"])',
        ];
        const found = Array.from(
          node.querySelectorAll<HTMLElement>(selectors.join(","))
        ).filter(
          (el) =>
            !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
        );
        focusablesRef.current = found;
        // Focus first focusable or sheet container
        (found[0] || node).focus({ preventScroll: true });
      });
      return () => {
        document.body.style.overflow = prev;
        // Restore focus
        try {
          lastFocusedRef.current?.focus();
        } catch {}
      };
    } else {
      focusablesRef.current = [];
    }
  }, [open]);

  const handleDrag = (_: any, info: PanInfo) => {
    setDragY(info.offset.y);
  };
  const handleDragEnd = (_: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    const thresholdToClose = 120;
    const directionDown = velocity > 0 || offset > 0;

    // If pulled down far enough -> close
    if (offset > thresholdToClose) {
      close();
      setDragY(0);
      return;
    }

    // Determine nearest snap
    const container = sheetRef.current;
    if (!container) {
      setDragY(0);
      return;
    }
    const total = window.innerHeight;
    const currentHeight = snaps[currentSnap] * total - offset; // approximate new height
    // Find snap with minimal difference
    let best = currentSnap;
    let bestDiff = Infinity;
    snaps.forEach((s, i) => {
      const targetHeight = s * total;
      const diff = Math.abs(targetHeight - currentHeight);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    });
    // Slight bias: if dragging downward fast choose smaller snap
    if (directionDown && best > 0 && velocity > 500) best -= 1;
    setCurrentSnap(clamp(best, 0, snaps.length - 1));
    setDragY(0);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            ref={backdropRef}
            className="fixed inset-0 z-[950] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closable && close()}
          />
          <motion.div
            ref={sheetRef}
            className={
              "fixed left-0 right-0 z-[960] mx-auto flex flex-col rounded-t-[32px] bg-[hsl(var(--background))]/90 backdrop-blur-xl border border-[hsl(var(--border))] shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.4)] " +
              className
            }
            style={
              {
                height: `calc(${(activeHeight * 100).toFixed(
                  2
                )}vh - var(--safe-bottom))`,
                bottom: 0,
                y: 0,
              } as any
            }
            initial={
              prefersReducedMotion ? { y: 0, opacity: 0 } : { y: "100%" }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { y: dragY > 0 ? dragY : 0 }
            }
            exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
            transition={
              prefersReducedMotion
                ? { duration: 0.15 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 30,
                    mass: 0.9,
                  }
            }
            {...(!prefersReducedMotion && {
              drag: "y",
              dragDirectionLock: true,
              dragConstraints: { top: 0, bottom: 0 },
              dragElastic: 0.2,
              onDrag: handleDrag,
              onDragEnd: handleDragEnd,
            })}
          >
            <div className="pt-3 pb-2 px-6 flex items-center justify-between select-none cursor-grab active:cursor-grabbing">
              <div className="absolute left-1/2 top-2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-foreground/20" />
              <p className="text-sm font-semibold tracking-wide pr-4 line-clamp-1">
                {title}
              </p>
              {closable && (
                <button
                  onClick={close}
                  className="size-9 shrink-0 rounded-xl bg-white/5 hover:bg-white/10 grid place-items-center"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-1 safe-pb">
              {children}
              <div className="h-1" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook for reduced motion preference
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return prefers;
}
