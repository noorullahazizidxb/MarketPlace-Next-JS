import * as React from "react";
import { cn } from "@/lib/cn";

// ─── Card ──────────────────────────────────────────────────────────────────────
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // base glass surface
      "relative overflow-hidden rounded-[1.5rem]",
      "bg-[hsl(var(--card))]/80 backdrop-blur-xl",
      "border border-white/[0.08]",
      "shadow-[0_4px_24px_-8px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]",
      // hover lift
      "transition-all duration-300 ease-out",
      "hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)]",
      "hover:-translate-y-0.5",
      // top shimmer line
      "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px",
      "before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// ─── CardHeader ───────────────────────────────────────────────────────────────
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ─── CardTitle ─────────────────────────────────────────────────────────────────
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight text-base", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ─── CardDescription ──────────────────────────────────────────────────────────
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[hsl(var(--muted-foreground))]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ─── CardContent ──────────────────────────────────────────────────────────────
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ─── CardFooter ───────────────────────────────────────────────────────────────
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center px-6 py-4 border-t border-[hsl(var(--border))]/40",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
