"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  variant?: "primary" | "secondary" | "ghost" | "accent";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild,
      LeftIcon,
      RightIcon,
      variant = "primary",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const base =
      "inline-flex items-center justify-center whitespace-nowrap [border-radius:var(--radius-button-override,var(--radius-button,var(--radius-md,0.75rem)))] text-sm font-medium transition-all duration-200 ease-premium disabled:opacity-60 disabled:cursor-not-allowed h-10 px-4 gap-2 neuo border active:translate-y-0.5 hover:scale-[1.015] active:scale-[0.985]";
    const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "[border-color:hsl(var(--card-border,var(--border)))] [color:hsl(var(--btn-primary-fg,var(--secondary-foreground)))] [background-color:hsl(var(--btn-primary-bg,var(--primary)))] hover:[background-color:hsl(var(--btn-primary-hover-bg,var(--accent)))] active:[background-color:hsl(var(--btn-primary-active-bg,var(--primary)))] [box-shadow:var(--btn-primary-shadow,var(--shadow-sm,none))] hover:[box-shadow:var(--btn-primary-hover-shadow,var(--btn-primary-shadow,var(--shadow-md,none)))] active:[box-shadow:var(--btn-primary-active-shadow,var(--shadow-sm,none))] [transition:var(--btn-primary-transition,var(--transition-normal,200ms_ease))] hover:-translate-y-0.5",
      accent:
        "[border-color:hsl(var(--card-border,var(--border)))] [color:hsl(var(--btn-accent-fg,var(--accent-foreground)))] [background-color:hsl(var(--btn-accent-bg,var(--accent)))] hover:[background-color:hsl(var(--btn-accent-hover-bg,var(--primary)))] active:[background-color:hsl(var(--btn-accent-active-bg,var(--accent)))] [box-shadow:var(--btn-accent-shadow,var(--shadow-sm,none))] hover:[box-shadow:var(--btn-accent-hover-shadow,var(--btn-accent-shadow,var(--shadow-md,none)))] active:[box-shadow:var(--btn-accent-active-shadow,var(--shadow-sm,none))] [transition:var(--btn-accent-transition,var(--transition-normal,200ms_ease))] hover:-translate-y-0.5",
      secondary:
        "[border-color:hsl(var(--card-border,var(--border)))] [color:hsl(var(--btn-secondary-fg,var(--secondary-foreground)))] [background-color:hsl(var(--btn-secondary-bg,var(--secondary)))] hover:[background-color:hsl(var(--btn-secondary-hover-bg,var(--secondary)))] active:[background-color:hsl(var(--btn-secondary-active-bg,var(--secondary)))] [box-shadow:var(--btn-secondary-shadow,var(--shadow-none,none))] hover:[box-shadow:var(--btn-secondary-hover-shadow,var(--btn-secondary-shadow,var(--shadow-sm,none)))] active:[box-shadow:var(--btn-secondary-active-shadow,var(--shadow-none,none))] [transition:var(--btn-secondary-transition,var(--transition-normal,200ms_ease))] hover:-translate-y-0.5",
      ghost:
        "bg-transparent hover:bg-foreground/5 [border-color:hsl(var(--card-border,var(--border)))]",
    };
    const classes = cn(base, styles[variant], className);
    if (asChild) {
      // Radix Slot requires exactly one React element child
      return (
        <Comp ref={ref as any} className={classes} {...props}>
          {children}
        </Comp>
      );
    }
    return (
      <Comp ref={ref} className={classes} {...props}>
        {LeftIcon ? <LeftIcon className="size-4" /> : null}
        {children}
        {RightIcon ? <RightIcon className="size-4" /> : null}
      </Comp>
    );
  }
);
Button.displayName = "Button";
