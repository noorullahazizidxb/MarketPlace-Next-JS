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
  <div className="p-2 border-b bg-[hsl(var(--card))]/50">
    <input
      className={cn("w-full bg-transparent outline-none text-xs", className)}
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
}) => <div className={cn("p-3 text-2xs opacity-60", className)} {...rest} />;

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
      "w-full text-left px-3 py-2 text-xs hover:bg-[hsl(var(--muted))/0.5] flex items-center",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
