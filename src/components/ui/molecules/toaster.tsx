"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        className:
          "!bg-[var(--card)] !text-[var(--foreground)] !border !border-[var(--border)] !shadow-lg",
        style: { borderRadius: "12px", padding: "10px 12px" },
        success: {
          iconTheme: {
            primary: "var(--primary)",
            secondary: "var(--card)",
          },
        },
        error: {
          iconTheme: { primary: "var(--destructive)", secondary: "var(--card)" },
        },
      }}
    />
  );
}
