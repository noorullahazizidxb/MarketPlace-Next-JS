"use client";

import { AppErrorState } from "@/components/ui/organisms/app-error-state";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <AppErrorState onRetry={reset} />;
}
