import React, { useState } from 'react';
import { Plus, Building2, Globe, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountryCode, ServiceProvider, ServiceProviderStatus } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { CreateServiceProviderForm } from '../../components/providers/CreateServiceProviderForm';

interface ServiceProviderListPageProps {
  selectedCountry: CountryCode;
}

// Mock data - replace with actual API call
const mockProviders: ServiceProvider[] = [
  {
    providerId: '1',
    name: 'Tech Solutions Ltd',
    email: 'contact@techsolutions.com',
    phone: '+237612345678',
    country: CountryCode.CM,
    status: ServiceProviderStatus.ACTIVE,
    companyName: 'Tech Solutions Limited',
    companyRegistrationNumber: 'RC123456',
    description: 'Leading mobile money service provider specializing in innovative financial technology solutions.',
    logoUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    website: 'https://techsolutions.com',
    address: '123 Tech Street, Yaounde',
    contactPerson: 'John Doe',
    contactEmail: 'john@techsolutions.com',
    contactPhone: '+237612345679',
    businessType: 'Financial Technology',
    yearEstablished: 2018,
    numberOfEmployees: '50-100',
    servicesOffered: ['Mobile Money', 'Digital Payments', 'API Integration'],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    providerId: '2',
    name: 'Digital Payments Inc',
    email: 'info@digitalpayments.com',
    phone: '+237687654321',
    country: CountryCode.CM,
    status: ServiceProviderStatus.ACTIVE,
    companyName: 'Digital Payments Incorporated',
    companyRegistrationNumber: 'RC789012',
    description: 'Digital payment solutions provider focused on merchant services and e-commerce integration.',
    logoUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    website: 'https://digitalpayments.com',
    address: '456 Digital Avenue, Douala',
    contactPerson: 'Jane Smith',
    contactEmail: 'jane@digitalpayments.com',
    contactPhone: '+237687654322',
    businessType: 'Payment Processing',
    yearEstablished: 2020,
    numberOfEmployees: '25-50',
    servicesOffered: ['Payment Gateway', 'Merchant Services', 'E-commerce'],
    createdAt: '2024-03-11T10:00:00Z',
    updatedAt: '2024-03-11T10:00:00Z'
  },
  {
    providerId: '3',
    name: 'FinTech Innovations',
    email: 'hello@fintechinnovations.com',
    phone: '+237698765432',
    country: CountryCode.CM,
    status: ServiceProviderStatus.INACTIVE,
    companyName: 'FinTech Innovations SARL',
    companyRegistrationNumber: 'RC345678',
    description: 'Innovative financial technology solutions for small and medium enterprises.',
    website: 'https://fintechinnovations.com',
    address: '789 Innovation Street, Bafoussam',
    contactPerson: 'Michael Johnson',
    contactEmail: 'michael@fintechinnovations.com',
    contactPhone: '+237698765433',
    businessType: 'Financial Technology',
    yearEstablished: 2021,
    numberOfEmployees: '10-25',
    servicesOffered: ['Micro-lending', 'Digital Wallets', 'Financial Analytics'],
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z'
  }
];

export const ServiceProviderListPage: React.FC<ServiceProviderListPageProps> = ({
  selectedCountry
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [providers] = useState<ServiceProvider[]>(mockProviders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceProviderStatus | ''>('');

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.businessType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || provider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProvider = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = (data: any) => {
    console.log('Creating provider:', data);
    setShowCreateForm(false);
  };

  const getStatusBadge = (status: ServiceProviderStatus) => {
    switch (status) {
      case ServiceProviderStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
            Active
          </span>
        );
      case ServiceProviderStatus.INACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></div>
            Inactive
          </span>
        );
      case ServiceProviderStatus.SUSPENDED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></div>
            Suspended
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Service Providers"
        description="Manage service providers and their configurations"
        breadcrumbs={[{ label: 'Service Providers' }]}
        actions={
          <button
            type="button"
            onClick={handleCreateProvider}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </button>
        }
      />

      {/* Search and Filter */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ServiceProviderStatus | '')}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={ServiceProviderStatus.ACTIVE}>Active</option>
              <option value={ServiceProviderStatus.INACTIVE}>Inactive</option>
              <option value={ServiceProviderStatus.SUSPENDED}>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.map((provider) => (
          <div key={provider.providerId} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              {/* Header with Logo and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {provider.logoUrl ? (
                    <img
                      src={provider.logoUrl}
                      alt={`${provider.companyName} logo`}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{provider.companyName}</h3>
                    <p className="text-sm text-gray-500">{provider.businessType}</p>
                  </div>
                </div>
                {getStatusBadge(provider.status)}
              </div>

              {/* Description */}
              {provider.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{provider.description}</p>
              )}

              {/* Services */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {provider.servicesOffered?.slice(0, 3).map((service, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {service}
                    </span>
                  ))}
                  {provider.servicesOffered && provider.servicesOffered.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{provider.servicesOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  <span className="truncate">{provider.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  <span>{provider.phone}</span>
                </div>
                {provider.website && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate">
                      {provider.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <CountryFlag countryCode={provider.country} withName />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/providers/${provider.providerId}`}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  
                  <button
                    type="button"
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Edit provider"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center p-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Delete provider"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="mt-6 text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new service provider.'}
          </p>
          {!searchTerm && !statusFilter && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateProvider}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </button>
            </div>
          )}
        </div>
      )}

      {showCreateForm && (
        <CreateServiceProviderForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
          initialCountry={selectedCountry}
        />
      )}
    </div>
  );
};