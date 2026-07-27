// src/shared/ui/button/button.variants.ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-lg admin-text-action transition-colors " +
  "admin-text-action " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand: 'brand-gradient hover-gradient brand-glow text-brand-foreground border-0',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-[var(--ctrl-h-sm)] h-auto px-4 py-2',
        sm: 'min-h-[var(--ctrl-h-sm)] h-auto px-3 rounded-md',
        lg: 'min-h-[var(--ctrl-h)] h-auto px-8 rounded-md',
        xl: "min-min-h-[var(--ctrl-h)] h-auto px-8 rounded-lg admin-text-body",
        icon: 'size-[var(--ctrl-h-sm)] min-h-[var(--ctrl-h-sm)] min-w-[var(--ctrl-h-sm)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
