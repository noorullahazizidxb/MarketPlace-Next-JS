"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * App-wide motion defaults. `reducedMotion="user"` makes every framer-motion
 * component honour the OS "reduce motion" setting (transforms snap, opacity still fades).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
