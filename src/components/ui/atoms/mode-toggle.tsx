"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "./shadcn/button";
import { useTheme } from "@repo/theme";

interface ModeToggleProps {
  variant?: "outline" | "ghost" | "default";
}

export function ModeToggle({ variant = "outline" }: ModeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme ?? theme) === "dark";

  return (
    <div className="flex items-center border-l border-slate-200 pl-2 dark:border-slate-700">
      <Button
        variant={variant}
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="text-primary transition"
        aria-label={
          mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"
        }
      >
        {isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5 text-[#4d4d4d] dark:text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
