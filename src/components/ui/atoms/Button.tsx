'use client';

import React, { forwardRef } from 'react';
import { cn } from '../lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading,
      fullWidth,
      leftIcon,
      rightIcon,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const variants = {
      primary: cn(
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90 active:bg-primary/80',
        'disabled:opacity-50'
      ),
      secondary: cn(
        'bg-secondary text-secondary-foreground',
        'hover:bg-secondary/80 active:bg-secondary/70',
        'disabled:opacity-50'
      ),
      outline: cn(
        'border-2 border-border text-foreground bg-transparent',
        'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        'disabled:opacity-50'
      ),
      ghost: cn(
        'text-foreground bg-transparent',
        'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        'disabled:opacity-50'
      ),
      link: cn(
        'text-primary bg-transparent underline-offset-4 px-0',
        'hover:underline',
        'disabled:opacity-50'
      ),
      danger: cn(
        'bg-destructive text-white',
        'hover:bg-destructive/90 active:bg-destructive/80',
        'disabled:opacity-50'
      ),
    };

    const sizes = {
      sm: 'px-3 py-2 app-text-action min-h-[var(--ctrl-h-sm)]',
      md: 'px-5 py-3 app-text-action min-h-[var(--ctrl-h)]',
      lg: 'px-6 py-3.5 app-text-action min-h-[var(--ctrl-h)]',
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex cursor-pointer items-center justify-center gap-2',
          'font-medium rounded-md transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
          variants[variant],
          variant !== 'link' && sizes[size],
          fullWidth && 'w-full',
          isDisabled && 'cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'flex items-center justify-center gap-2',
            loading && 'invisible'
          )}
        >
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
