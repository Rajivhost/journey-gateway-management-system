import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MoreHorizontal, PlusCircle } from 'lucide-react';
import { JourneyGateway, CountryCode } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { CountryFlag } from '../ui/CountryFlag';
import { GatewayTypeChip } from '../ui/GatewayTypeChip';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface GatewayListProps {
  gateways: JourneyGateway[];
  loading: boolean;
  error: Error | null;
  selectedCountry: CountryCode;
  onCreateNew: () => void;
}

export const GatewayList: React.FC<GatewayListProps> = ({
  gateways,
  loading,
  error,
  selectedCountry,
  onCreateNew
}) => {
  if (loading) {
    return <Loading text="Loading gateways..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <p className="font-medium">Error loading gateways</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (gateways.length === 0) {
    return (
      <EmptyState
        title="No gateways found"
        description="Create your first journey gateway to get started."
        icon={<PlusCircle className="w-8 h-8 text-gray-400" />}
        actionLabel="Create Gateway"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gateway
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carrier
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Code
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gateways.map((gateway) => (
              <tr 
                key={gateway.gatewayId} 
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        <Link 
                          to={`/gateways/${gateway.gatewayId}`}
                          className="hover:text-blue-600 hover:underline flex items-center"
                        >
                          {gateway.name}
                          <ExternalLink className="ml-1 h-3 w-3 text-gray-400" />
                        </Link>
                      </div>
                      {gateway.description && (
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          {gateway.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{gateway.carrier.name}</div>
                  <div className="text-xs text-gray-500">{gateway.carrier.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900">{gateway.shortCode}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <GatewayTypeChip type={gateway.gatewayType} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={gateway.status} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CountryFlag countryCode={gateway.country} withName />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none p-1 rounded-full"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Optional pagination controls would go here */}
    </div>
  );
};