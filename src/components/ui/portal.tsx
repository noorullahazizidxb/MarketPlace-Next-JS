"use client";
import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function Portal({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
