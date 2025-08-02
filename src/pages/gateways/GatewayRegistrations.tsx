import React, { useState } from 'react';
import { Plus, Radio, Tag, Building2 } from 'lucide-react';
import { CountryCode } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Loading } from '../../components/ui/Loading';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { CreateGatewayRegistrationForm } from '../../components/gateways/CreateGatewayRegistrationForm';

interface GatewayRegistrationsPageProps {
  selectedCountry: CountryCode;
}

// Mock data for development
const mockRegistrations = [
  {
    registrationId: 'reg-1',
    name: 'Mobile Money Service',
    active: true,
    menuText: 'Mobile Money',
    position: 1,
    priority: 1,
    shortCode: '*123#',
    gateway: {
      gatewayId: 'gw-1',
      name: 'MTN USSD Gateway',
      carrier: {
        name: 'MTN',
        code: 'MTN'
      }
    },
    journey: {
      journeyId: 'j-1',
      name: 'Money Transfer Journey'
    },
    provider: {
      providerId: 'p-1',
      name: 'FinTech Solutions'
    },
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  }
];

export const GatewayRegistrationsPage: React.FC<GatewayRegistrationsPageProps> = ({
  selectedCountry
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading] = useState(false);
  const [registrations] = useState(mockRegistrations);

  const handleCreateRegistration = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = (data: any) => {
    console.log('Creating registration:', data);
    setShowCreateForm(false);
  };

  if (loading) {
    return <Loading text="Loading gateway registrations..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Gateway Registrations"
        description="Manage journey registrations across gateways"
        breadcrumbs={[{ label: 'Gateway Registrations' }]}
        actions={
          <button
            type="button"
            onClick={handleCreateRegistration}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Registration
          </button>
        }
      />

      <div className="mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {registrations.map((registration) => (
              <li key={registration.registrationId} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Radio className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">{registration.name}</p>
                        <p className="text-sm text-gray-500">{registration.menuText}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        registration.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {registration.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex space-x-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Tag className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Position: {registration.position}</span>
                        {registration.priority && (
                          <span className="ml-2">(Priority: {registration.priority})</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{registration.provider.name}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <CountryFlag countryCode={selectedCountry} withName />
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Gateway:</span> {registration.gateway.name} ({registration.gateway.carrier.name})
                    {registration.shortCode && (
                      <span className="ml-2 font-mono">{registration.shortCode}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showCreateForm && (
        <CreateGatewayRegistrationForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
          initialCountry={selectedCountry}
        />
      )}
    </div>
  );
};