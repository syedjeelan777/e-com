import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-black text-brand-600 dark:text-brand-400">404</h1>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mt-2 mb-1">
        Page Not Found
      </h2>
      <p className="text-xs text-gray-500 max-w-sm mb-6">
        The page or product catalogue endpoint you are looking for does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};
