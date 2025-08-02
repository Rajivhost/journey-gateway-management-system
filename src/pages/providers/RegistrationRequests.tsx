import React, { useState } from 'react';
import { Check, X, MoreHorizontal, UserCog, Eye, Building2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProviderRequest, CountryCode, RegistrationStatus } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { Loading } from '../../components/ui/Loading';

interface RegistrationRequestsPageProps {
  selectedCountry: CountryCode;
}

// Mock data - replace with actual API call
const mockRequests: ProviderRequest[] = [
  {
    requestId: '1',
    name: 'John Doe',
    email: 'john@finnovate.com',
    phone: '+237612345678',
    country: CountryCode.CM,
    status: RegistrationStatus.PENDING,
    companyName: 'FinNovate Solutions',
    companyRegistrationNumber: 'RC789012',
    description: 'Innovative fintech startup focused on mobile payment solutions for small businesses.',
    logoUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    website: 'https://finnovate.com',
    businessType: 'Financial Technology',
    yearEstablished: 2023,
    numberOfEmployees: '10-25',
    servicesOffered: ['Mobile Payments', 'Micro-lending', 'Digital Wallets'],
    submittedDocuments: ['Business Registration', 'Tax Clearance', 'Financial Statements'],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    requestId: '2',
    name: 'Sarah Wilson',
    email: 'sarah@paytech.cm',
    phone: '+237687654321',
    country: CountryCode.CM,
    status: RegistrationStatus.APPROVED,
    companyName: 'PayTech Cameroon',
    companyRegistrationNumber: 'RC456789',
    description: 'Digital payment platform specializing in cross-border transactions.',
    logoUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    website: 'https://paytech.cm',
    businessType: 'Payment Processing',
    yearEstablished: 2022,
    numberOfEmployees: '25-50',
    servicesOffered: ['Cross-border Payments', 'Currency Exchange', 'Remittances'],
    submittedDocuments: ['Business Registration', 'Tax Clearance', 'Financial Statements', 'Compliance Audit'],
    reviewedBy: 'Admin User',
    reviewedAt: '2024-03-12T15:30:00Z',
    createdAt: '2024-03-08T09:00:00Z',
    updatedAt: '2024-03-12T15:30:00Z'
  },
  {
    requestId: '3',
    name: 'Michael Chen',
    email: 'michael@cryptopay.cm',
    phone: '+237698765432',
    country: CountryCode.CM,
    status: RegistrationStatus.REJECTED,
    companyName: 'CryptoPay Solutions',
    companyRegistrationNumber: 'RC123789',
    description: 'Cryptocurrency payment gateway for e-commerce platforms.',
    website: 'https://cryptopay.cm',
    businessType: 'Cryptocurrency',
    yearEstablished: 2024,
    numberOfEmployees: '5-10',
    servicesOffered: ['Crypto Payments', 'Blockchain Integration'],
    submittedDocuments: ['Business Registration', 'Technical Documentation'],
    reviewNotes: 'Insufficient compliance documentation for cryptocurrency operations.',
    reviewedBy: 'Compliance Officer',
    reviewedAt: '2024-03-14T11:45:00Z',
    createdAt: '2024-03-05T14:20:00Z',
    updatedAt: '2024-03-14T11:45:00Z'
  }
];

export const RegistrationRequestsPage: React.FC<RegistrationRequestsPageProps> = ({
  selectedCountry
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [requests] = useState<ProviderRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | ''>('');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.businessType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (requestId: string) => {
    try {
      console.log('Approving request:', requestId);
    } catch (err) {
      console.error('Failed to approve request:', err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      console.log('Rejecting request:', requestId);
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  if (loading) {
    return <Loading text="Loading registration requests..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading requests</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.PENDING:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case RegistrationStatus.APPROVED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case RegistrationStatus.REJECTED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Registration Requests"
        description="Review and manage service provider registration requests"
        breadcrumbs={[{ label: 'Registration Requests' }]}
      />

      {/* Search and Filter */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | '')}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={RegistrationStatus.PENDING}>Pending</option>
              <option value={RegistrationStatus.APPROVED}>Approved</option>
              <option value={RegistrationStatus.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredRequests.map((request) => (
          <div key={request.requestId} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {request.logoUrl ? (
                    <img
                      src={request.logoUrl}
                      alt={`${request.companyName} logo`}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{request.companyName}</h3>
                    <p className="text-sm text-gray-500">{request.businessType}</p>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>

              {/* Description */}
              {request.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{request.description}</p>
              )}

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Contact Person:</span>
                  <span className="text-gray-900 font-medium">{request.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Registration:</span>
                  <span className="text-gray-900 font-mono">{request.companyRegistrationNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Established:</span>
                  <span className="text-gray-900">{request.yearEstablished}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Employees:</span>
                  <span className="text-gray-900">{request.numberOfEmployees}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Documents:</span>
                  <span className="text-gray-900">{request.submittedDocuments?.length || 0} submitted</span>
                </div>
              </div>

              {/* Services */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {request.servicesOffered?.slice(0, 2).map((service, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {service}
                    </span>
                  ))}
                  {request.servicesOffered && request.servicesOffered.length > 2 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{request.servicesOffered.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <CountryFlag countryCode={request.country} withName />
                  <span className="ml-3">Submitted {formatDate(request.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/providers/requests/${request.requestId}`}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  {request.status === RegistrationStatus.PENDING && (
                    <>
                      <button
                        onClick={() => handleApprove(request.requestId)}
                        className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        title="Approve request"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(request.requestId)}
                        className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Reject request"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  <button className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="mt-6 text-center py-12">
          <UserCog className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter ? 'Try adjusting your search or filter criteria.' : 'No registration requests at this time.'}
          </p>
        </div>
      )}
    </div>
  );
};