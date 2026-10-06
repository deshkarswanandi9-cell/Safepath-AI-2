import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={id} className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-neutral-400 pointer-events-none shrink-0 flex items-center">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full text-xs font-semibold rounded-xl bg-white dark:bg-black text-black dark:text-white border border-neutral-300 dark:border-neutral-700 py-2.5 ${
              icon ? 'pl-9 pr-3' : 'px-3'
            } placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors disabled:opacity-50 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[10px] font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
