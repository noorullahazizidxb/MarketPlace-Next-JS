"use client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ThemesSettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="heading-xl">Configure Themes</h2>
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Theme</p>
            <p className="subtle">Switch and preview the current theme.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="card">
        <p className="font-medium">Preview</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded">
            Sample card
          </div>
          <div className="p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded">
            Another
          </div>
        </div>
      </div>
    </div>
  );
}
