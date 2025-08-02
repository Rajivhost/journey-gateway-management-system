import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, Mail, Phone, Globe, MapPin, User, Calendar, ArrowLeft, 
  Edit, Shield, Users, DollarSign, Clock, Languages, Headphones,
  Award, Briefcase, TrendingUp, Code, Target, Building, AlertTriangle
} from 'lucide-react';
import { ServiceProviderStatus, CountryCode } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { CountryFlag } from '../../components/ui/CountryFlag';

export const ServiceProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'technical' | 'compliance'>('overview');

  // Mock data - replace with actual API call
  const provider = {
    providerId: id,
    name: 'Tech Solutions Ltd',
    email: 'contact@techsolutions.com',
    phone: '+237612345678',
    country: CountryCode.CM,
    status: ServiceProviderStatus.ACTIVE,
    companyName: 'Tech Solutions Limited',
    companyRegistrationNumber: 'RC123456',
    description: 'Leading mobile money service provider specializing in innovative financial technology solutions for emerging markets.',
    logoUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    website: 'https://techsolutions.com',
    address: '123 Tech Street, Bastos, Yaounde, Cameroon',
    contactPerson: 'John Doe',
    contactEmail: 'john@techsolutions.com',
    contactPhone: '+237612345679',
    businessType: 'Financial Technology',
    yearEstablished: 2018,
    numberOfEmployees: '50-100',
    annualRevenue: '$1M - $5M',
    servicesOffered: ['Mobile Money', 'Digital Payments', 'API Integration', 'USSD Services'],
    targetMarkets: ['Cameroon', 'Central Africa', 'West Africa'],
    complianceCertifications: ['PCI DSS', 'ISO 27001', 'SOC 2'],
    bankingPartners: ['Afriland First Bank', 'UBA', 'Ecobank'],
    technologyStack: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    supportedLanguages: ['English', 'French', 'Swahili'],
    operatingHours: '24/7 Support Available',
    emergencyContact: '+237698765432',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  };

  const getStatusBadge = (status: ServiceProviderStatus) => {
    switch (status) {
      case ServiceProviderStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Active
          </span>
        );
      case ServiceProviderStatus.INACTIVE:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            Inactive
          </span>
        );
      case ServiceProviderStatus.SUSPENDED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Suspended
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

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative px-6 pb-6">
          <div className="flex items-end -mt-16 mb-4">
            <div className="relative">
              {provider.logoUrl ? (
                <img
                  src={provider.logoUrl}
                  alt={`${provider.companyName} logo`}
                  className="w-24 h-24 rounded-lg border-4 border-white shadow-lg object-cover bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-6 pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{provider.companyName}</h1>
              <p className="text-gray-600">{provider.businessType}</p>
              <div className="flex items-center mt-2 space-x-4">
                {getStatusBadge(provider.status)}
                <div className="flex items-center text-sm text-gray-500">
                  <CountryFlag countryCode={provider.country} withName />
                </div>
              </div>
            </div>
          </div>
          
          {provider.description && (
            <p className="text-gray-700 leading-relaxed">{provider.description}</p>
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
                  <dd className="text-lg font-medium text-gray-900">{provider.yearEstablished}</dd>
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
                  <dd className="text-lg font-medium text-gray-900">{provider.numberOfEmployees}</dd>
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
                  <dd className="text-lg font-medium text-gray-900">{provider.annualRevenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Support</dt>
                  <dd className="text-sm font-medium text-gray-900">{provider.operatingHours}</dd>
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
              <dd className="mt-1 text-sm text-gray-900">{provider.contactPerson}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`mailto:${provider.contactEmail}`} className="text-blue-600 hover:text-blue-800">
                  {provider.contactEmail}
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`tel:${provider.contactPhone}`} className="text-blue-600 hover:text-blue-800">
                  {provider.contactPhone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                <a href={`tel:${provider.emergencyContact}`} className="text-blue-600 hover:text-blue-800">
                  {provider.emergencyContact}
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Globe className="h-4 w-4 text-gray-400 mr-2" />
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {provider.website}
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                {provider.address}
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
            {provider.servicesOffered?.map((service, index) => (
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
            {provider.targetMarkets?.map((market, index) => (
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {provider.bankingPartners?.map((partner, index) => (
              <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <Building className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Languages */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Languages className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Supported Languages</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {provider.supportedLanguages?.map((language, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechnicalTab = () => (
    <div className="space-y-6">
      {/* Technology Stack */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Code className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Technology Stack</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {provider.technologyStack?.map((tech, index) => (
              <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <Code className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Integration Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Globe className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Integration Capabilities</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">API Version</dt>
              <dd className="mt-1 text-sm text-gray-900">v2.1</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Response Format</dt>
              <dd className="mt-1 text-sm text-gray-900">JSON, XML</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Authentication</dt>
              <dd className="mt-1 text-sm text-gray-900">OAuth 2.0, API Keys</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rate Limits</dt>
              <dd className="mt-1 text-sm text-gray-900">1000 requests/minute</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      {/* Compliance Certifications */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Award className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Compliance Certifications</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {provider.complianceCertifications?.map((cert, index) => (
              <div key={index} className="flex items-center p-4 border border-green-200 rounded-lg bg-green-50">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-green-900">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Measures */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Security Measures</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">End-to-end encryption for all transactions</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Multi-factor authentication</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Regular security audits and penetration testing</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">24/7 fraud monitoring and detection</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">GDPR and data protection compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{provider.companyRegistrationNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Created</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(provider.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(provider.updatedAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1">{getStatusBadge(provider.status)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={provider.companyName}
        description={`Service Provider • ${provider.businessType}`}
        breadcrumbs={[
          { label: 'Service Providers', path: '/providers' },
          { label: provider.companyName }
        ]}
        actions={
          <div className="flex space-x-3">
            <Link
              to="/providers"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Providers
            </Link>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Provider
            </button>
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
                { id: 'business', name: 'Business', icon: TrendingUp },
                { id: 'technical', name: 'Technical', icon: Code },
                { id: 'compliance', name: 'Compliance', icon: Shield }
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
            {activeTab === 'technical' && renderTechnicalTab()}
            {activeTab === 'compliance' && renderComplianceTab()}
          </div>
        </div>
      </div>
    </div>
  );
};