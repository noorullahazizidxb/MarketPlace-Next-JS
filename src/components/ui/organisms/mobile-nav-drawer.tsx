"use client";

import * as React from "react";
import { Drawer } from "vaul";
import { AnimatePresence, motion } from "@repo/hooks/motion";
import {
  TbGridDots,
  TbWorld,
  TbSearch,
  TbExternalLink,
} from "react-icons/tb";
import { cn } from "../lib/cn";
import { useIsMobile } from "@repo/hooks";
import { NavMain } from "../molecules/nav-main";
import type { SidebarNavGroup } from "./app-sidebar";
import { useSidebarOptional } from "../atoms/shadcn/sidebar";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Height of the always-visible toolbar strip in pixels (must fit the toolbar content) */
const TOOLBAR_SNAP = "56px";
/** Expanded snap point (fraction of viewport height) */
const EXPANDED_SNAP = 0.72;

type ExpandedPanel = "menu" | "language";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MobileNavLink {
  href: string;
  icon?: React.ReactNode;
  label: string;
  external?: boolean;
  onClick?: () => void;
}

export interface MobileNavDrawerProps {
  /** Nav links rendered in the drawer nav section */
  navLinks?: MobileNavLink[];
  /** Sidebar groups (renders the real sidebar menu/submenus when provided) */
  navGroups?: SidebarNavGroup[];
  /** Admin home url (used in Quick Links). Defaults to /admin/dashboard. */
  homeUrl?: string;
  /** Customer portal url (used in Quick Links). Defaults to /en. */
  customerPortalUrl?: string;
  /** Language switcher widget slot – rendered in its own section */
  languageSwitcherSlot?: React.ReactNode;
  /** Additional content appended after built-in sections */
  children?: React.ReactNode;
  /** LTR / RTL layout direction */
  direction?: "ltr" | "rtl";
  /** Called when the user taps the search pill in the toolbar */
  onSearchOpen?: () => void;
  /** Section labels */
  labels?: {
    quickLinks?: string;
    language?: string;
    more?: string;
  };
}

// ─── Ambient blob – pure CSS decoration ──────────────────────────────────────

function AmbientBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full opacity-20 blur-3xl",
        className,
      )}
    />
  );
}

// ─── Animated drag handle bar ─────────────────────────────────────────────────

function DragBar({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="flex items-center justify-center py-1.5">
      <motion.div
        animate={{ width: isExpanded ? 32 : 48, opacity: isExpanded ? 0.5 : 0.8 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="h-[5px] rounded-full bg-border"
      />
    </div>
  );
}

// ─── Toolbar quick-action pill ────────────────────────────────────────────────

function ToolbarPill({
  icon,
  label,
  onClick,
  accent,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  accent?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full",
        "ui-mobile-pill-height ui-mobile-pill-pad-x",
        "ui-typo-mobile-eyebrow admin-text-heading-sm tracking-wide",
        "whitespace-nowrap",
        "ring-1 transition-all duration-200 active:scale-95",
        "disabled:pointer-events-none disabled:opacity-50",
        accent
          ? "bg-primary text-primary-foreground ring-primary/40 shadow-md shadow-primary/20"
          : "bg-muted/70 text-muted-foreground ring-border/50 hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <span className="flex shrink-0 items-center justify-center admin-icon-sm [&_svg]:size-full">
        {icon}
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}

function QuickLinksShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "border border-border/50 bg-muted/25",
        "shadow-[0_8px_30px_-18px_hsl(var(--foreground)/0.35)]",
      )}
    >
      {/* Subtle algorithmic mesh: layered radial gradients (deterministic, token-based). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(120px 70px at 18% 18%, hsl(var(--primary) / 0.20), transparent 60%)," +
            "radial-gradient(160px 90px at 82% 32%, hsl(var(--primary) / 0.12), transparent 62%)," +
            "radial-gradient(200px 120px at 35% 92%, hsl(var(--foreground) / 0.06), transparent 70%)," +
            "radial-gradient(260px 150px at 90% 88%, hsl(var(--foreground) / 0.05), transparent 72%)",
        }}
      />
      <div className="relative p-3">{children}</div>
    </div>
  );
}

function QuickLinkCard({
  title,
  href,
  description,
  icon,
  external,
  onNavigate,
}: {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  external?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => onNavigate?.()}
      className={cn(
        "group relative flex min-w-0 items-center gap-3",
        "rounded-2xl px-3.5 py-3",
        "ring-1 ring-border/55",
        "bg-background/70 backdrop-blur-md",
        "transition-all duration-200",
        "hover:ring-primary/45 hover:shadow-lg hover:shadow-primary/10",
        "active:scale-[0.99]",
      )}
    >
      <span
        className={cn(
          "flex size-[length:var(--icon-lg)] shrink-0 items-center justify-center rounded-2xl",
          "bg-primary/10 text-primary ring-1 ring-primary/20",
          "transition-colors",
          "group-hover:bg-primary/14",
        )}
      >
        <span className="flex items-center justify-center admin-icon-sm text-primary [&_svg]:size-full">
          {icon}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate admin-typo-section-heading">
          {title}
        </span>
        <span className="block truncate admin-typo-filter-label text-muted-foreground">
          {description}
        </span>
      </span>
      {external ? (
        <TbExternalLink className="admin-icon-sm shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground" />
      ) : null}
    </a>
  );
}

// ─── Section header inside expanded drawer ────────────────────────────────────

function DrawerSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 px-1 ui-typo-mobile-eyebrow admin-text-heading uppercase tracking-[0.2em] text-muted-foreground/60">
      {children}
    </p>
  );
}

// ─── Nav link item in expanded drawer ────────────────────────────────────────

function DrawerNavItem({ href, icon, label, external, onClick }: MobileNavLink) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3",
        "rounded-2xl px-3.5 py-3",
        "ui-typo-mobile-nav-primary admin-text-label text-foreground",
        "bg-muted/40 ring-1 ring-border/40",
        "transition-all duration-200",
        "hover:bg-primary hover:text-primary-foreground hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/10",
        "active:scale-[0.98]",
      )}
    >
      {icon && (
        <span className={cn(
          "flex size-[length:var(--icon-lg)] shrink-0 items-center justify-center rounded-xl",
          "bg-background/80 ring-1 ring-border/40 text-muted-foreground",
          "transition-colors duration-200",
          "group-hover:bg-white/15 group-hover:text-primary-foreground group-hover:ring-white/20",
          "[&_svg]:admin-icon-sm",
        )}>
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {external && (
        <TbExternalLink className="admin-icon-xs shrink-0 opacity-40 group-hover:opacity-70" />
      )}
    </a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MobileNavDrawer({
  navLinks = [],
  navGroups,
  homeUrl = "/admin/dashboard",
  customerPortalUrl = "/en",
  languageSwitcherSlot,
  children,
  direction = "ltr",
  onSearchOpen,
  labels = {},
}: MobileNavDrawerProps) {
  const isMobile = useIsMobile();
  const sidebar = useSidebarOptional();
  const [activeSnap, setActiveSnap] = React.useState<number | string | null>(TOOLBAR_SNAP);
  const [expandedPanel, setExpandedPanel] = React.useState<ExpandedPanel>("menu");
  const [isSuppressedBySidebar, setIsSuppressedBySidebar] = React.useState(false);

  const isExpanded = activeSnap === EXPANDED_SNAP;

  // Create a stateful suppression flag: when the mobile sidebar sheet is open,
  // remove (unmount) the bottom drawer; when it closes, render it back.
  React.useEffect(() => {
    const next = Boolean(sidebar?.openMobile);
    setIsSuppressedBySidebar(next);

    if (next) {
      // Prevent lingering expanded overlay when we unmount.
      setActiveSnap(TOOLBAR_SNAP);
      setExpandedPanel("menu");
    }
  }, [sidebar?.openMobile]);

  const collapseToToolbar = React.useCallback(() => {
    setActiveSnap(TOOLBAR_SNAP);
    setExpandedPanel("menu");
  }, []);

  const openMenuPanel = React.useCallback(() => {
    setExpandedPanel("menu");
    setActiveSnap(EXPANDED_SNAP);
  }, []);

  const openLanguagePanel = React.useCallback(() => {
    setExpandedPanel("language");
    setActiveSnap(EXPANDED_SNAP);
  }, []);

  const handleOverlayClick = () => {
    if (isExpanded) collapseToToolbar();
  };

  const toggleMenuPanel = () => {
    if (isExpanded && expandedPanel === "menu") {
      collapseToToolbar();
      return;
    }
    openMenuPanel();
  };

  const toggleLanguagePanel = () => {
    if (isExpanded && expandedPanel === "language") {
      collapseToToolbar();
      return;
    }
    openLanguagePanel();
  };

  const handleSearch = () => {
    onSearchOpen?.();
    collapseToToolbar();
  };

  // Only render on mobile
  if (!isMobile) return null;
  if (isSuppressedBySidebar) return null;

  return (
    <Drawer.Root
      open
      dismissible={false}
      snapPoints={[TOOLBAR_SNAP, EXPANDED_SNAP]}
      activeSnapPoint={activeSnap}
      setActiveSnapPoint={setActiveSnap}
      // Keep Vaul in a stable mode. Toggling `modal` at runtime can trigger
      // hook-order issues in some versions.
      modal={false}
    >
      <Drawer.Portal>
        {/* ── Backdrop – only visible when expanded ── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOverlayClick}
              className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[3px]"
            />
          )}
        </AnimatePresence>

        {/* ── Drawer panel ── */}
        <Drawer.Content
          // vaul sets data-vaul-drawer-direction="bottom" automatically
          // Adding group/drawer-content enables the Tailwind group-data variant
          className={cn(
            "group/drawer-content",
            // Higher than common in-app floating toolbars (often z-50)
            "fixed bottom-0 left-0 right-0 z-[90]",
            "flex flex-col",
            "rounded-t-[22px] border-t border-border/40",
            // Glassmorphic surface
            "bg-background/96 backdrop-blur-2xl",
            "shadow-[0_-12px_60px_-8px_hsl(var(--foreground)/0.18),0_-4px_20px_-4px_hsl(var(--foreground)/0.08)]",
            "overflow-hidden",
          )}
          // Important: Vaul's snap-point translate math assumes the sheet is viewport-height.
          // If the content height collapses (e.g., only a 56px toolbar when not expanded),
          // Vaul can translate the entire sheet out of the viewport.
          style={{ height: "100svh" }}
          aria-label="Navigation menu"
        >
          {/* Radix Dialog accessibility: provide a Title/Description for screen readers */}
          <Drawer.Title className="sr-only">Mobile navigation menu</Drawer.Title>
          <Drawer.Description className="sr-only">
            Swipe up to open the menu, swipe down to collapse.
          </Drawer.Description>

          {/* ── Ambient decorative gradients ── */}
          <AmbientBlob className="left-1/4 top-0 h-52 w-52 -translate-y-1/2 bg-primary" />
          <AmbientBlob className="right-1/4 top-0 admin-hero-orb-sm -translate-y-1/2 bg-violet-500" />

          {/* ── Gesture handle + toolbar (always visible; supports drag gestures) ── */}
          <div className="relative z-[91]">
            {/*
              Marking this region as the drawer handle improves swipe/drag reliability
              on mobile (especially when the rest of the sheet contains scrollable content).
            */}
            <div
              data-vaul-drawer-handle
              className={cn(
                "select-none",
                "cursor-grab active:cursor-grabbing",
              )}
            >
              <DragBar isExpanded={isExpanded} />
            </div>
            {/* Toolbar content (buttons)  */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "flex w-full flex-nowrap items-center justify-center gap-x-2 px-4 pb-2",
                direction === "rtl" && "flex-row-reverse",
              )}
            >
              <ToolbarPill
                icon={<TbGridDots />}
                label="Menu"
                onClick={toggleMenuPanel}
                accent={isExpanded && expandedPanel === "menu"}
              />
              <ToolbarPill
                icon={<TbWorld />}
                label="Language"
                onClick={toggleLanguagePanel}
                disabled={!languageSwitcherSlot}
                accent={isExpanded && expandedPanel === "language"}
              />
              <ToolbarPill
                icon={<TbSearch />}
                label="Search"
                onClick={handleSearch}
                disabled={!onSearchOpen}
              />
            </motion.div>
          </div>

          {/* ── Expanded drawer content ── */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="expanded-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.05, duration: 0.2 } }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex-1 overflow-y-auto overscroll-contain",
                  "px-4 pb-20 pt-1",
                  direction === "rtl" && "text-right",
                )}
              >
                {/* Language switcher section */}
                {languageSwitcherSlot && expandedPanel === "language" && (
                  <section className="mb-5">
                    <div className="mb-2.5 flex items-center justify-between px-1">
                      <p className="ui-typo-mobile-eyebrow admin-text-heading uppercase tracking-[0.2em] text-muted-foreground/60">
                        {labels.language ?? "Language"}
                      </p>
                      <span className="admin-typo-filter-label text-muted-foreground/70">
                        Unified settings
                      </span>
                    </div>

                    <div
                      className={cn(
                        "relative overflow-hidden rounded-2xl",
                        "border border-border/50 bg-background/60",
                        "shadow-[0_16px_50px_-40px_hsl(var(--foreground)/0.35)]",
                      )}
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-60"
                        style={{
                          backgroundImage:
                            "radial-gradient(180px 120px at 20% 0%, hsl(var(--primary) / 0.16), transparent 65%)," +
                            "radial-gradient(220px 140px at 90% 40%, hsl(var(--foreground) / 0.06), transparent 70%)",
                        }}
                      />
                      <div className="relative p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="truncate admin-typo-section-heading">
                              Language management
                            </p>
                            <p className="truncate admin-typo-filter-label text-muted-foreground">
                              Choose your preferred interface language.
                            </p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 admin-typo-eyebrow text-primary ring-1 ring-primary/15">
                            Primary
                          </span>
                        </div>
                        <div className="rounded-xl bg-muted/30 p-2 ring-1 ring-border/40">
                          {languageSwitcherSlot}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Menu panel */}
                {expandedPanel === "menu" && (
                  <>
                    {/* Quick Links toolbar */}
                    <section className="mb-5">
                      <div className="mb-2.5 flex items-center justify-between px-1">
                        <p className="ui-typo-mobile-eyebrow admin-text-heading uppercase tracking-[0.2em] text-muted-foreground/60">
                          {labels.quickLinks ?? "Quick Links"}
                        </p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 admin-typo-eyebrow text-primary ring-1 ring-primary/15">
                          2
                        </span>
                      </div>
                      <QuickLinksShell>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <QuickLinkCard
                            title="Home Page"
                            href={homeUrl}
                            description="Back to dashboard"
                            icon={<TbGridDots />}
                            onNavigate={collapseToToolbar}
                          />
                          <QuickLinkCard
                            title="Customer Portal"
                            href={customerPortalUrl}
                            description="Open the customer experience"
                            icon={<TbExternalLink />}
                            external
                            onNavigate={collapseToToolbar}
                          />
                        </div>
                      </QuickLinksShell>
                    </section>

                    {/* Sidebar menus + submenus (preferred) */}
                    {navGroups && navGroups.length > 0 ? (
                      <section className="mb-5">
                        <DrawerSectionLabel>Menu</DrawerSectionLabel>
                        <div
                          className={cn(
                            "rounded-2xl border border-border/50 bg-background/40 p-2",
                            "shadow-[0_16px_50px_-40px_hsl(var(--foreground)/0.35)]",
                          )}
                        >
                          <div className="flex flex-col gap-2">
                            {navGroups.map((group) => (
                              <NavMain
                                key={group.label}
                                label={group.label}
                                items={group.items}
                                direction={direction}
                                forceExpanded
                              />
                            ))}
                          </div>
                        </div>
                      </section>
                    ) : null}

                    {/* Fallback: simple nav links */}
                    {(!navGroups || navGroups.length === 0) && navLinks.length > 0 ? (
                      <section className="mb-5">
                        <DrawerSectionLabel>Menu</DrawerSectionLabel>
                        <div className="flex flex-col gap-2">
                          {navLinks.map((link) => (
                            <DrawerNavItem key={link.href} {...link} />
                          ))}
                        </div>
                      </section>
                    ) : null}
                  </>
                )}

                {/* Extra slot */}
                {children && expandedPanel === "menu" && (
                  <section className="mb-5">
                    {labels.more && (
                      <DrawerSectionLabel>{labels.more}</DrawerSectionLabel>
                    )}
                    {children}
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// ─── Convenience sub-components (kept for backward compat) ───────────────────

export function MobileDrawerSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-5", className)}>
      {title && (
        <p className="mb-2 px-1 ui-typo-mobile-eyebrow admin-text-caption uppercase tracking-widest text-muted-foreground/70">
          {title}
        </p>
      )}
      {children}
    </section>
  );
}

export function MobileDrawerNavLink({
  href,
  icon,
  label,
  external,
  onClick,
}: {
  href: string;
  icon?: React.ReactNode;
  label: string;
  external?: boolean;
  onClick?: () => void;
}) {
  return (
    <DrawerNavItem href={href} icon={icon} label={label} external={external} onClick={onClick} />
  );
}
