"use client";

import { LayoutDashboard } from "lucide-react";

/** Specimen mirroring production sidebar menu-button / group-label tokens */
export function PreviewSidebarNav() {
  return (
    <div
      className="min-w-0 max-w-full overflow-hidden rounded-xl border border-border/60 bg-card"
      style={{ width: "min(100%, var(--app-sidebar-width, 16rem))" }}
    >
      <div
        className="border-b border-border/40 bg-muted/20 px-3 py-2"
        style={{ paddingInline: "var(--nav-item-px)", paddingBlock: "var(--nav-item-py)" }}
      >
        <span
          data-sidebar="group-label"
          className="uppercase tracking-wide text-muted-foreground"
          style={{ fontSize: "var(--sb-text-label)", fontWeight: "var(--weight-label)" }}
        >
          Navigation
        </span>
      </div>
      <div className="space-y-1 p-2">
        <div
          data-sidebar="menu-button"
          className="flex items-center justify-between rounded-lg bg-primary/10 text-foreground"
          style={{
            paddingInline: "var(--nav-item-px)",
            paddingBlock: "var(--nav-item-py)",
            fontSize: "var(--sb-text-item)",
            fontWeight: "var(--weight-body)",
          }}
        >
          <span className="flex min-w-0 items-center gap-2">
            <LayoutDashboard style={{ width: "var(--nav-icon-size)", height: "var(--nav-icon-size)" }} aria-hidden />
            Dashboard
          </span>
          <span
            data-sidebar="menu-badge"
            className="rounded-full bg-primary/15 px-2 py-0.5 text-primary"
            style={{ fontSize: "var(--sb-text-badge)", fontWeight: "var(--weight-badge)" }}
          >
            3
          </span>
        </div>
        <div
          data-sidebar="menu-sub-button"
          className="rounded-lg text-muted-foreground"
          style={{
            paddingInline: "var(--nav-item-px)",
            paddingBlock: "var(--nav-item-py)",
            fontSize: "var(--sb-text-sub)",
          }}
        >
          Manage users
        </div>
      </div>
    </div>
  );
}
