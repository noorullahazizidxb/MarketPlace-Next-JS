"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface CommandRootProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Command: React.FC<CommandRootProps> = ({ className, ...rest }) => (
  <div
    className={cn("flex flex-col overflow-hidden rounded-lg", className)}
    {...rest}
  />
);

interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (val: string) => void;
}
export const CommandInput: React.FC<CommandInputProps> = ({
  onValueChange,
  className,
  ...rest
}) => (
  <div className="p-2 border-b bg-[var(--card)]/50">
    <input
      className={cn("w-full bg-transparent outline-none app-text-caption", className)}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...rest}
    />
  </div>
);

export const CommandList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => <div className={cn("overflow-auto", className)} {...rest} />;

export const CommandEmpty: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => <div className={cn("p-3 app-text-micro opacity-60", className)} {...rest} />;

interface CommandItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
}
export const CommandItem: React.FC<CommandItemProps> = ({
  className,
  children,
  ...rest
}) => (
  <button
    className={cn(
      "w-full text-left px-3 py-2 app-text-caption hover:bg-[color-mix(in oklab, var(--muted) 50%, transparent)] flex items-center",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
