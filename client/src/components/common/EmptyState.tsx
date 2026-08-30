import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-200 dark:border-industrial-800 rounded-2xl bg-gray-50/50 dark:bg-industrial-900/30">
      <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        {icon || <PackageSearch className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
