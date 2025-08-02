import React from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { SessionFilters, SessionStatus, SessionType } from '../../types/sessions';
import { CountryCode } from '../../types';
import { CountrySelector } from '../ui/CountrySelector';

interface SessionFiltersProps {
  filters: SessionFilters;
  onFilterChange: (filters: SessionFilters) => void;
  isLoading?: boolean;
}

export const SessionFiltersComponent: React.FC<SessionFiltersProps> = ({
  filters,
  onFilterChange,
  isLoading = false
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SessionStatus | undefined;
    onFilterChange({ ...filters, status: value || undefined });
  };

  const handleSessionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SessionType | undefined;
    onFilterChange({ ...filters, sessionType: value || undefined });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, phoneNumber: e.target.value || undefined });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, startDate: e.target.value || undefined });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, endDate: e.target.value || undefined });
  };

  const handleCountryChange = (country: CountryCode) => {
    onFilterChange({ ...filters, country });
  };

  const clearAllFilters = () => {
    onFilterChange({
      country: filters.country, // Keep country as it's usually required
      search: '',
      status: undefined,
      sessionType: undefined,
      phoneNumber: undefined,
      startDate: undefined,
      endDate: undefined,
      gatewayId: undefined,
      journeyId: undefined,
      providerId: undefined
    });
  };

  // Count active filters (excluding country which is usually always set)
  const activeFiltersCount = [
    filters.search,
    filters.status,
    filters.sessionType,
    filters.phoneNumber,
    filters.startDate,
    filters.endDate,
    filters.gatewayId,
    filters.journeyId,
    filters.providerId
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
            placeholder="Search sessions..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            {filters.country && (
              <CountrySelector
                value={filters.country}
                onChange={handleCountryChange}
                label=""
              />
            )}
          </div>

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
              {Object.values(SessionStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Session Type
            </label>
            <select
              id="type-filter"
              value={filters.sessionType || ''}
              onChange={handleSessionTypeChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={isLoading}
            >
              <option value="">All Types</option>
              {Object.values(SessionType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="phone-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              id="phone-filter"
              value={filters.phoneNumber || ''}
              onChange={handlePhoneNumberChange}
              placeholder="+237..."
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Date range filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                id="start-date"
                value={filters.startDate || ''}
                onChange={handleStartDateChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                id="end-date"
                value={filters.endDate || ''}
                onChange={handleEndDateChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>
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
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};