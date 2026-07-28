"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";
import { useTheme } from "@/lib/theme/theme-context";

type Props = {
  iconOnly?: boolean;
  className?: string;
};

function subscribe() {
  return () => {};
}

export function ThemeToggle({ iconOnly = false, className }: Props) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  if (!mounted) {
    if (iconOnly) {
      const base =
        "glass size-[var(--ctrl-h-sm)] rounded-xl grid place-items-center";
      return <div className={className ? `${base} ${className}` : base} />;
    }
    return <Button variant="ghost" aria-label="Toggle theme" />;
  }

  if (iconOnly) {
    const base =
      "glass size-[var(--ctrl-h-sm)] rounded-xl grid place-items-center hover:ring-1 ring-border/40";
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={toggle}
        className={className ? `${base} ${className}` : base}
      >
        {isDark ? (
          <Sun className="app-icon-sm" aria-hidden />
        ) : (
          <Moon className="app-icon-sm" aria-hidden />
        )}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      aria-label="Toggle theme"
      onClick={toggle}
      LeftIcon={isDark ? Sun : Moon}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
