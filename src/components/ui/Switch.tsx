import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  id?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  id,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between gap-3 select-none">
      {(label || description) && (
        <label htmlFor={id} className={`cursor-pointer flex-1 ${disabled ? 'opacity-50' : ''}`}>
          {label && <div className="text-xs font-bold text-black dark:text-white">{label}</div>}
          {description && <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</div>}
        </label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${
          checked ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-800'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ease-in-out ${
            checked
              ? 'translate-x-4 bg-white dark:bg-black'
              : 'translate-x-0 bg-white dark:bg-neutral-400'
          }`}
        />
      </button>
    </div>
  );
};
