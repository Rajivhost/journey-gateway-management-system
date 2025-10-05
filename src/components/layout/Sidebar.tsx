import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, Globe as Globe2, Tags, Users, Settings, Building2, Package, MapPin, Activity, Smartphone, CreditCard, Receipt, Shield } from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
}

const navigationItems = [
  {
    section: 'Management',
    items: [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'Gateways', path: '/gateways', icon: <Radio className="w-5 h-5" /> },
      { name: 'Journeys', path: '/journeys', icon: <MapPin className="w-5 h-5" /> },
      { name: 'Sessions', path: '/sessions', icon: <Activity className="w-5 h-5" /> },
      { name: 'Carriers', path: '/carriers', icon: <Globe2 className="w-5 h-5" /> },
      { name: 'Categories', path: '/categories', icon: <Tags className="w-5 h-5" /> },
      { name: 'Service Providers', path: '/providers', icon: <Building2 className="w-5 h-5" /> },
      { name: 'Provider Requests', path: '/providers/requests', icon: <Users className="w-5 h-5" /> },
      { name: 'Products', path: '/products', icon: <Package className="w-5 h-5" /> },
    ]
  },
  {
    section: 'Tools',
    items: [
      { name: 'USSD Simulator', path: '/simulator', icon: <Smartphone className="w-5 h-5" /> },
    ]
  },
  {
    section: 'Configuration',
    items: [
      { name: 'Payment Methods', path: '/payment-methods', icon: <CreditCard className="w-5 h-5" /> },
      { name: 'Billing', path: '/billing', icon: <Receipt className="w-5 h-5" /> },
      { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded }) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300`}>
      <div className={`p-4 ${!isExpanded && 'text-center'}`}>
        {isExpanded ? (
          <h1 className="text-xl font-semibold text-gray-900">USSDLink</h1>
        ) : (
          <h1 className="text-xl font-semibold text-gray-900">UL</h1>
        )}
      </div>
      
      <nav className="mt-4">
        {navigationItems.map((section, idx) => (
          <div key={idx} className={`px-4 mb-8 ${!isExpanded && 'px-2'}`}>
            {isExpanded && (
              <h2 className="mb-2 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {section.section}
              </h2>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${isExpanded ? 'px-2' : 'justify-center'} py-2 text-sm font-medium rounded-md ${
                      isActivePath(item.path)
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                    title={!isExpanded ? item.name : undefined}
                  >
                    <span className={`text-gray-500 ${isExpanded && 'mr-3'}`}>{item.icon}</span>
                    {isExpanded && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};