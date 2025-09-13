"use client";
export function AnimatedBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-40 -left-40 h-[60vh] w-[60vw] rounded-full blur-3xl opacity-30 animate-aurora"
        style={{
          background: "radial-gradient(closest-side, #60a5fa, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 h-[60vh] w-[60vw] rounded-full blur-3xl opacity-20 animate-aurora"
        style={{
          background: "radial-gradient(closest-side, #a78bfa, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
    </div>
  );
}
