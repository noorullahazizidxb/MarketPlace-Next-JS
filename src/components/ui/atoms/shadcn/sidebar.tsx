"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "@repo/hooks";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { motion, AnimatePresence } from "@repo/hooks/motion";

// ── Constants ─────────────────────────────────────────────────────────────────

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// ── Context ───────────────────────────────────────────────────────────────────

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.");
  return ctx;
}

/**
 * Like `useSidebar`, but returns `null` when used outside `SidebarProvider`.
 * Useful for optional integrations (e.g., hiding other mobile UI while the sheet is open).
 */
function useSidebarOptional() {
  return React.useContext(SidebarContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean | ((v: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value;
      if (setOpenProp) setOpenProp(next);
      else _setOpen(next);
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [open, setOpenProp],
  );

  const toggleSidebar = React.useCallback(
    () => (isMobile ? setOpenMobile((v) => !v) : setOpen((v) => !v)),
    [isMobile, setOpen],
  );

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    if (typeof window !== "undefined") window.addEventListener("keydown", handler);
    return () => { if (typeof window !== "undefined") window.removeEventListener("keydown", handler); };
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const ctx = React.useMemo<SidebarContextProps>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={ctx}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style } as React.CSSProperties}
          className={cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn("group peer text-sidebar-foreground hidden md:block", side === "right" && "md:order-2")}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Gap spacer */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[side=right]:w-0 group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      {/* Container */}
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            "bg-sidebar flex h-full w-full flex-col",
            // Floating/inset: add border, rounded corners, subtle shadow
            "group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:rounded-2xl group-data-[variant=floating]:border group-data-[variant=floating]:shadow-md",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Trigger ───────────────────────────────────────────────────────────────────

function SidebarTrigger({
  className,
  onClick,
  label = "Toggle Sidebar",
  ...props
}: React.ComponentProps<typeof Button> & { label?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-[var(--ctrl-h-sm,1.75rem)] rounded-lg", className)}
      onClick={(e) => { onClick?.(e); toggleSidebar(); }}
      {...props}
    >
      <PanelLeftIcon className="size-[var(--icon-sm,1rem)]" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

// ── Rail ──────────────────────────────────────────────────────────────────────

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear",
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

// ── Inset ─────────────────────────────────────────────────────────────────────

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex min-w-0 flex-1 flex-col",
        "md:peer-data-[side=right]:ms-(--sidebar-width)",
        "md:peer-data-[side=right]:peer-data-[collapsible=offcanvas]:ms-0",
        "md:peer-data-[side=right]:peer-data-[collapsible=icon]:ms-(--sidebar-width-icon)",
        "md:peer-data-[variant=inset]:mx-2 md:peer-data-[variant=inset]:my-2 md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:shadow-sm",
        "md:peer-data-[variant=inset]:peer-data-[side=left]:ms-0",
        "md:peer-data-[variant=inset]:peer-data-[side=right]:me-0",
        "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:peer-data-[side=left]:ms-2",
        "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:peer-data-[side=right]:me-2",
        className,
      )}
      {...props}
    />
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background min-h-[var(--ctrl-h-sm)] w-full rounded-lg shadow-none border-border/50", className)}
      {...props}
    />
  );
}

// ── Structural slots ──────────────────────────────────────────────────────────

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-header" data-sidebar="header"
      className={cn("flex flex-col gap-2 p-3", className)} {...props} />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-footer" data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-3 [&>[data-slot=card]]:group-data-[collapsible=icon]:hidden", className)} {...props} />
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator data-slot="sidebar-separator" data-sidebar="separator"
      className={cn("bg-sidebar-border/60 mx-2 w-auto", className)} {...props} />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-content" data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-1.5 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)} {...props} />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  const [isOpen, setIsOpen] = React.useState(true);
  const contextValue = React.useMemo(() => ({ isOpen, setIsOpen }), [isOpen]);

  return (
    <SidebarGroupContext.Provider value={contextValue}>
      <div data-slot="sidebar-group" data-sidebar="group"
        className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />
    </SidebarGroupContext.Provider>
  );
}

const SidebarGroupContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

function useSidebarGroupContext() {
  const context = React.useContext(SidebarGroupContext);
  if (!context) {
    throw new Error("useSidebarGroupContext must be used within a SidebarGroup");
  }
  return context;
}

function SidebarGroupLabel({
  className, asChild = false, style, ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/60 ring-sidebar-ring flex shrink-0 items-center rounded-lg px-2 app-text-caption uppercase tracking-wider outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2",
        "h-[var(--ctrl-h-sm,1.75rem)] text-[var(--sb-text-label,0.75rem)]",
        "[&>svg]:size-[var(--icon-sm,1rem)] [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className, asChild = false, ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  const { setIsOpen } = useSidebarGroupContext();
  return (
    <Comp
      onClick={() => setIsOpen(prev => !prev)}
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "absolute top-3.5 end-3 flex aspect-square w-5 items-center justify-center",
        "rounded-lg p-0 outline-hidden transition-transform focus-visible:ring-2",
        "[&>svg]:app-icon-sm [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  const { isOpen } = useSidebarGroupContext();
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div data-slot="sidebar-group-content" data-sidebar="group-content"
            className={cn("w-full pt-1", className)}
            {...props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="sidebar-menu" data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-0.5", className)} {...props} />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="sidebar-menu-item" data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)} {...props} />
  );
}

// ── MenuButton ────────────────────────────────────────────────────────────────

const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-xl p-2 text-start outline-hidden",
    "ring-sidebar-ring transition-all duration-150 ease-in-out",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
    "disabled:pointer-events-none disabled:opacity-50",
    "group-has-data-[sidebar=menu-action]/menu-item:pr-8",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // Active: brand-tinted background + medium weight
    "data-[active=true]:bg-sidebar-accent data-[active=true]:app-text-heading-sm data-[active=true]:text-sidebar-accent-foreground",
    "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
    "group-data-[collapsible=icon]:size-[var(--ctrl-h,2rem)]! group-data-[collapsible=icon]:p-2!",
    "text-[var(--sb-text-item,0.875rem)]",
    "[&>span:last-child]:truncate [&>svg]:size-[var(--icon-sm,1rem)] [&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        brand:
          "text-foreground hover:bg-primary/10 data-[active=true]:brand-gradient data-[active=true]:hover-gradient data-[active=true]:brand-glow data-[active=true]:text-brand-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "min-h-[var(--ctrl-h,2rem)]",
        sm: "min-h-[var(--ctrl-h-sm,1.75rem)]",
        lg: "min-h-[var(--ctrl-h,2.5rem)] group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  style,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      style={style}
      {...props}
    />
  );

  if (!tooltip) return button;
  if (typeof tooltip === "string") tooltip = { children: tooltip };

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
}

// ── MenuAction ────────────────────────────────────────────────────────────────

function SidebarMenuAction({
  className, asChild = false, showOnHover = false, ...props
}: React.ComponentProps<"button"> & { asChild?: boolean; showOnHover?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground",
        "absolute top-1.5 end-1 flex aspect-square w-5 items-center justify-center",
        "rounded-lg p-0 outline-hidden transition-transform focus-visible:ring-2",
        "[&>svg]:app-icon-sm [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
        "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

// ── MenuBadge ─────────────────────────────────────────────────────────────────

function SidebarMenuBadge({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute end-1 flex h-5 min-w-5 items-center justify-center",
        "rounded-full border border-sidebar-border/40 bg-sidebar-accent/60 px-1 app-text-stat tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

// ── MenuSkeleton ──────────────────────────────────────────────────────────────

function SidebarMenuSkeleton({
  className, showIcon = false, ...props
}: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex min-h-[var(--ctrl-h-sm)] items-center gap-2 rounded-xl px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="app-icon-sm rounded-lg" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1 rounded-lg"
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": width } as React.CSSProperties}
      />
    </div>
  );
}

// ── MenuSub ───────────────────────────────────────────────────────────────────

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border/50 mx-3.5 flex min-w-0 translate-x-px flex-col gap-0.5",
        "border-s px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="sidebar-menu-sub-item" data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)} {...props} />
  );
}

function SidebarMenuSubContent({
  isOpen,
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.div> & { isOpen: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
          className={cn("w-full", className)}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  style,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
        "[&>svg]:text-sidebar-accent-foreground",
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden",
        "rounded-lg px-2 outline-hidden",
        "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "transition-colors duration-150 ease-in-out",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:app-text-heading-sm data-[active=true]:text-sidebar-accent-foreground",
        "[&>span:last-child]:truncate [&>svg]:app-icon-sm [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────

export {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarInput, SidebarInset,
  SidebarMenu, SidebarMenuAction, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubContent, SidebarMenuSubItem,
  SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger,
  useSidebar,
  useSidebarOptional,
};