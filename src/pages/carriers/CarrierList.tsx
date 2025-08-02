import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCarriers } from '../../hooks/useCarriers';
import { CountryCode, Carrier } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Loading } from '../../components/ui/Loading';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { CreateCarrierForm } from '../../components/carriers/CreateCarrierForm';

interface CarrierListPageProps {
  selectedCountry: CountryCode;
}

export const CarrierListPage: React.FC<CarrierListPageProps> = ({ selectedCountry }) => {
  const { carriers, loading, error } = useCarriers(selectedCountry);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateCarrier = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = (data: any) => {
    console.log('Creating carrier:', data);
    setShowCreateForm(false);
  };

  if (loading) {
    return <Loading text="Loading carriers..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading carriers</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Carriers"
        description="Manage mobile network operators and carriers"
        breadcrumbs={[{ label: 'Carriers' }]}
        actions={
          <button
            type="button"
            onClick={handleCreateCarrier}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Carrier
          </button>
        }
      />

      <div className="mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {carriers.map((carrier) => (
              <li key={carrier.carrierId}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex text-sm">
                        <p className="font-medium text-blue-600 truncate">{carrier.name}</p>
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          ({carrier.code})
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <CountryFlag countryCode={carrier.country} withName />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showCreateForm && (
        <CreateCarrierForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
          initialCountry={selectedCountry}
        />
      )}
    </div>
  );
};