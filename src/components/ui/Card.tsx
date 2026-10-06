import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'outline' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all';

  const variantClasses = {
    // Pure white in light, pure black in dark, clean 1px neutral border
    default: 'bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white',
    // Subtle surface (grayscale)
    subtle: 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 text-black dark:text-white',
    outline: 'bg-transparent border border-neutral-200 dark:border-neutral-800 text-black dark:text-white',
    interactive: 'bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer text-black dark:text-white'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2.5',
    md: 'p-3.5 sm:p-4',
    lg: 'p-5 sm:p-6'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
