import React, { useState } from 'react';
import { Clock, CalendarClock, Router, Link as LinkIcon, Edit } from 'lucide-react';
import { JourneyGateway } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { CountryFlag } from '../ui/CountryFlag';
import { GatewayTypeChip } from '../ui/GatewayTypeChip';
import { Loading } from '../ui/Loading';
import { GatewayMenuList } from './GatewayMenuList';
import { GatewayRegistrationList } from './GatewayRegistrationList';
import { ManageMenusForm, MenuFormData } from './ManageMenusForm';
import { CreateGatewayRegistrationForm } from './CreateGatewayRegistrationForm';

interface GatewayDetailProps {
  gateway: JourneyGateway | null;
  loading: boolean;
  error: Error | null;
}

export const GatewayDetail: React.FC<GatewayDetailProps> = ({
  gateway,
  loading,
  error
}) => {
  const [showManageMenus, setShowManageMenus] = useState(false);
  const [showCreateRegistration, setShowCreateRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState<'menus' | 'registrations'>('menus');

  if (loading) {
    return <Loading text="Loading gateway details..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading gateway</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!gateway) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
        <p className="font-medium">Gateway not found</p>
        <p className="mt-1 text-sm">The gateway you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleManageMenus = () => {
    setShowManageMenus(true);
  };

  const handleMenusSubmit = (menus: MenuFormData[]) => {
    console.log('Updating menus:', menus);
    setShowManageMenus(false);
  };

  const handleCreateRegistration = () => {
    setShowCreateRegistration(true);
  };

  const handleRegistrationSubmit = (data: any) => {
    console.log('Creating registration:', data);
    setShowCreateRegistration(false);
  };

  return (
    <div className="space-y-6">
      {/* Gateway info card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
          <div className="flex items-center">
            <Router className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Gateway Details</h3>
          </div>
          <button 
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Gateway Name</h4>
              <p className="mt-1 text-sm text-gray-900">{gateway.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Carrier</h4>
              <p className="mt-1 text-sm text-gray-900">
                {gateway.carrier.name} ({gateway.carrier.code})
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Short Code</h4>
              <p className="mt-1 text-sm font-medium font-mono text-gray-900">{gateway.shortCode}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Gateway Type</h4>
              <div className="mt-1">
                <GatewayTypeChip type={gateway.gatewayType} />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="mt-1">
                <StatusBadge status={gateway.status} />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Country</h4>
              <div className="mt-1">
                <CountryFlag countryCode={gateway.country} withName />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-sm text-gray-900">{gateway.description || 'No description provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-xs text-gray-500 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>Created: {formatDate(gateway.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-1 text-gray-400" />
              <span>Last Updated: {formatDate(gateway.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for Menus and Registrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('menus')}
              className={`${
                activeTab === 'menus'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Gateway Menus
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`${
                activeTab === 'registrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Journey Registrations
            </button>
          </nav>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <LinkIcon className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'menus' ? 'Gateway Menus' : 'Journey Registrations'}
              </h3>
            </div>
            <button 
              type="button"
              onClick={activeTab === 'menus' ? handleManageMenus : handleCreateRegistration}
              className="inline-flex items-center px-3 py-1.5 border border-blue-700 shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-1" />
              {activeTab === 'menus' ? 'Manage Menus' : 'Add Registration'}
            </button>
          </div>

          {activeTab === 'menus' ? (
            <GatewayMenuList gatewayId={gateway.gatewayId} country={gateway.country} />
          ) : (
            <GatewayRegistrationList gatewayId={gateway.gatewayId} country={gateway.country} />
          )}
        </div>
      </div>

      {showManageMenus && (
        <ManageMenusForm
          onClose={() => setShowManageMenus(false)}
          onSubmit={handleMenusSubmit}
          initialMenus={[]}
          gatewayId={gateway.gatewayId}
          country={gateway.country}
        />
      )}

      {showCreateRegistration && (
        <CreateGatewayRegistrationForm
          onClose={() => setShowCreateRegistration(false)}
          onSubmit={handleRegistrationSubmit}
          initialCountry={gateway.country}
          gatewayId={gateway.gatewayId}
        />
      )}
    </div>
  );
};