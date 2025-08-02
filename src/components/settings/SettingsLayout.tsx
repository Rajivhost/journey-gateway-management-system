import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SettingsTab {
  name: string;
  path: string;
}

const tabs: SettingsTab[] = [
  { name: 'General', path: '/settings/general' },
  { name: 'Features', path: '/settings/features' },
  { name: 'Appearance', path: '/settings/appearance' },
  { name: 'Security', path: '/settings/security' },
  { name: 'Pricing', path: '/settings/pricing' },
  { name: 'Subscription', path: '/settings/subscription' },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your platform settings and configurations
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Settings tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`${
                location.pathname === tab.path
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
};