import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-2xl bg-input/20 border border-white/10 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
