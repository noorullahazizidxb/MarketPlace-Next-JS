"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";
import { useThemeStore } from "@/store/theme.store";

type Props = {
  iconOnly?: boolean;
  className?: string;
};

function subscribe() {
  return () => {};
}

export function ThemeToggle({ iconOnly = false, className }: Props) {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mode === "dark";

  if (!mounted) {
    if (iconOnly) {
      const base = "glass size-9 rounded-xl grid place-items-center";
      return <div className={className ? `${base} ${className}` : base} />;
    }
    return <Button variant="ghost" aria-label="Toggle theme" />;
  }

  if (iconOnly) {
    const base =
      "glass size-9 rounded-xl grid place-items-center hover:ring-1 ring-white/20";
    return (
      <button
        aria-label="Toggle theme"
        onClick={() => setMode(isDark ? "light" : "dark")}
        className={className ? `${base} ${className}` : base}
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => setMode(isDark ? "light" : "dark")}
      LeftIcon={isDark ? Sun : Moon}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
