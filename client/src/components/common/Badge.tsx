import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold uppercase tracking-wider',
  };

  const variantStyles = {
    primary: 'bg-brand-100 text-brand-800 border border-brand-200',
    secondary: 'bg-industrial-100 text-industrial-800 border border-industrial-200 dark:bg-industrial-800 dark:text-industrial-200',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300',
    danger: 'bg-rose-100 text-rose-800 border border-rose-300',
    info: 'bg-sky-100 text-sky-800 border border-sky-300',
    outline: 'border border-gray-300 text-gray-700 dark:text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
