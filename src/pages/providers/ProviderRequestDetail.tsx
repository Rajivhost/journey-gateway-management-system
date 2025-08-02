import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, Mail, Phone, Globe, MapPin, User, Calendar, ArrowLeft, 
  CheckCircle, XCircle, FileText, Shield, Users, DollarSign, Clock, 
  Languages, Award, Briefcase, Target, Building, AlertTriangle, Eye,
  Download, MessageSquare
} from 'lucide-react';
import { RegistrationStatus, CountryCode } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CountryFlag } from '../../components/ui/CountryFlag';

export const ProviderRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'documents' | 'review'>('overview');

  // Mock data - replace with actual API call
  const request = {
    requestId: id,
    name: 'John Doe',
    email: 'john@finnovate.com',
    phone: '+237612345678',
    country: CountryCode.CM,
    status: RegistrationStatus.PENDING,
    companyName: 'FinNovate Solutions',
    companyRegistrationNumber: 'RC789012',
    description: 'Innovative fintech startup focused on mobile payment solutions for small businesses and rural communities in Central Africa.',
    logoUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    website: 'https://finnovate.com',
    address: '456 Innovation Hub, Douala, Cameroon',
    contactPerson: 'John Doe',
    contactEmail: 'john@finnovate.com',
    contactPhone: '+237612345678',
    businessType: 'Financial Technology',
    yearEstablished: 2023,
    numberOfEmployees: '10-25',
    annualRevenue: '$100K - $500K',
    servicesOffered: ['Mobile Payments', 'Micro-lending', 'Digital Wallets', 'Merchant Services'],
    targetMarkets: ['Cameroon', 'Chad', 'Central African Republic'],
    complianceCertifications: ['PCI DSS Level 1', 'ISO 27001'],
    bankingPartners: ['Commercial Bank of Cameroon', 'Afriland First Bank'],
    technologyStack: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
    supportedLanguages: ['English', 'French'],
    operatingHours: 'Monday-Friday 8AM-6PM',
    emergencyContact: '+237698765432',
    submittedDocuments: [
      'Business Registration Certificate',
      'Tax Clearance Certificate',
      'Financial Statements (2023)',
      'Compliance Audit Report',
      'Technical Architecture Document',
      'Security Assessment Report'
    ],
    reviewNotes: 'Initial review completed. Awaiting final compliance verification.',
    reviewedBy: 'Admin User',
    reviewedAt: '2024-03-15T14:30:00Z',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.PENDING:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-2" />
            Pending Review
          </span>
        );
      case RegistrationStatus.APPROVED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved
          </span>
        );
      case RegistrationStatus.REJECTED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-2" />
            Rejected
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = async () => {
    console.log('Approving request:', id);
  };

  const handleReject = async () => {
    console.log('Rejecting request:', id);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-green-500 to-blue-600">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative px-6 pb-6">
          <div className="flex items-end -mt-16 mb-4">
            <div className="relative">
              {request.logoUrl ? (
                <img
                  src={request.logoUrl}
                  alt={`${request.companyName} logo`}
                  className="w-24 h-24 rounded-lg border-4 border-white shadow-lg object-cover bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-6 pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{request.companyName}</h1>
              <p className="text-gray-600">{request.businessType}</p>
              <div className="flex items-center mt-2 space-x-4">
                {getStatusBadge(request.status)}
                <div className="flex items-center text-sm text-gray-500">
                  <CountryFlag countryCode={request.country} withName />
                </div>
              </div>
            </div>
          </div>
          
          {request.description && (
            <p className="text-gray-700 leading-relaxed">{request.description}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Established</dt>
                  <dd className="text-lg font-medium text-gray-900">{request.yearEstablished}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Employees</dt>
                  <dd className="text-lg font-medium text-gray-900">{request.numberOfEmployees}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Annual Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">{request.annualRevenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Documents</dt>
                  <dd className="text-lg font-medium text-gray-900">{request.submittedDocuments?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Primary Contact</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.contactPerson}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`mailto:${request.contactEmail}`} className="text-blue-600 hover:text-blue-800">
                  {request.contactEmail}
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`tel:${request.contactPhone}`} className="text-blue-600 hover:text-blue-800">
                  {request.contactPhone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                <a href={`tel:${request.emergencyContact}`} className="text-blue-600 hover:text-blue-800">
                  {request.emergencyContact}
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Globe className="h-4 w-4 text-gray-400 mr-2" />
                <a href={request.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {request.website}
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                {request.address}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      {/* Services Offered */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Services Offered</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {request.servicesOffered?.map((service, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Target Markets */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Target Markets</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {request.targetMarkets?.map((market, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {market}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Banking Partners */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Banking Partners</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {request.bankingPartners?.map((partner, index) => (
              <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <Building className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Certifications */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Award className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Compliance Certifications</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {request.complianceCertifications?.map((cert, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Shield className="h-4 w-4 mr-1" />
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      {/* Submitted Documents */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Submitted Documents</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-3">
            {request.submittedDocuments?.map((document, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">{document}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </button>
                  <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Verification Status */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Verification Status</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Business Registration</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Tax Clearance</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Financial Statements</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                Under Review
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Compliance Audit</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewTab = () => (
    <div className="space-y-6">
      {/* Review Status */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Review Information</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Status</dt>
              <dd className="mt-1">{getStatusBadge(request.status)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Reviewed By</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.reviewedBy || 'Not yet reviewed'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Review Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.reviewedAt ? formatDate(request.reviewedAt) : 'Not yet reviewed'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Submitted Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(request.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Review Notes */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Review Notes</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {request.reviewNotes ? (
            <p className="text-sm text-gray-900">{request.reviewNotes}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">No review notes available</p>
          )}
        </div>
      </div>

      {/* Review Actions */}
      {request.status === RegistrationStatus.PENDING && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Review Actions</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="reviewNotes" className="block text-sm font-medium text-gray-700">
                  Review Notes
                </label>
                <textarea
                  id="reviewNotes"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Add your review notes here..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Request
                </button>
                <button
                  onClick={handleReject}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Registration Request Details"
        description={`${request.companyName} • ${request.businessType}`}
        breadcrumbs={[
          { label: 'Registration Requests', path: '/providers/requests' },
          { label: request.companyName }
        ]}
        actions={
          <div className="flex space-x-3">
            <Link
              to="/providers/requests"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Link>
            
            {request.status === RegistrationStatus.PENDING && (
              <>
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="mt-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: Building2 },
                { id: 'business', name: 'Business', icon: Briefcase },
                { id: 'documents', name: 'Documents', icon: FileText },
                { id: 'review', name: 'Review', icon: MessageSquare }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'business' && renderBusinessTab()}
            {activeTab === 'documents' && renderDocumentsTab()}
            {activeTab === 'review' && renderReviewTab()}
          </div>
        </div>
      </div>
    </div>
  );
};