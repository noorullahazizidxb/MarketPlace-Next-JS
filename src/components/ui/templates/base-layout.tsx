"use client";

import * as React from "react";
import { AppSidebar } from "../organisms/app-sidebar";
import { SiteHeader } from "../organisms/site-header";
import { SiteFooter } from "../organisms/site-footer";
import {
  ThemeCustomizer,
  ThemeCustomizerTrigger,
} from "../organisms/theme-customizer";
import { UpgradeToProButton } from "../molecules/upgrade-to-pro-button";
import { useSidebarConfig } from "@repo/hooks";
import { SidebarInset, SidebarProvider } from "../atoms/shadcn/sidebar";
import { sidebarWidthValues } from "@repo/constants";

interface BaseLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function BaseLayout({ children, title, description }: BaseLayoutProps) {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false);
  const { config } = useSidebarConfig();

  const sidebarWidth =
    sidebarWidthValues[config.width] ?? sidebarWidthValues.comfortable;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--sidebar-width-icon": "3rem",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
      className={config.collapsible === "none" ? "sidebar-none-mode" : ""}
    >
      {config.side === "left" ? (
        <>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="app-shell @container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {title && (
                    <div className="px-4 lg:px-6">
                      <div className="flex flex-col gap-2">
                        <h1 className=" app-text-heading tracking-tight">{title}</h1>
                        {description && (
                          <p className="text-muted-foreground">{description}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {children}
                </div>
              </div>
            </div>
            <SiteFooter />
          </SidebarInset>
        </>
      ) : (
        <>
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="app-shell @container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {title && (
                    <div className="px-4 lg:px-6">
                      <div className="flex flex-col gap-2">
                        <h1 className=" app-text-heading tracking-tight">{title}</h1>
                        {description && (
                          <p className="text-muted-foreground">{description}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {children}
                </div>
              </div>
            </div>
            <SiteFooter />
          </SidebarInset>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
        </>
      )}

      {/* Theme Customizer */}
      <ThemeCustomizerTrigger onClick={() => setThemeCustomizerOpen(true)} />
      <ThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />
    </SidebarProvider>
  );
}
