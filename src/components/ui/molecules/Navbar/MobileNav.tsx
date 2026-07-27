"use client";

import React from "react";
import { ChevronDown, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../collapsible";
import { SheetHeader, SheetTitle } from "../../sheet";
import { Button } from "../../atoms/Button";
import { Logo } from "../../atoms/logo";
import { SOLUTIONS_ITEMS, type NavItem } from "./navbar.constants";
import { useBrandName } from "./use-brand-name";
import { handleNavClick } from "./navbar.utils";
import { cn } from "../../lib/cn";
import Link from "next/link";

const MOBILE_LINK_CLASS =
  "flex cursor-pointer items-center rounded-lg px-4 py-3 admin-text-label ui-typo-mobile-nav-primary hover:bg-accent hover:text-accent-foreground";

const MOBILE_SUB_LINK_CLASS =
  "flex cursor-pointer items-center rounded-lg px-4 py-2 ui-typo-mobile-nav-secondary hover:bg-accent hover:text-accent-foreground";

/* ── Solutions submenu ─────────────────────────────────── */
interface SolutionsMenuProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onClose: () => void;
}

export function MobileSolutionsMenu({
  open,
  onOpenChange,
  onClose,
}: SolutionsMenuProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 admin-text-label ui-typo-mobile-nav-primary hover:bg-accent hover:text-accent-foreground">
        Solutions
        <ChevronDown
          className={cn(
            "admin-icon-sm shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-1 pl-4">
        {SOLUTIONS_ITEMS.map((item, i) =>
          item.kind === "header" ? (
            <div
              key={`h-${i}`}
              className="mt-5 px-4 py-2 admin-typo-eyebrow uppercase tracking-wider text-muted-foreground/50"
            >
              {item.title}
            </div>
          ) : (
            <a
              key={item.href}
              href={item.href}
              className={MOBILE_SUB_LINK_CLASS}
              onClick={(e) => handleNavClick(e, item.href, onClose)}
            >
              {item.name}
            </a>
          ),
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── Single nav link ───────────────────────────────────── */
export function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      className={MOBILE_LINK_CLASS}
    // onClick={(e) => handleNavClick(e, item.href, onClose)}
    >
      {item.name}
    </Link>
  );
}

/* ── Sheet header ──────────────────────────────────────── */
export function MobileSheetHeader({ onClose }: { onClose: () => void }) {
  const brandName = useBrandName();

  return (
    <SheetHeader className="border-b p-4 pb-2 [&]:space-y-0">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <Logo size={16} />
        </div>
        <SheetTitle className="admin-typo-section-heading font-semibold">
          {brandName}
        </SheetTitle>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="min-h-[var(--ctrl-h-sm)] w-9"
            onClick={onClose}
          >
            <X className="admin-icon-sm" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
      </div>
    </SheetHeader>
  );
}
