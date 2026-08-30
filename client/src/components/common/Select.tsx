import React, { forwardRef } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full text-sm rounded-lg border py-2.5 px-3.5 bg-white dark:bg-industrial-900 text-gray-900 dark:text-gray-100 transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-500 text-rose-900 focus:ring-rose-500'
              : 'border-gray-300 dark:border-industrial-700 focus:ring-brand-500 focus:border-brand-500'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
