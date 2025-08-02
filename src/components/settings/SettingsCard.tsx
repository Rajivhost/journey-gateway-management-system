import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon: Icon,
  children
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center">
          {Icon && <Icon className="h-6 w-6 text-gray-400 mr-3" />}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">{children}</div>
    </div>
  );
};