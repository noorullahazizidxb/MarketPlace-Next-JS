"use client";
import React, { useState } from "react";
import {
  animate,
  useMotionValue,
  useTransform,
  useIsomorphicLayoutEffect,
} from "framer-motion";

type AnimatedNumberProps = {
  value: number;
  duration?: number; // seconds
  decimals?: number;
  className?: string;
};

export function AnimatedNumber({
  value,
  duration = 0.6,
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const motion = useMotionValue(0);
  const rounded = useTransform(motion, (latest) =>
    Number(latest).toFixed(decimals)
  );
  // Local state holds the rendered string value so React always receives a primitive
  const [display, setDisplay] = useState<string>(() =>
    Number(0).toFixed(decimals)
  );

  useIsomorphicLayoutEffect(() => {
    const controls = animate(motion, value, { duration, ease: "easeOut" });
    return controls.stop;
  }, [value, duration, motion]);

  // Subscribe to transformed motion value and update local state
  useIsomorphicLayoutEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(String(v)));
    // set initial
    setDisplay(String(rounded.get()));
    return () => unsub();
  }, [rounded]);

  return <span className={className}>{display}</span>;
}

export default AnimatedNumber;
