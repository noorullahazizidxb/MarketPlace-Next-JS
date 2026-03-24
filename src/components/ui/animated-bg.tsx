"use client";

/**
 * Animated background — theme-aware layered blobs.
 * All animations are pure-CSS (compositor-thread) for maximum scroll
 * performance. No framer-motion runtime overhead on every frame.
 */
export function AnimatedBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Conic glow — CSS spin-slow class, GPU compositor layer */}
      <div className="absolute -inset-1 opacity-60 bg-conic-primary-secondary blur-18 animate-spin-slow" />

      {/* Ribbon blobs — CSS drift keyframes, no JS per-frame */}
      <div className="absolute -top-48 -left-32 h-[55vh] w-[65vw] rounded-[40%] bg-radial-accent blur-40 animate-drift-a" />
      <div className="absolute -bottom-44 -right-40 h-[60vh] w-[60vw] rounded-[42%] bg-radial-secondary blur-42 animate-drift-b" />

      {/* Fine grid texture overlay */}
      <div className="absolute inset-0 bg-grid-overlay" />
    </div>
  );
}
