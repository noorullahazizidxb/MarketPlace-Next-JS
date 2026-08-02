"use client";

import * as React from "react";
import { AppSidebar } from "../organisms/app-sidebar";
import { SiteHeader } from "../organisms/site-header";
import { SiteFooter } from "../organisms/site-footer";
import { cn } from "../lib/cn";
import {
  ThemeCustomizer,
  ThemeCustomizerTrigger,
} from "../organisms/theme-customizer";
import { SidebarConfigProvider, useSidebarConfig } from "@repo/hooks";
import { SidebarInset, SidebarProvider } from "../atoms/shadcn/sidebar";
import { sidebarWidthValues } from "@repo/constants";

interface BaseLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  navGroups?: React.ComponentProps<typeof AppSidebar>["navGroups"];
  user?: React.ComponentProps<typeof AppSidebar>["user"];
  onLogout?: React.ComponentProps<typeof AppSidebar>["onLogout"];
  homeUrl?: string;
  headerRightSlot?: React.ReactNode;
  /**
   * Language switcher / extra content inside the mobile bottom-sheet drawer.
   * Visible only on mobile (< sm breakpoint).
   */
  mobileHeaderSlot?: React.ReactNode;
  /**
   * Compact wallet widget shown in the mobile header (alongside theme toggle).
   * On desktop this slot is hidden – the full wallet lives in headerRightSlot.
   */
  mobileWalletSlot?: React.ReactNode;
  headerLabels?: React.ComponentProps<typeof SiteHeader>["labels"];
  footerContent?: React.ComponentProps<typeof SiteFooter>["content"];
  sidebarBrandSubtitle?: string;
  userMenuLabels?: React.ComponentProps<typeof AppSidebar>["userMenuLabels"];
  direction?: "ltr" | "rtl";
  /** When false, hides the floating theme customizer trigger and sheet. */
  showThemeCustomizer?: boolean;
}

function AdminBaseLayoutInner({
  children,
  title,
  description,
  navGroups,
  user,
  onLogout,
  homeUrl,
  headerRightSlot,
  mobileHeaderSlot,
  mobileWalletSlot,
  headerLabels,
  footerContent,
  sidebarBrandSubtitle,
  userMenuLabels,
  direction = "ltr",
  showThemeCustomizer = false,
}: BaseLayoutProps) {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false);
  // All layout state (config, effectiveSide, direction) is centralized in SidebarConfigProvider.
  // We sync the incoming `direction` prop into the context whenever it changes so
  // LayoutTab, ThemeCustomizer, and any other consumer always sees the current direction.
  const { config, effectiveSide, setDirection } = useSidebarConfig();

  React.useEffect(() => {
    setDirection(direction);
  }, [direction, setDirection]);

  React.useEffect(() => {
    if (!showThemeCustomizer) {
      setThemeCustomizerOpen(false);
    }
  }, [showThemeCustomizer]);

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
      className={cn(
        config.collapsible === "none" && "sidebar-none-mode",
      )}
    >
      <AppSidebar
        variant={config.variant}
        collapsible={config.collapsible}
        side={effectiveSide}
        navGroups={navGroups}
        user={user}
        onLogout={onLogout}
        homeUrl={homeUrl}
        brandSubtitle={sidebarBrandSubtitle}
        userMenuLabels={userMenuLabels}
        direction={direction}
      />
      <SidebarInset>
        <SiteHeader
          rightSlot={headerRightSlot}
          mobileMenuSlot={mobileHeaderSlot}
          mobileWalletSlot={mobileWalletSlot}
          navGroups={navGroups}
          homeUrl={homeUrl}
          labels={headerLabels}
          direction={direction}
        />
        <div className="flex flex-1 flex-col">
            <div className="app-shell @container/main flex flex-1 flex-col gap-[var(--space-gap)]">
              {/* Add space so content isn't hidden behind the persistent mobile drawer toolbar. */}
            <div className="flex flex-col gap-[var(--space-section)] py-[var(--space-page-y)] pb-[calc(var(--space-section)+4rem)] md:pb-[var(--space-page-y)]">
              {title && (
                <div className="px-[var(--space-page-x)]">
                  <div className="flex flex-col gap-[var(--space-gap)]">
                    <h1 className="app-text-heading tracking-tight">{title}</h1>
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
        <SiteFooter content={footerContent} />
      </SidebarInset>

      {/* Theme Customizer — managers, admins, super admins, and system account owner */}
      {showThemeCustomizer ? (
        <>
          <ThemeCustomizerTrigger
            onClick={() => setThemeCustomizerOpen(true)}
            sideOverride={effectiveSide}
          />
          <ThemeCustomizer
            open={themeCustomizerOpen}
            onOpenChange={setThemeCustomizerOpen}
            sideOverride={effectiveSide === "left" ? "right" : "left"}
          />
        </>
      ) : null}
    </SidebarProvider>
  );
}

export function AdminBaseLayout(props: BaseLayoutProps) {
  return (
    <SidebarConfigProvider initialDirection={props.direction ?? "ltr"}>
      <AdminBaseLayoutInner {...props} />
    </SidebarConfigProvider>
  );
}
