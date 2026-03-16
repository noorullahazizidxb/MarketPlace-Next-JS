"use client";

import React from "react";
import "./new-loading.css";

type Props = { size?: number; label?: string };

export function Loading({ size = 56, label }: Props) {
  const finalLabel = label ?? "Loading";
  const scale = Math.max(0.9, Math.min(2.2, size / 56));

  return (
    <div
      className="inline-grid place-items-center"
      dir="ltr"
      role="status"
      aria-label={finalLabel}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="market-loader" style={{ transform: `scale(${scale})` }}>
        <span className="market-loader__shape" aria-hidden="true" />
        <span className="market-loader__text">{finalLabel}</span>
      </div>
      <span className="sr-only">{finalLabel}...</span>
    </div>
  );
}

export default Loading;
