"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "./shadcn/button";
import { useTheme } from "@repo/theme";

interface ModeToggleProps {
  variant?: "outline" | "ghost" | "default";
}

export function ModeToggle({ variant = "outline" }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    if (theme === "dark") {
      setIsDark(true);
      return;
    }
    if (theme === "light") {
      setIsDark(false);
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setIsDark(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [mounted, theme]);

  return (
    <div className="flex items-center border-l border-border pl-2 dark:border-border">
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
          <Moon className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
