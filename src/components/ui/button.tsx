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
      "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all ease-premium disabled:opacity-60 disabled:cursor-not-allowed h-10 px-4 gap-2 neuo border";
    const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "[border-color:hsl(var(--card-border,var(--border)))] [color:hsl(var(--btn-primary-fg,var(--secondary-foreground)))] [background-color:hsl(var(--btn-primary-bg,var(--primary)))] hover:[background-color:hsl(var(--btn-primary-hover-bg,var(--accent)))] hover:shadow-glass hover:-translate-y-0.5",
      accent:
        "[border-color:hsl(var(--card-border,var(--border)))] [color:hsl(var(--btn-accent-fg,var(--accent-foreground)))] [background-color:hsl(var(--btn-accent-bg,var(--accent)))] hover:[background-color:hsl(var(--btn-accent-hover-bg,var(--primary)))] hover:shadow-glass hover:-translate-y-0.5",
      secondary:
        "[border-color:hsl(var(--card-border,var(--border)))] [color:hsl(var(--btn-secondary-fg,var(--secondary-foreground)))] [background-color:hsl(var(--btn-secondary-bg,var(--secondary)))] hover:-translate-y-0.5",
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
