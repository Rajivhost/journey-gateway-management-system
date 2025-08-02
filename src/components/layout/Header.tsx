import React from 'react';
import { Bell, Settings, Menu } from 'lucide-react';
import { CountrySelector } from '../ui/CountrySelector';
import { CountryCode } from '../../types';

interface HeaderProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  onToggleSidebar: () => void;
  isSidebarExpanded: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCountry,
  onCountryChange,
  onToggleSidebar,
  isSidebarExpanded
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none mr-4"
              aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">USSDLink</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <CountrySelector 
              value={selectedCountry} 
              onChange={onCountryChange} 
              label="" 
            />
            
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}