import React from 'react';
import { ArrowUp, ArrowDown, CheckCircle, XCircle, Plus } from 'lucide-react';
import { CountryCode } from '../../types';
import { useGatewayMenus } from '../../hooks/useGatewayMenus';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface GatewayMenuListProps {
  gatewayId: string;
  country: CountryCode;
}

export const GatewayMenuList: React.FC<GatewayMenuListProps> = ({
  gatewayId,
  country
}) => {
  const { menus, loading, error } = useGatewayMenus(gatewayId, country);

  if (loading) {
    return <Loading text="Loading gateway menus..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading menus</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <EmptyState
        title="No menus configured"
        description="Add menu items to this gateway to organize journeys and provide navigation options."
        icon={<Plus className="w-8 h-8 text-gray-400" />}
        actionLabel="Add Menu Item"
        onAction={() => {
          // This would open the menu creation modal/form
          console.log('Add menu item clicked');
        }}
      />
    );
  }

  return (
    <div className="overflow-hidden bg-white">
      <ul className="divide-y divide-gray-200">
        {menus.map((menu) => (
          <li key={menu.menuId} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {menu.position}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{menu.menuText}</p>
                  {menu.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{menu.description}</p>
                  )}
                  {menu.category && (
                    <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {menu.category.name}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {menu.active ? (
                  <span className="inline-flex items-center text-xs text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <XCircle className="h-4 w-4 mr-1 text-gray-400" />
                    Inactive
                  </span>
                )}
                
                <div className="flex">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-500"
                    title="Move up"
                    disabled={menu.position === 1}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-500"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};