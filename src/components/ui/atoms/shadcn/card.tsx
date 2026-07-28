import * as React from "react"
import { cn } from "../../lib/cn"

/**
 * Card family — premium surface components.
 *
 * Design decisions:
 *  - Rounded corners use --radius-lg (calc(var(--radius) + 4px)) matching the
 *    app-wide radius scale defined in globals.css.
 *  - Typography scales via CSS clamp() so cards stay readable at all viewports.
 *  - Subtle top accent stripe and hover-lift are applied to the root Card so
 *    every card in the contracts UI gets the same consistent polish.
 *  - All colour references use semantic tokens from globals.css (:root / .dark)
 *    so they flip automatically in dark mode without any extra code.
 */

/* ── Card ──────────────────────────────────────────────────────────────────── */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        /* Base surface */
        "relative flex flex-col gap-[var(--space-card)] overflow-hidden",
        "rounded-squircle border border-border/60 bg-card text-card-foreground",
        "py-[var(--space-card)] shadow-sm",
        /* Hover-lift transition — matches stat card behaviour */
        "transition-shadow duration-200 hover:shadow-md",
        className
      )}
      {...props}
    />
  )
}

/* ── CardHeader ────────────────────────────────────────────────────────────── */

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header",
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-[var(--space-card)]",
        /* When a CardAction is present Tailwind's `has-` modifier adds a
           second column automatically — no JS required. */
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        /* Respect a divider border added externally via `.border-b` */
        "[.border-b]:pb-[var(--space-card)]",
        className
      )}
      {...props}
    />
  )
}

/* ── CardTitle ─────────────────────────────────────────────────────────────── */

function CardTitle({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("app-text-heading-sm leading-tight text-foreground", className)}
      {...props}
    />
  )
}

/* ── CardDescription ───────────────────────────────────────────────────────── */

function CardDescription({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("app-text-body text-muted-foreground", className)}
      {...props}
    />
  )
}

/* ── CardAction ─────────────────────────────────────────────────────────────── */

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/* ── CardContent ────────────────────────────────────────────────────────────── */

function CardContent({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-[var(--space-card)]", className)}
      {...props}
    />
  )
}

/* ── CardFooter ─────────────────────────────────────────────────────────────── */

function CardFooter({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6",
        "[.border-t]:pt-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
