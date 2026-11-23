"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { BottomNavDescriptor } from "./types";

export const BottomNavItem: React.FC<{
  item: BottomNavDescriptor;
  active: boolean;
  onNavigate: (href?: string, override?: () => void) => void;
  index: number;
  reducedMotion: boolean;
}> = ({ item, active, onNavigate, index, reducedMotion }) => {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      initial={reducedMotion ? false : { y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { delay: 0.04 * index, type: "spring", stiffness: 380, damping: 30 }
      }
      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={() => onNavigate(item.href, item.onClick)}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1.5 py-1.5",
        "app-text-micro font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="relative grid size-9 place-items-center">
        {active && (
          <motion.span
            layoutId="bottom-nav-pill"
            className="absolute inset-0 rounded-2xl bg-primary/15 ring-1 ring-primary/25"
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 32 }
            }
          />
        )}
        <Icon className={cn("relative size-[18px]", active && "text-primary")} />
      </span>
      <span className={cn("leading-none tracking-tight", active && "font-semibold")}>
        {item.label}
      </span>
    </motion.button>
  );
};
