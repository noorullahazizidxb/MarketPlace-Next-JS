"use client";

import { AppErrorState } from "@/components/ui/app-error-state";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <AppErrorState onRetry={reset} />;
}
