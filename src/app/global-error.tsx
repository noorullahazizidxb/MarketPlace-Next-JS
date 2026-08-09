"use client";

import "./globals.css";
import { AppErrorState } from "@/components/ui/app-error-state";

export default function GlobalError({ reset }: { reset: () => void }) {
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
