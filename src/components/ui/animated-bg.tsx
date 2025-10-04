"use client";
export function AnimatedBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-40 -left-40 h-[60vh] w-[60vw] rounded-full blur-3xl opacity-30 animate-aurora bg-aurora-one" />
      <div className="absolute -bottom-40 -right-40 h-[60vh] w-[60vw] rounded-full blur-3xl opacity-20 animate-aurora bg-aurora-two" />
      <div className="absolute inset-0 bg-grid-overlay" />
    </div>
  );
}
