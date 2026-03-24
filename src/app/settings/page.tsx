"use client";
import { ThemeToggle } from "../../theme/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
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
        <div className="flex gap-1 rounded-lg border border-[hsl(var(--border))] p-1">
          {(["comfort", "compact"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${density === d
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  : "hover:bg-[hsl(var(--muted))]"
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
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
        className="card divide-y divide-[hsl(var(--border))]"
      >
        {settingsRows.map(({ icon: Icon, title, description, control }, i) => (
          <div
            key={title}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-xl bg-[hsl(var(--muted))] grid place-items-center">
                <Icon className="h-4 w-4 text-[hsl(var(--foreground))]/70" />
              </span>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                {description && <p className="subtle text-xs">{description}</p>}
              </div>
            </div>
            {control}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

