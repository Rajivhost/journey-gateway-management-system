import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

interface Crumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs = [],
  actions
}) => {
  return (
    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <div className="mb-3">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        
        {actions && (
          <div className="mt-4 md:mt-0 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};