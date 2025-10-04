"use client";
import { motion } from "framer-motion";

// Animated background that respects theme tokens and adds a premium layered look
export function AnimatedBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft conic glow behind content using theme primary/secondary */}
      <motion.div
        className="absolute -inset-1 opacity-60"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, hsl(var(--primary) / 0.12), transparent 30%, hsl(var(--secondary) / 0.12), transparent 70%, hsl(var(--primary) / 0.12))",
          filter: "blur(18px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      />

      {/* Ribbon gradients that slowly drift */}
      <motion.div
        className="absolute -top-48 -left-32 h-[55vh] w-[65vw] rounded-[40%]"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--accent) / 0.18), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-44 -right-40 h-[60vh] w-[60vw] rounded-[42%]"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--secondary) / 0.18), transparent 70%)",
          filter: "blur(42px)",
        }}
        animate={{ x: [0, -16, 12, 0], y: [0, 12, -8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fine grid overlay for subtle texture */}
      <div className="absolute inset-0 bg-grid-overlay" />
    </div>
  );
}
