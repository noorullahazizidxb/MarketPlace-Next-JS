"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Dices } from "lucide-react";
import { cn } from "@/lib/cn";

export type PresetOption = {
  value: string;
  name: string;
  preset: {
    styles: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
  };
};

const previewKeys = ["primary", "secondary", "accent", "success", "warning"];

function Swatches({ styles }: { styles: Record<string, string> }) {
  const colors = previewKeys.map((key) => styles[key]).filter(Boolean);
  const gradientStart = styles["brand-gradient-start"] ?? styles.primary;
  const gradientEnd = styles["brand-gradient-end"] ?? styles.accent;

  return (
    <span className="flex shrink-0 items-center gap-1">
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="size-3 rounded-full border border-border/20"
          style={{ backgroundColor: color }}
        />
      ))}
      {gradientStart && gradientEnd && (
        <span
          className="h-3 w-6 rounded-full border border-border/20"
          style={{
            background: `linear-gradient(90deg, ${gradientStart}, ${gradientEnd})`,
          }}
        />
      )}
    </span>
  );
}

export function PresetManagerPanel({
  label,
  builtins,
  value,
  onChange,
  onRandom,
  clearOthers,
}: {
  label: string;
  builtins: PresetOption[];
  value: string;
  onChange: (value: string) => void;
  onRandom: () => void;
  clearOthers?: () => void;
  presetCategory?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="flex min-w-0 items-center gap-1.5 app-text-label font-semibold text-foreground transition-colors hover:text-primary"
        >
          <motion.span
            animate={{ rotate: expanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-3.5" />
          </motion.span>
          <span className="truncate">{label}</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 app-text-micro font-semibold text-muted-foreground">
            {builtins.length}
          </span>
        </button>
        <button
          type="button"
          onClick={onRandom}
          aria-label={`Choose a random ${label}`}
          title="Random preset"
          className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/60 bg-card text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <Dices className="size-3.5" />
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="max-h-56 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
          {builtins.map((preset) => {
            const active = value === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  onChange(preset.value);
                  clearOthers?.();
                }}
                className={cn(
                  "flex min-h-9 w-full items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-colors",
                  active
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-transparent text-foreground hover:border-border hover:bg-muted/55",
                )}
              >
                <Swatches styles={preset.preset.styles.light} />
                <span className="min-w-0 flex-1 truncate app-text-label font-medium">
                  {preset.name}
                </span>
                {active && <Check className="size-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
