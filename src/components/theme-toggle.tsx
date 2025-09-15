"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Props = {
  iconOnly?: boolean;
  className?: string;
};

export function ThemeToggle({ iconOnly = false, className }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = (resolvedTheme ?? theme) === "dark";

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
        onClick={() => setTheme(isDark ? "light" : "dark")}
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
      onClick={() => setTheme(isDark ? "light" : "dark")}
      LeftIcon={isDark ? Sun : Moon}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
