"use client";

import * as React from "react";
import { ThemeProviderContext } from "../theme-context";

interface UiContextGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function UiContextGate({
  children,
  fallback = null,
}: UiContextGateProps) {
  const { isReady } = React.useContext(ThemeProviderContext);

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
