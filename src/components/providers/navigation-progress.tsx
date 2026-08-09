"use client";

import { ProgressProvider } from "@bprogress/next/app";

export function NavigationProgress({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProgressProvider
      color="var(--primary)"
      height="3px"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
