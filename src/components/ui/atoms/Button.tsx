
'use client';

import React, { forwardRef } from 'react';
import { cn } from '../lib/cn';


// import { Loader2 } from 'lucide-react';


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
        'bg-primary/90 text-white',
        'hover:bg-primary active:bg-blue-800',
        'disabled:bg-blue-300'
      ),
      secondary: cn(
        'bg-gray-100 text-gray-700',
        'hover:bg-gray-200 active:bg-gray-300',
        'disabled:bg-gray-100 disabled:text-gray-400'
      ),
      outline: cn(
        'border-2 border-gray-200 text-gray-700 bg-transparent',
        'hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100',
        'disabled:text-gray-400 disabled:border-gray-200 disabled:bg-transparent'
      ),
      ghost: cn(
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 active:bg-gray-200',
        'disabled:text-gray-400 disabled:bg-transparent'
      ),
      link: cn(
        'text-blue-600 bg-transparent underline-offset-4 px-0',
        'hover:underline',
        'disabled:text-blue-300'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-700 active:bg-red-800',
        'disabled:bg-red-300'
      ),
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-5 py-3 text-base',
      lg: 'px-6 py-3.5 text-lg',
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
        {/* Loading Spinner */}
        {/* {loading && (
        <Loader2 className="w-5 h-5 animate-spin absolute" />
        )} */}

        {/* Content */}
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