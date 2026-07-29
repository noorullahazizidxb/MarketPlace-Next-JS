"use client";

import React from "react";
import { Layout, Palette, RotateCcw, Settings, X } from "lucide-react";
import { Button } from "../../atoms/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../atoms/shadcn/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../atoms/shadcn/tabs";
import { useIsMobile, useSidebarConfig, useTheme } from "@repo/hooks";
import {
  defaultSidebarSettings,
  defaultThemeSettings,
} from "@repo/constants";
import { ThemeTab } from "./theme-tab";
import { LayoutTab } from "./layout-tab";
import { ImportModal } from "./import-modal";
import { cn } from "../../lib/cn";
import type { ImportedTheme } from "@repo/types";

export interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sideOverride?: "left" | "right";
  /**
   * auto: bottom sheet on mobile, side sheet from sm and up.
   * side | bottom: force presentation (e.g. embed mobile-only surface).
   */
  layout?: "auto" | "side" | "bottom";
}

export function ThemeCustomizer({
  open,
  onOpenChange,
  sideOverride,
  layout = "auto",
}: ThemeCustomizerProps) {
  const { themeSettings, updateThemeSettings } = useTheme();
  const { config: sidebarConfig, updateConfig: updateSidebarConfig } =
    useSidebarConfig();
  const isMobile = useIsMobile();
  const sheetPresentation =
    layout === "auto" ? (isMobile ? "bottom" : "side") : layout;

  const [activeTab, setActiveTab] = React.useState("theme");
  const [importModalOpen, setImportModalOpen] = React.useState(false);
  const selectedTheme = themeSettings.selectedTheme;
  const selectedTweakcnTheme = themeSettings.selectedTweakcnTheme;
  const selectedBrandTheme = themeSettings.selectedBrandTheme;
  const selectedSidebarTheme = themeSettings.selectedSidebarTheme;
  const selectedRadius = themeSettings.selectedRadius;

  const handleReset = () => {
    updateThemeSettings(defaultThemeSettings);
    updateSidebarConfig(defaultSidebarSettings);
  };

  const handleImport = (themeData: ImportedTheme) => {
    updateThemeSettings({
      importedTheme: themeData,
      selectedTheme: "",
      selectedTweakcnTheme: "",
      selectedBrandTheme: "",
      selectedSidebarTheme: "",
    });
  };

  const handleImportClick = () => {
    setImportModalOpen(true);
  };

  // NOTE: Dark mode re-application is intentionally handled exclusively by
  // ThemeProvider's useLayoutEffect (packages/hooks/src/theme/context/theme-context.tsx).
  // That function applies the preset CSS variables and then re-applies brandColors
  // on top, preserving any user-customised overrides. A previous useEffect here
  // was calling applyTheme/applyTweakcnTheme on every mount and dark-mode toggle,
  // which internally called updateBrandColorsFromTheme → overwrote brandColors in
  // state → patched ui-context.json with preset colors → lost user customisations.

  const edgeSide = sideOverride ?? (sidebarConfig.side === "left" ? "right" : "left");

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent
          side={sheetPresentation === "bottom" ? "bottom" : edgeSide}
          className={cn(
            "flex flex-col gap-0 overflow-hidden p-0 pointer-events-auto [&>button]:hidden",
            sheetPresentation === "bottom"
              ? "h-auto max-h-[min(88dvh,36rem)] w-full max-w-[100vw] rounded-t-[22px] border-x-0 border-b-0"
              : "h-full w-[min(100%,25rem)] max-w-[100vw]",
          )}
          onInteractOutside={(e) => {
            // Prevent the sheet from closing when dialog is open
            if (importModalOpen) {
              e.preventDefault();
            }
          }}
        >
          <SheetHeader
            className={cn(
              "space-y-0 p-4 pb-2",
              sheetPresentation === "bottom" && "shrink-0 border-b border-border/40",
            )}
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Settings className="app-icon-sm" />
              </div>
              <SheetTitle className="app-typo-section-heading">
                Customizer
              </SheetTitle>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="cursor-pointer min-h-[var(--ctrl-h-sm)] min-w-[var(--ctrl-h-sm)]"
                >
                  <RotateCcw className="app-icon-sm" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="cursor-pointer min-h-[var(--ctrl-h-sm)] min-w-[var(--ctrl-h-sm)]"
                >
                  <X className="app-icon-sm" />
                </Button>
              </div>
            </div>
            <SheetDescription className="app-typo-filter-label text-muted-foreground sr-only">
              Customize the them and layout of your dashboard.
            </SheetDescription>
          </SheetHeader>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto",
              sheetPresentation === "bottom" && "overscroll-contain",
            )}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex h-full min-h-0 flex-col"
            >
              <div className={cn("py-2", sheetPresentation === "bottom" && "py-1.5")}>
                <TabsList
                  className={cn(
                    "grid w-full grid-cols-2 rounded-none p-1.5",
                    sheetPresentation === "bottom" ? "min-h-[var(--ctrl-h)]" : "min-h-[var(--ctrl-h)]",
                  )}
                >
                  <TabsTrigger
                    value="theme"
                    className="cursor-pointer data-[state=active]:bg-background"
                  >
                    <Palette className="app-icon-sm mr-1" /> Theme
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="cursor-pointer data-[state=active]:bg-background"
                  >
                    <Layout className="app-icon-sm mr-1" /> Layout
                  </TabsTrigger>
                </TabsList>
                {/* <TabsList className="grid w-full grid-cols-2 rounded-none min-h-[var(--ctrl-h)] p-1.5">
                  <TabsTrigger value="theme" className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Palette className="app-icon-sm mr-1" /> Theme</TabsTrigger>
                  <TabsTrigger value="layout" className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Layout className="app-icon-sm mr-1" /> Layout</TabsTrigger>
                </TabsList> */}
              </div>

              <TabsContent value="theme" className="flex-1 mt-0">
                <ThemeTab
                  selectedTheme={selectedTheme}
                  setSelectedTheme={(value) =>
                    updateThemeSettings({ selectedTheme: value })
                  }
                  selectedTweakcnTheme={selectedTweakcnTheme}
                  setSelectedTweakcnTheme={(value) =>
                    updateThemeSettings({ selectedTweakcnTheme: value })
                  } selectedBrandTheme={selectedBrandTheme}
                  setSelectedBrandTheme={(theme) =>
                    updateThemeSettings({ selectedBrandTheme: theme })
                  }
                  selectedSidebarTheme={selectedSidebarTheme}
                  setSelectedSidebarTheme={(theme) =>
                    updateThemeSettings({ selectedSidebarTheme: theme })
                  } selectedRadius={selectedRadius}
                  setSelectedRadius={(value) =>
                    updateThemeSettings({ selectedRadius: value })
                  }
                  setImportedTheme={(value) =>
                    updateThemeSettings({ importedTheme: value })
                  }
                  onImportClick={handleImportClick}
                />
              </TabsContent>

              <TabsContent value="layout" className="flex-1 mt-0">
                <LayoutTab />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      <ImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImport}
      />
    </>
  );
}

// Floating trigger button - positioned dynamically based on sidebar side
export function ThemeCustomizerTrigger({
  onClick,
  sideOverride,
}: {
  onClick: () => void;
  sideOverride?: "left" | "right";
}) {
  const { config: sidebarConfig } = useSidebarConfig();
  const side = sideOverride ?? sidebarConfig.side;

  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed top-1/2 -translate-y-1/2 min-h-[var(--ctrl-h)] min-w-[var(--ctrl-h)] rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer",
        side === "left" ? "right-4" : "left-4",
      )}
    >
      <Settings className="app-icon-md" />
    </Button>
  );
}
