"use client";

import React from "react";
import "./new-loading.css";

type Props = { size?: number; label?: string };

export function Loading({ size = 56, label }: Props) {
  const finalLabel = label ?? "Loading";
  const scale = Math.max(0.7, Math.min(2.0, size / 56));

  return (
    <div
      className="inline-grid place-items-center"
      dir="ltr"
      role="status"
      aria-label={finalLabel}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="modern-loader-container" style={{ transform: `scale(${scale})` }}>
        <div className="modern-spinner" aria-hidden="true" />
        <div className="modern-loader-text" data-text={finalLabel} />
      </div>
      <span className="sr-only">{finalLabel}...</span>
    </div>
  );
}

export default Loading;
