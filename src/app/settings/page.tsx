"use client";
import { ThemeToggle } from "../../theme/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="heading-xl">Settings</h2>
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Appearance</p>
            <p className="subtle">Toggle light and dark themes.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
