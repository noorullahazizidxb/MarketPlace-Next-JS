"use client";
import React from "react";
import { Palette, Upload, ExternalLink, Sun, Moon } from "lucide-react";
import { Button } from "../../atoms/shadcn/button";
import { Separator } from "../../atoms/shadcn/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../atoms/shadcn/accordion";

import {
  colorThemes,
  tweakcnThemes,
  brandThemes,
  sidebarThemes,
  radiusOptions,
  baseColors,
  themeColorGroups,
} from "@repo/constants";
import { ColorPicker } from "../../molecules/color-picker";
import type { ImportedTheme } from "@repo/types";
import { useThemeManager, useCircularTransition } from "@repo/hooks";
import { PresetManagerPanel } from "./preset-manager-panel";

interface ThemeTabProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  selectedTweakcnTheme: string;
  setSelectedTweakcnTheme: (theme: string) => void;
  selectedBrandTheme: string;
  setSelectedBrandTheme: (theme: string) => void;
  selectedSidebarTheme: string;
  setSelectedSidebarTheme: (theme: string) => void;
  selectedRadius: string;
  setSelectedRadius: (radius: string) => void;
  setImportedTheme: (theme: ImportedTheme | null) => void;
  onImportClick: () => void;
}

// Solid colour swatches shown before the gradient pill in the theme dropdown.
// Keep this list at 8 tokens so every preset preview exposes a consistent
// high-signal palette sample.
const solidPreviewKeys = [
  "primary",
  "secondary",
  "accent",
  "ring",
  "success",
  "warning",
  "info",
  "price",
] as const;

// Helper that renders 4 solid dots + 1 gradient pill for a given light-mode
// style object.  Keeping it as a component avoids duplication between the two
// Select lists.
function ThemePreviewSwatches({
  styles,
}: {
  styles: Record<string, string>;
}) {
  const gradStart = styles["brand-gradient-start"] ?? "transparent";
  const gradEnd = styles["brand-gradient-end"] ?? "transparent";

  return (
    <div className="flex items-center gap-1">
      {solidPreviewKeys.map((key) => (
        <div
          key={key}
          className="app-icon-xs rounded-full border border-border/20 flex-shrink-0"
          style={{ backgroundColor: styles[key] ?? "transparent" }}
        />
      ))}
      {/* Gradient pill – shows the brand gradient at a glance */}
      <div
        className="w-7 h-3 rounded-full border border-border/20 flex-shrink-0"
        style={{
          background: `linear-gradient(90deg, ${gradStart}, ${gradEnd})`,
        }}
        title={`Brand gradient: ${gradStart} → ${gradEnd}`}
      />
    </div>
  );
}

export function ThemeTab({
  selectedTheme,
  setSelectedTheme,
  selectedTweakcnTheme,
  setSelectedTweakcnTheme,
  selectedBrandTheme,
  setSelectedBrandTheme,
  selectedSidebarTheme,
  setSelectedSidebarTheme,
  selectedRadius,
  setSelectedRadius,
  setImportedTheme,
  onImportClick,
}: ThemeTabProps) {
  const {
    isDarkMode,
    brandColorsValues,
    setBrandColorsValues,
    handleColorChange,
  } = useThemeManager();

  const { toggleTheme } = useCircularTransition();

  const handleRandomShadcn = () => {
    // Apply a random shadcn theme
    const randomTheme =
      colorThemes[Math.floor(Math.random() * colorThemes.length)];
    if (!randomTheme) return;
    setSelectedTheme(randomTheme.value);
    setSelectedTweakcnTheme(""); // Clear tweakcn selection
    setSelectedBrandTheme("");
    setSelectedSidebarTheme("");
    setBrandColorsValues({}); // Clear brand colors state
    setImportedTheme(null); // Clear imported theme
  };

  const handleRandomTweakcn = () => {
    // Apply a random tweakcn theme
    const randomTheme =
      tweakcnThemes[Math.floor(Math.random() * tweakcnThemes.length)];
    if (!randomTheme) return;
    setSelectedTweakcnTheme(randomTheme.value);
    setSelectedTheme(""); // Clear shadcn selection
    setSelectedBrandTheme("");
    setSelectedSidebarTheme("");
    setBrandColorsValues({}); // Clear brand colors state
    setImportedTheme(null); // Clear imported theme
  };

  const handleRandomBrand = () => {
    const randomTheme =
      brandThemes[Math.floor(Math.random() * brandThemes.length)];
    if (!randomTheme) return;
    setSelectedBrandTheme(randomTheme.value);
    setSelectedTheme("");
    setSelectedTweakcnTheme("");
    setSelectedSidebarTheme("");
    setBrandColorsValues({});
    setImportedTheme(null);
  };

  const handleRandomSidebar = () => {
    const randomTheme =
      sidebarThemes[Math.floor(Math.random() * sidebarThemes.length)];
    if (!randomTheme) return;
    setSelectedSidebarTheme(randomTheme.value);
    setSelectedTheme("");
    setSelectedTweakcnTheme("");
    setSelectedBrandTheme("");
    setBrandColorsValues({});
    setImportedTheme(null);
  };

  const handleRadiusSelect = (radius: string) => {
    setSelectedRadius(radius);
  };

  const handleLightMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDarkMode === false) return;
    toggleTheme(event);
  };

  const handleDarkMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDarkMode === true) return;
    toggleTheme(event);
  };

  const clearOthers = (except: "shadcn" | "tweakcn" | "brand" | "sidebar") => {
    if (except !== "shadcn") setSelectedTheme("");
    if (except !== "tweakcn") setSelectedTweakcnTheme("");
    if (except !== "brand") setSelectedBrandTheme("");
    if (except !== "sidebar") setSelectedSidebarTheme("");
    setBrandColorsValues({});
    setImportedTheme(null);
  };

  return (
    <div className="p-4 space-y-6">
      {/* ── 4 Preset panels with full CRUD ─────────────────────────────────── */}
      <PresetManagerPanel
        label="Shadcn UI Theme Presets"
        builtins={colorThemes as any}
        value={selectedTheme}
        onChange={setSelectedTheme}
        onRandom={handleRandomShadcn}
        clearOthers={() => clearOthers("shadcn")}
        presetCategory="shadcn"
      />

      <Separator />

      <PresetManagerPanel
        label="Tweakcn Theme Presets"
        builtins={tweakcnThemes as any}
        value={selectedTweakcnTheme}
        onChange={setSelectedTweakcnTheme}
        onRandom={handleRandomTweakcn}
        clearOthers={() => clearOthers("tweakcn")}
        presetCategory="tweakcn"
      />

      <Separator />

      <PresetManagerPanel
        label="Brand Theme Presets"
        builtins={brandThemes as any}
        value={selectedBrandTheme}
        onChange={setSelectedBrandTheme}
        onRandom={handleRandomBrand}
        clearOthers={() => clearOthers("brand")}
        presetCategory="brand"
      />

      <Separator />

      <PresetManagerPanel
        label="Sidebar Theme Presets"
        builtins={sidebarThemes as any}
        value={selectedSidebarTheme}
        onChange={setSelectedSidebarTheme}
        onRandom={handleRandomSidebar}
        clearOthers={() => clearOthers("sidebar")}
        presetCategory="sidebar"
      />

      <Separator />

      {/* ── Radius ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-foreground">Radius</div>
        <div className="grid grid-cols-5 gap-2">
          {radiusOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer squircle p-3 border transition-colors ${selectedRadius === option.value
                ? "border-primary"
                : "border-border hover:border-border/60"
                }`}
              onClick={() => handleRadiusSelect(option.value)}
            >
              <div className="text-center">
                <div className="app-text-caption">{option.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* ── Mode ────────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-foreground">Mode</div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={!isDarkMode ? "secondary" : "outline"}
            size="sm"
            onClick={handleLightMode}
            className="mode-toggle-button cursor-pointer"
          >
            <Sun className="app-icon-sm mr-1" />
            Light
          </Button>
          <Button
            variant={isDarkMode ? "secondary" : "outline"}
            size="sm"
            onClick={handleDarkMode}
            className="mode-toggle-button cursor-pointer"
          >
            <Moon className="app-icon-sm mr-1" />
            Dark
          </Button>
        </div>
      </div>

      <Separator />

      {/* ── Import ──────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          onClick={onImportClick}
          className="w-full cursor-pointer"
        >
          <Upload className="app-icon-xs mr-1.5" />
          Import Theme
        </Button>
      </div>

      {/* Semantic color contract */}
      <Accordion
        type="multiple"
        className="w-full space-y-2"
      >
        {themeColorGroups.map((group) => {
          const colors = group.cssVars.flatMap((cssVar) => {
            const color = baseColors.find((item) => item.cssVar === cssVar);
            return color ? [color] : [];
          });
          if (colors.length === 0) return null;

          return (
            <AccordionItem
              key={group.id}
              value={group.id}
              className="overflow-hidden rounded-lg border border-border"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <span className="min-w-0 text-left">
                  <span className="block app-text-body">{group.label}</span>
                  <span className="mt-0.5 block app-text-micro font-normal text-muted-foreground">
                    {group.description}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 border-t border-border bg-muted/20 px-4 pb-4 pt-3">
                {colors.map((color) => (
                  <ColorPicker
                    key={color.cssVar}
                    label={color.name}
                    cssVar={color.cssVar}
                    value={brandColorsValues[color.cssVar] || ""}
                    onChange={handleColorChange}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Tweakcn */}
      <div className="p-4 bg-muted rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="app-icon-sm text-primary" />
          <span className="app-text-body">Advanced Customization</span>
        </div>
        <p className="app-text-caption text-muted-foreground">
          For advanced theme customization with real-time preview, visual color
          picker, and hundreds of prebuilt themes, visit{" "}
          <a
            href="https://tweakcn.com/editor/theme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline app-text-label cursor-pointer"
          >
            tweakcn.com
          </a>
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer"
          onClick={() =>
            typeof window !== "undefined" &&
            window.open("https://tweakcn.com/editor/theme", "_blank")
          }
        >
          <ExternalLink className="app-icon-xs mr-1.5" />
          Open Tweakcn
        </Button>
      </div>
    </div>
  );
}
