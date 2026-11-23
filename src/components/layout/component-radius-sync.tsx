"use client";

import { useEffect } from "react";
import { useComponentVariants } from "@/hooks/use-component-variants";

/** Mirrors the card/table radius variants onto <html> so global CSS applies them site-wide. */
export function ComponentRadiusSync() {
  const { variants } = useComponentVariants();
  const card = variants.cardRadius ?? "default";
  const table = variants.tableRadius ?? "default";
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.cardRadius = card;
    root.dataset.tableRadius = table;
  }, [card, table]);
  return null;
}
