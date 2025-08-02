import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md',
  text = 'Loading...',
  fullPage = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
          <p className={`${textClasses[size]} font-medium text-gray-700`}>{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
        <p className={`${textClasses[size]} font-medium text-gray-700`}>{text}</p>
      </div>
    </div>
  );
};