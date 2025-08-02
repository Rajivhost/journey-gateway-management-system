import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGateways } from '../hooks/useGateways';
import { useCarriers } from '../hooks/useCarriers';
import { CountryCode, FilterOptions } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { GatewayFilterBar } from '../components/gateways/GatewayFilterBar';
import { GatewayList as GatewayListComponent } from '../components/gateways/GatewayList';
import { CreateGatewayForm, GatewayFormData } from '../components/gateways/CreateGatewayForm';

interface GatewayListPageProps {
  selectedCountry: CountryCode;
}

export const GatewayListPage: React.FC<GatewayListPageProps> = ({ selectedCountry }) => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    country: selectedCountry
  });

  // Update filters when country changes
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, country: selectedCountry }));
  }, [selectedCountry]);

  const { gateways, loading: gatewaysLoading, error: gatewaysError } = useGateways(selectedCountry, filters);
  const { carriers, loading: carriersLoading } = useCarriers(selectedCountry);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleCreateNewClick = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = (formData: GatewayFormData) => {
    // This would normally make an API call to create the gateway
    console.log('Creating gateway with data:', formData);
    
    // Close the form
    setShowCreateForm(false);
    
    // In a real implementation, we'd wait for the API response and then:
    // 1. Show a success message
    // 2. Redirect to the new gateway's detail page or refresh the list
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Journey Gateways" 
        description="Manage your journey gateways across different carriers and countries"
        breadcrumbs={[{ label: 'Gateways' }]}
        actions={
          <button
            type="button"
            onClick={handleCreateNewClick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Gateway
          </button>
        }
      />
      
      <div className="mt-6 space-y-6">
        <GatewayFilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          carriers={carriers}
          isLoading={carriersLoading || gatewaysLoading}
        />
        
        <GatewayListComponent 
          gateways={gateways}
          loading={gatewaysLoading}
          error={gatewaysError}
          selectedCountry={selectedCountry}
          onCreateNew={handleCreateNewClick}
        />
      </div>
      
      {showCreateForm && (
        <CreateGatewayForm 
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
          initialCountry={selectedCountry}
        />
      )}
    </div>
  );
};