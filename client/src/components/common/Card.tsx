import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-xl shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-brand-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
