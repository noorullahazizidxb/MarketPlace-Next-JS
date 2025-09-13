"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild,
      LeftIcon,
      RightIcon,
      variant = "secondary",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all ease-premium disabled:opacity-60 disabled:cursor-not-allowed h-10 px-4 gap-2 neuo";
    const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-primary text-primary-foreground shadow-soft hover:shadow-glass hover:-translate-y-0.5",
      secondary:
        "bg-secondary text-secondary-foreground hover:-translate-y-0.5",
      ghost: "bg-transparent hover:bg-foreground/5",
    };
    return (
      <Comp
        ref={ref}
        className={cn(base, styles[variant], className)}
        {...props}
      >
        {LeftIcon ? <LeftIcon className="size-4" /> : null}
        {children}
        {RightIcon ? <RightIcon className="size-4" /> : null}
      </Comp>
    );
  }
);
Button.displayName = "Button";
