"use client";

import AppearanceSettings from "@/components/settings/appearance-settings";
import { AmbientCanvas } from "@/components/ui/atoms/ambient-canvas";

export default function AppearancePage() {
  return (
    <div
      data-app-page="settings-appearance"
      className="relative app-shell-page min-h-[60vh]"
    >
      <AmbientCanvas variant="grid" intensity={0.2} className="fixed inset-0 -z-10" />
      <AppearanceSettings />
    </div>
  );
}
