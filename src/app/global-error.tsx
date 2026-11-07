"use client";

import "./globals.css";
import { AppErrorState } from "@/components/ui/organisms/app-error-state";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <AppErrorState
          title="Marketplace needs a fresh start"
          description="A critical interface error interrupted this session. Try reloading the application or return to Marketplace."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
