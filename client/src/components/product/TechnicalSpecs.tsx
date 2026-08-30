import React from 'react';
import { ISpecification } from '../../types';

interface TechnicalSpecsProps {
  specifications: ISpecification[];
}

export const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ specifications }) => {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs">
      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 dark:border-industrial-800">
        Technical Specifications & Material Data
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-industrial-800/60"
          >
            <span className="font-semibold text-gray-500 dark:text-gray-400">{spec.key}</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-right">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
