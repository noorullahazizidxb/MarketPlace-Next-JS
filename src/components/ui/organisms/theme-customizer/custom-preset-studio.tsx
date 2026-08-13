"use client";

import React from "react";
import {
  ArrowLeftRight,
  Check,
  Copy,
  Moon,
  Pencil,
  Plus,
  Sparkles,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@repo/hooks";
import type {
  CustomThemePreset,
  ThemeStyleMode,
} from "@repo/types";
import { resolveThemePresetStyles } from "@/lib/theme/theme-preset-resolver";
import {
  cloneThemePresetStyles,
  createCustomThemePreset,
  deleteCustomThemePreset,
  normalizeThemeTokenRecord,
  swapThemePresetModes,
  updateCustomThemePreset,
  type ThemePresetStyles,
} from "@/lib/theme/ui-context/context-store";

function resolvedMode(): ThemeStyleMode {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  return "light";
}

function presetSwatches(styles: Record<string, string>) {
  return ["primary", "secondary", "accent", "success", "warning"]
    .map((key) => styles[key])
    .filter(Boolean)
    .slice(0, 5);
}

function PresetEditor({
  open,
  onOpenChange,
  source,
  sourceName,
  editingPreset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: ThemePresetStyles;
  sourceName: string;
  editingPreset?: CustomThemePreset | null;
}) {
  const { themeSettings, updateThemeSettings } = useTheme();
  const [mode, setMode] = React.useState<ThemeStyleMode>("light");
  const [name, setName] = React.useState("");
  const [rawModes, setRawModes] = React.useState<Record<ThemeStyleMode, string>>({
    light: "{}",
    dark: "{}",
  });
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const styles = cloneThemePresetStyles(source);
    setMode(resolvedMode());
    setName(editingPreset ? `${editingPreset.name} copy` : `${sourceName} custom`);
    setRawModes({
      light: JSON.stringify(styles.light, null, 2),
      dark: JSON.stringify(styles.dark, null, 2),
    });
    setError(null);
  }, [editingPreset, open, source, sourceName]);

  const parseStyles = () => {
    try {
      const styles = {
        light: normalizeThemeTokenRecord(JSON.parse(rawModes.light)),
        dark: normalizeThemeTokenRecord(JSON.parse(rawModes.dark)),
      };
      if (!name.trim()) throw new Error("Give the preset a clear name before saving.");
      setError(null);
      return styles;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invalid theme JSON.");
      return null;
    }
  };

  const selectPreset = (preset: CustomThemePreset, presets: CustomThemePreset[]) => {
    updateThemeSettings({
      customThemePresets: presets,
      selectedCustomThemeId: preset.id,
      importedTheme: null,
      selectedTheme: "",
      selectedTweakcnTheme: "",
      selectedBrandTheme: "",
      selectedSidebarTheme: "",
      brandColors: {},
    });
  };

  const saveAsNew = () => {
    const styles = parseStyles();
    if (!styles) return;
    const preset = createCustomThemePreset({
      name,
      styles,
      sourcePresetId: editingPreset?.id ?? themeSettings.selectedCustomThemeId ?? null,
    });
    selectPreset(preset, [...(themeSettings.customThemePresets ?? []), preset]);
    onOpenChange(false);
  };

  const updateSelected = () => {
    if (!editingPreset) return;
    const styles = parseStyles();
    if (!styles) return;
    const presets = updateCustomThemePreset(
      themeSettings.customThemePresets ?? [],
      editingPreset.id,
      { name, styles },
    );
    const updated = presets.find((preset) => preset.id === editingPreset.id);
    if (updated) selectPreset(updated, presets);
    onOpenChange(false);
  };

  const swapDraftModes = () => {
    setRawModes((previous) => ({
      light: previous.dark,
      dark: previous.light,
    }));
    setMode((current) => (current === "light" ? "dark" : "light"));
    setError(null);
  };

  const copyCurrentMode = () => {
    const destination: ThemeStyleMode = mode === "light" ? "dark" : "light";
    setRawModes((previous) => ({
      ...previous,
      [destination]: previous[mode],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92dvh,48rem)] max-w-2xl flex-col overflow-hidden p-0">
        <div className="flex shrink-0 items-start gap-3 border-b border-border px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="app-text-heading-sm font-semibold">
              {editingPreset ? "Clone or update preset" : "Create a custom preset"}
            </DialogTitle>
            <p className="mt-1 app-text-caption text-muted-foreground">
              Both light and dark objects are cloned first. Editing one mode never discards the other.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close preset editor"
            onClick={() => onOpenChange(false)}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <label className="block space-y-1.5">
            <span className="app-text-label font-semibold">Preset name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3 app-text-body outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/35"
              placeholder="My marketplace theme"
            />
          </label>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1">
              {(["light", "dark"] as const).map((candidate) => {
                const Icon = candidate === "light" ? Sun : Moon;
                return (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => setMode(candidate)}
                    className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 app-text-label font-semibold capitalize transition-colors ${
                      mode === candidate
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" /> {candidate}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" LeftIcon={Copy} onClick={copyCurrentMode}>
                Copy to {mode === "light" ? "dark" : "light"}
              </Button>
              <Button variant="secondary" size="sm" LeftIcon={ArrowLeftRight} onClick={swapDraftModes}>
                Swap modes
              </Button>
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="flex items-center justify-between gap-3 app-text-label font-semibold">
              <span className="capitalize">{mode} mode tokens</span>
              <span className="app-text-micro font-normal text-muted-foreground">
                JSON object · omit leading --
              </span>
            </span>
            <textarea
              value={rawModes[mode]}
              onChange={(event) => {
                setRawModes((previous) => ({
                  ...previous,
                  [mode]: event.target.value,
                }));
                setError(null);
              }}
              rows={14}
              spellCheck={false}
              className="w-full resize-y rounded-xl border border-border bg-background/80 px-3 py-3 font-mono text-xs leading-relaxed outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/35"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 app-text-caption text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-card/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {editingPreset && (
            <Button variant="secondary" LeftIcon={Check} onClick={updateSelected}>
              Update selected
            </Button>
          )}
          <Button variant="primary" LeftIcon={Copy} onClick={saveAsNew}>
            Save as new preset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CustomPresetStudio() {
  const { themeSettings, updateThemeSettings } = useTheme();
  const presets = themeSettings.customThemePresets ?? [];
  const selectedId = themeSettings.selectedCustomThemeId ?? "";
  const selectedPreset = presets.find((preset) => preset.id === selectedId) ?? null;
  const resolved = resolveThemePresetStyles(themeSettings) ?? { light: {}, dark: {} };
  const previewMode: ThemeStyleMode = themeSettings.mode === "dark" ? "dark" : "light";
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingPreset, setEditingPreset] = React.useState<CustomThemePreset | null>(null);
  const [editorSource, setEditorSource] = React.useState<ThemePresetStyles>(() =>
    cloneThemePresetStyles(resolved),
  );
  const [sourceName, setSourceName] = React.useState("Current theme");

  const select = (preset: CustomThemePreset) => {
    updateThemeSettings({
      selectedCustomThemeId: preset.id,
      importedTheme: null,
      selectedTheme: "",
      selectedTweakcnTheme: "",
      selectedBrandTheme: "",
      selectedSidebarTheme: "",
      brandColors: {},
    });
  };

  const openEditor = (preset?: CustomThemePreset) => {
    const source = preset?.styles ?? resolved;
    setEditorSource(cloneThemePresetStyles(source));
    setSourceName(preset?.name ?? "Current theme");
    setEditingPreset(preset ?? null);
    setEditorOpen(true);
  };

  const swapAndClone = (preset?: CustomThemePreset) => {
    const source = preset ?? {
      id: selectedId || "active-theme",
      styles: cloneThemePresetStyles(resolved),
    };
    const swapped = swapThemePresetModes({
      source,
      name: `${preset?.name ?? "Current theme"} · swapped`,
    });
    updateThemeSettings({
      customThemePresets: [...presets, swapped],
      selectedCustomThemeId: swapped.id,
      importedTheme: null,
      selectedTheme: "",
      selectedTweakcnTheme: "",
      selectedBrandTheme: "",
      selectedSidebarTheme: "",
      brandColors: {},
    });
  };

  const remove = (preset: CustomThemePreset) => {
    if (!window.confirm(`Delete preset “${preset.name}”?`)) return;
    const next = deleteCustomThemePreset(presets, preset.id);
    updateThemeSettings({
      customThemePresets: next,
      selectedCustomThemeId: selectedId === preset.id ? "" : selectedId,
      selectedTheme: selectedId === preset.id ? "default" : themeSettings.selectedTheme,
    });
  };

  return (
    <section className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 app-text-label font-semibold text-foreground">
            <Sparkles className="size-3.5 text-primary" /> Your presets
          </div>
          <p className="mt-1 app-text-micro leading-relaxed text-muted-foreground">
            Clone the complete active theme, then edit light or dark independently.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => swapAndClone(selectedPreset ?? undefined)}
            title="Clone and swap light/dark modes"
            className="grid size-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeftRight className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => openEditor()}
            title="Create preset from current theme"
            className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      {presets.length > 0 ? (
        <div className="max-h-56 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
          {presets.map((preset) => {
            const active = preset.id === selectedId;
            const swatches = presetSwatches(preset.styles[previewMode]);
            return (
              <div
                key={preset.id}
                className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-colors ${
                  active
                    ? "border-primary/30 bg-primary/10"
                    : "border-transparent bg-card/60 hover:border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => select(preset)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="flex shrink-0 items-center -space-x-1">
                    {swatches.map((color, index) => (
                      <span
                        key={`${color}-${index}`}
                        className="size-4 rounded-full border-2 border-card"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1 truncate app-text-label font-medium">
                    {preset.name}
                  </span>
                  {active && <Check className="size-3.5 shrink-0 text-primary" />}
                </button>
                <div className="flex items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label={`Edit ${preset.name}`}
                    onClick={() => openEditor(preset)}
                    className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Swap modes for ${preset.name}`}
                    onClick={() => swapAndClone(preset)}
                    className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <ArrowLeftRight className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${preset.name}`}
                    onClick={() => remove(preset)}
                    className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => openEditor()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-card/55 px-3 py-4 app-text-caption font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Plus className="size-3.5" /> Create your first preset from the active theme
        </button>
      )}

      <PresetEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        source={editorSource}
        sourceName={sourceName}
        editingPreset={editingPreset}
      />
    </section>
  );
}
