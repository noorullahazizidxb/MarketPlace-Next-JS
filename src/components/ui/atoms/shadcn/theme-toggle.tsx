"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "./button";
import { useCircularTransition, useTheme } from "@repo/hooks";

interface ThemeModeToggleProps {
  variant?: "outline" | "ghost" | "default";
  labels?: {
    toggleToLight: string;
    toggleToDark: string;
  };
}

const defaultLabels = {
  toggleToLight: "Switch to light mode",
  toggleToDark: "Switch to dark mode",
};

export function ThemeModeToggle({
  variant = "outline",
  labels = defaultLabels,
}: ThemeModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const { startTransition } = useCircularTransition();

  // Simple, reliable dark mode detection with re-sync
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const updateMode = () => {
      if (theme === "dark") {
        setIsDarkMode(true);
      } else if (theme === "light") {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches,
        );
      }
    };

    updateMode();

    // Listen for system theme changes
    const mediaQuery =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    if (mediaQuery) {
      mediaQuery.addEventListener("change", updateMode);
    }

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener("change", updateMode);
      }
    };
  }, [theme]);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    startTransition(
      { x: event.clientX, y: event.clientY },
      () => setTheme(isDarkMode ? "light" : "dark"),
    );
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleToggle}
      className="mode-toggle-button relative w-9 min-h-(--ctrl-h) cursor-pointer overflow-hidden text-primary"
    >
      {/* Show the icon for the mode you can switch TO */}
      {isDarkMode ? (
        <Sun className="admin-icon-sm transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="admin-icon-sm transition-transform duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">
        {isDarkMode ? labels.toggleToLight : labels.toggleToDark}
      </span>
    </Button>
  );
}
