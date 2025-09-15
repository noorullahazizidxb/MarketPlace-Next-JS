"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        className:
          "!bg-[hsl(var(--card))] !text-[hsl(var(--foreground))] !border !border-[hsl(var(--border))] !shadow-lg",
        style: { borderRadius: "12px", padding: "10px 12px" },
        success: {
          iconTheme: {
            primary: "hsl(var(--primary))",
            secondary: "hsl(var(--card))",
          },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "hsl(var(--card))" },
        },
      }}
    />
  );
}
