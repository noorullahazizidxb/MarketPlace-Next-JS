"use client";
import { ThemeToggle } from "../../theme/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";

export default function SettingsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h2 className="heading-xl">{t("settings")}</h2>
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{t("settingsAppearanceTitle")}</p>
            <p className="subtle">{t("settingsAppearanceDescription")}</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
