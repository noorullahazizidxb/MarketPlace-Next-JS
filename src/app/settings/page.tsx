"use client";
import { ThemeToggle } from "../../theme/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";
import { Rows3, Monitor, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { t } = useLanguage();
  const density = useUIStore((s) => s.density);
  const setDensity = useUIStore((s) => s.setDensity);

  const settingsRows = [
    {
      icon: Monitor,
      title: t("settingsAppearanceTitle"),
      description: t("settingsAppearanceDescription"),
      control: <ThemeToggle />,
    },
    {
      icon: Globe,
      title: t("language"),
      description: null,
      control: <LanguageDropdown />,
    },
    {
      icon: Rows3,
      title: t("density"),
      description: null,
      control: (
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(["comfort", "compact"] as const).map((d) => (
            <Button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              variant={density === d ? "primary" : "ghost"}
              size="sm"
              className="capitalize"
            >
              {d}
            </Button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl app-shell-page" data-app-page="settings">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="heading-xl"
      >
        {t("settings")}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="card divide-y divide-border"
      >
        {settingsRows.map(({ icon: Icon, title, description, control }, i) => (
          <div
            key={title}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-muted">
                <Icon className="app-icon-sm text-foreground/70" />
              </span>
              <div>
                <p className="font-semibold app-text-body">{title}</p>
                {description && <p className="subtle app-text-caption">{description}</p>}
              </div>
            </div>
            {control}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

