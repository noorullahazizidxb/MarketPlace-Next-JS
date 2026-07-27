"use client";
import React from "react";
import { Palette, Dices, Upload, ExternalLink, Sun, Moon } from "lucide-react";
import { Button } from "../../atoms/shadcn/button";
import { Label } from "../../atoms/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/shadcn/select";
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
} from "@repo/constants";
import { ColorPicker } from "../../molecules/color-picker";
import type { ImportedTheme, ColorTheme } from "@repo/types";
// Circular transition CSS is imported globally by the host app (apps/admin/app/globals.css)
// to avoid global CSS imports inside component modules. Do not import it here.


import { useThemeManager, useCircularTransition } from "@repo/hooks";

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
          className="admin-icon-xs rounded-full border border-border/20 flex-shrink-0"
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
    applyTheme,
    applyTweakcnTheme,
    applyRadius,
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
    applyTheme(randomTheme.value, isDarkMode);
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
    applyTweakcnTheme(randomTheme.preset, isDarkMode);
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
    applyTweakcnTheme(randomTheme.preset, isDarkMode);
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
    applyTweakcnTheme(randomTheme.preset, isDarkMode);
  };

  const handleRadiusSelect = (radius: string) => {
    setSelectedRadius(radius);
    applyRadius(radius);
  };

  const handleLightMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDarkMode === false) return;
    toggleTheme(event);
  };

  const handleDarkMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDarkMode === true) return;
    toggleTheme(event);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Shadcn UI Theme Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="admin-text-body">Shadcn UI Theme Presets</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomShadcn}
            className="cursor-pointer"
          >
            <Dices className="admin-icon-xs mr-1.5" />
            Random
          </Button>
        </div>

        <Select
          value={selectedTheme}
          onValueChange={(value) => {
            setSelectedTheme(value);
            setSelectedTweakcnTheme(""); // Clear tweakcn selection
            setSelectedBrandTheme("");   // Clear brand selection
            setSelectedSidebarTheme(""); // Clear sidebar selection
            setBrandColorsValues({}); // Clear brand colors state
            setImportedTheme(null); // Clear imported theme
            applyTheme(value, isDarkMode);
          }}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Choose Shadcn Theme" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <div className="p-2">
              {colorThemes.map((theme) => (
                <SelectItem
                  key={theme.value}
                  value={theme.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ThemePreviewSwatches styles={theme.preset.styles.light} />
                    <span>{theme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Tweakcn Theme Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="admin-text-body">Tweakcn Theme Presets</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomTweakcn}
            className="cursor-pointer"
          >
            <Dices className="admin-icon-xs mr-1.5" />
            Random
          </Button>
        </div>

        <Select
          value={selectedTweakcnTheme}
          onValueChange={(value) => {
            setSelectedTweakcnTheme(value);
            setSelectedTheme("");         // Clear shadcn selection
            setSelectedBrandTheme("");    // Clear brand selection
            setSelectedSidebarTheme(""); // Clear sidebar selection
            setBrandColorsValues({}); // Clear brand colors state
            setImportedTheme(null); // Clear imported theme
            const selectedPreset = tweakcnThemes.find(
              (t) => t.value === value,
            )?.preset;
            if (selectedPreset) {
              applyTweakcnTheme(selectedPreset, isDarkMode);
            }
          }}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Choose Tweakcn Theme" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <div className="p-2">
              {tweakcnThemes.map((theme) => (
                <SelectItem
                  key={theme.value}
                  value={theme.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ThemePreviewSwatches styles={theme.preset.styles.light} />
                    <span>{theme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Brand Theme Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="admin-text-body">Brand Theme Presets</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomBrand}
            className="cursor-pointer"
          >
            <Dices className="admin-icon-xs mr-1.5" />
            Random
          </Button>
        </div>

        <Select
          value={selectedBrandTheme}
          onValueChange={(value) => {
            setSelectedBrandTheme(value);
            setSelectedTheme("");
            setSelectedTweakcnTheme("");
            setSelectedSidebarTheme("");
            setBrandColorsValues({});
            setImportedTheme(null);
            const selectedPreset = brandThemes.find(
              (t) => t.value === value,
            )?.preset;
            if (selectedPreset) {
              applyTweakcnTheme(selectedPreset, isDarkMode);
            }
          }}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Choose Brand Theme" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <div className="p-2">
              {brandThemes.map((theme) => (
                <SelectItem
                  key={theme.value}
                  value={theme.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ThemePreviewSwatches styles={theme.preset.styles.light} />
                    <span>{theme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Sidebar Theme Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="admin-text-body">Sidebar Theme Presets</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomSidebar}
            className="cursor-pointer"
          >
            <Dices className="admin-icon-xs mr-1.5" />
            Random
          </Button>
        </div>

        <Select
          value={selectedSidebarTheme}
          onValueChange={(value) => {
            setSelectedSidebarTheme(value);
            setSelectedTheme("");
            setSelectedTweakcnTheme("");
            setSelectedBrandTheme("");
            setBrandColorsValues({});
            setImportedTheme(null);
            const selectedPreset = sidebarThemes.find(
              (t) => t.value === value,
            )?.preset;
            if (selectedPreset) {
              applyTweakcnTheme(selectedPreset, isDarkMode);
            }
          }}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Choose Sidebar Theme" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <div className="p-2">
              {sidebarThemes.map((theme) => (
                <SelectItem
                  key={theme.value}
                  value={theme.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ThemePreviewSwatches styles={theme.preset.styles.light} />
                    <span>{theme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Radius Selection */}
      <div className="space-y-3">
        <Label className="admin-text-body">Radius</Label>
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
                <div className="admin-text-caption">{option.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Mode Section */}
      <div className="space-y-3">
        <Label className="admin-text-body">Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={!isDarkMode ? "secondary" : "outline"}
            size="sm"
            onClick={handleLightMode}
            className="mode-toggle-button cursor-pointer"
          >
            <Sun className="admin-icon-sm mr-1" />
            Light
          </Button>
          <Button
            variant={isDarkMode ? "secondary" : "outline"}
            size="sm"
            onClick={handleDarkMode}
            className="mode-toggle-button cursor-pointer"
          >
            <Moon className="admin-icon-sm mr-1" />
            Dark
          </Button>
        </div>
      </div>

      <Separator />

      {/* Import Theme Button */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          onClick={onImportClick}
          className="w-full cursor-pointer"
        >
          <Upload className="admin-icon-xs mr-1.5" />
          Import Theme
        </Button>
      </div>

      {/* Brand Colors Section */}
      <Accordion
        type="single"
        collapsible
        className="w-full border-b rounded-lg"
      >
        <AccordionItem
          value="brand-colors"
          className="border border-border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
            <Label className="admin-text-body cursor-pointer">
              Brand Colors
            </Label>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-3 border-t border-border bg-muted/20">
            {baseColors.map((color) => (
              <div
                key={color.cssVar}
                className="flex items-center justify-between"
              >
                <ColorPicker
                  label={color.name}
                  cssVar={color.cssVar}
                  value={brandColorsValues[color.cssVar] || ""}
                  onChange={handleColorChange}
                />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Tweakcn */}
      <div className="p-4 bg-muted rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="admin-icon-sm text-primary" />
          <span className="admin-text-body">Advanced Customization</span>
        </div>
        <p className="admin-text-caption text-muted-foreground">
          For advanced theme customization with real-time preview, visual color
          picker, and hundreds of prebuilt themes, visit{" "}
          <a
            href="https://tweakcn.com/editor/theme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline admin-text-label cursor-pointer"
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
          <ExternalLink className="admin-icon-xs mr-1.5" />
          Open Tweakcn
        </Button>
      </div>
    </div>
  );
}
