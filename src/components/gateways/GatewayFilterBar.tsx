import React from 'react';
import { Search, Filter } from 'lucide-react';
import { CountryCode, JourneyGatewayStatus, JourneyGatewayType, FilterOptions, Carrier } from '../../types';

interface GatewayFilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  carriers: Carrier[];
  isLoading?: boolean;
}

export const GatewayFilterBar: React.FC<GatewayFilterBarProps> = ({
  filters,
  onFilterChange,
  carriers,
  isLoading = false
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as JourneyGatewayStatus | undefined;
    onFilterChange({ ...filters, status: value || undefined });
  };

  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, carrierId: e.target.value || undefined });
  };

  const handleGatewayTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as JourneyGatewayType | undefined;
    onFilterChange({ ...filters, gatewayType: value || undefined });
  };

  const clearAllFilters = () => {
    onFilterChange({
      country: filters.country,
      search: '',
      status: undefined,
      carrierId: undefined,
      gatewayType: undefined
    });
  };

  // Count active filters (excluding country which is always required)
  const activeFiltersCount = [
    filters.search, 
    filters.status, 
    filters.carrierId, 
    filters.gatewayType
  ].filter(Boolean).length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col space-y-4">
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search gateways..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status || ''}
              onChange={handleStatusChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={isLoading}
            >
              <option value="">All Statuses</option>
              {Object.values(JourneyGatewayStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="carrier-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Carrier
            </label>
            <select
              id="carrier-filter"
              value={filters.carrierId || ''}
              onChange={handleCarrierChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={isLoading}
            >
              <option value="">All Carriers</option>
              {carriers.map((carrier) => (
                <option key={carrier.carrierId} value={carrier.carrierId}>
                  {carrier.name} ({carrier.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Gateway Type
            </label>
            <select
              id="type-filter"
              value={filters.gatewayType || ''}
              onChange={handleGatewayTypeChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={isLoading}
            >
              <option value="">All Types</option>
              {Object.values(JourneyGatewayType).map((type) => (
                <option key={type} value={type}>
                  {type === JourneyGatewayType.MULTI_PROVIDER ? 'Multi Provider' : 'Single Provider'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters indicator and clear button */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-gray-600">{activeFiltersCount} active filters</span>
            </div>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};