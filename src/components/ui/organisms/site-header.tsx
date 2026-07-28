"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "../atoms/shadcn/button";
import { Separator } from "../atoms/shadcn/separator";
import { SidebarTrigger } from "../atoms/shadcn/sidebar";
import { ThemeModeToggle } from "../atoms/shadcn/theme-toggle";
import { cn } from "../lib/cn";
import {
  CommandSearch,
  SearchTrigger,
  type CommandSearchLabels,
} from "../molecules/command-search";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import type { SidebarNavGroup } from "./app-sidebar";

interface SiteHeaderProps {
  rightSlot?: React.ReactNode;
  direction?: "ltr" | "rtl";
  /** Sidebar groups to render inside the mobile bottom drawer (Menu panel). */
  navGroups?: SidebarNavGroup[];
  /** Home url for the drawer Quick Links (defaults inside MobileNavDrawer). */
  homeUrl?: string;
  /** Customer portal url for the drawer Quick Links (defaults inside MobileNavDrawer). */
  customerPortalUrl?: string;
  /**
   * Language switcher slot rendered inside the mobile drawer.
   */
  mobileMenuSlot?: React.ReactNode;
  /**
   * Compact wallet widget shown in the mobile header (next to theme toggle).
   */
  mobileWalletSlot?: React.ReactNode;
  labels?: {
    blocks: string;
    landingPage: string;
    github: string;
    toggleSidebar: string;
    search: CommandSearchLabels;
    themeToggle: {
      toggleToLight: string;
      toggleToDark: string;
    };
    /** Mobile drawer labels (all optional – fall back to English defaults) */
    mobile?: {
      openMenu?: string;
      closeMenu?: string;
      quickLinks?: string;
      more?: string;
    };
  };
}

const defaultLabels = {
  blocks: "Blocks",
  landingPage: "Landing Page",
  github: "GitHub",
  toggleSidebar: "Toggle Sidebar",
  search: {
    dialogTitle: "Command Search",
    placeholder: "What do you need?",
    empty: "No results found.",
    trigger: "Search...",
    groups: {
      dashboards: "Dashboards",
      apps: "Apps",
      authPages: "Auth Pages",
      errors: "Errors",
      settings: "Settings",
      pages: "Pages",
    },
    items: {
      dashboard1: "Dashboard 1",
      dashboard2: "Dashboard 2",
      mail: "Mail",
      tasks: "Tasks",
      chat: "Chat",
      calendar: "Calendar",
      signIn1: "Sign In 1",
      signIn2: "Sign In 2",
      signUp1: "Sign Up 1",
      signUp2: "Sign Up 2",
      forgotPassword1: "Forgot Password 1",
      forgotPassword2: "Forgot Password 2",
      unauthorized: "Unauthorized",
      forbidden: "Forbidden",
      notFound: "Not Found",
      internalServerError: "Internal Server Error",
      underMaintenance: "Under Maintenance",
      userSettings: "User Settings",
      accountSettings: "Account Settings",
      billing: "Plans & Billing",
      appearance: "Appearance",
      notifications: "Notifications",
      connections: "Connections",
      faqs: "FAQs",
      pricing: "Pricing",
    },
  },
  themeToggle: {
    toggleToLight: "Switch to light mode",
    toggleToDark: "Switch to dark mode",
  },
};

export function SiteHeader({
  rightSlot,
  mobileMenuSlot,
  mobileWalletSlot,
  navGroups,
  homeUrl,
  customerPortalUrl,
  labels = defaultLabels,
  direction = "ltr",
}: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-[length:var(--space-page-x)] py-3 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ms-1" label={labels.toggleSidebar} />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1 max-w-sm">
            <SearchTrigger
              onClick={() => setSearchOpen(true)}
              label={labels.search.trigger}
            />
          </div>

          <div
            className={cn(
              "flex items-center gap-2",
              direction === "rtl" ? "me-auto" : "ms-auto",
            )}
          >
            {/* ── Desktop-only nav links ────────────────────────────── */}
            <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
              <a href="/listings" className="dark:text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="app-icon-sm" aria-hidden="true" />
                  <span>Listings</span>
                </span>
              </a>
            </Button>

            {/* ── Desktop right slot (wallet + language) ────────────── */}
            {rightSlot && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-1 data-[orientation=vertical]:h-5 hidden sm:block"
                />
                <div className="hidden sm:flex items-center gap-2">{rightSlot}</div>
              </>
            )}

            {/* ── Mobile: compact wallet + theme toggle ─────────────── */}
            {mobileWalletSlot && (
              <div className="flex items-center gap-1 sm:hidden">
                {mobileWalletSlot}
              </div>
            )}

            {/* ── Theme toggle (always visible) ─────────────────────── */}
            <ThemeModeToggle variant="ghost" labels={labels.themeToggle} />
          </div>
        </div>
      </header>

      {/* ── Persistent mobile bottom drawer (self-managed, mobile-only) ── */}
      <MobileNavDrawer
        direction={direction}
        onSearchOpen={() => setSearchOpen(true)}
        navGroups={navGroups}
        homeUrl={homeUrl}
        customerPortalUrl={customerPortalUrl}
        languageSwitcherSlot={mobileMenuSlot}
        labels={{
          quickLinks: labels.mobile?.quickLinks,
          language: "Language",
          more: labels.mobile?.more,
        }}
      />

      <CommandSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        labels={labels.search}
        navGroups={navGroups}
      />
    </>
  );
}
