import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Building2, CreditCard, DollarSign, 
  TrendingUp, Calendar, Clock, CheckCircle, XCircle, AlertTriangle,
  RefreshCw, BarChart3, Activity
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useJourneyGatewayRegistration } from '../../hooks/useJourneyGatewayRegistrations';
import { Loading } from '../../components/ui/Loading';
import { CountryFlag } from '../../components/ui/CountryFlag';

export const GatewayRegistrationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { registration, loading, error } = useJourneyGatewayRegistration(id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'analytics'>('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatCredits = (credits: number) => {
    return credits.toLocaleString();
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

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-4 h-4 mr-2" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-4 h-4 mr-2" />
        Inactive
      </span>
    );
  };

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    console.log('Edit registration:', id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      console.log('Delete registration:', id);
      navigate('/gateways');
    }
  };

  if (loading) {
    return <Loading text="Loading registration details..." />;
  }

  if (error || !registration) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p className="font-medium">Error loading registration</p>
          <p className="mt-1 text-sm">{error?.message || 'Registration not found'}</p>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Registration Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Registration Information</h3>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(registration.active)}
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Registration Name</h4>
              <p className="mt-1 text-sm text-gray-900">{registration.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Menu Text</h4>
              <p className="mt-1 text-sm text-gray-900">{registration.menuText}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Position</h4>
              <p className="mt-1 text-sm text-gray-900">{registration.position}</p>
            </div>
            
            {registration.priority && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Priority</h4>
                <p className="mt-1 text-sm text-gray-900">{registration.priority}</p>
              </div>
            )}
            
            {registration.shortCode && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Short Code</h4>
                <p className="mt-1 text-sm text-gray-900 font-mono">{registration.shortCode}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Country</h4>
              <div className="mt-1">
                <CountryFlag countryCode={registration.gateway.country} withName />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway & Journey Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Gateway</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Gateway Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{registration.gateway.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Carrier</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {registration.gateway.carrier.name} ({registration.gateway.carrier.code})
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Short Code</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{registration.gateway.shortCode}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Journey</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Journey Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{registration.journey.name}</dd>
              </div>
              {registration.journey.description && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{registration.journey.description}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Service Provider</dt>
                <dd className="mt-1 text-sm text-gray-900">{registration.provider.name}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      {registration.priceInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Pricing Plan</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{registration.priceInfo.name}</h4>
                <p className="text-sm text-gray-500">{registration.priceInfo.productName}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(registration.priceInfo.amount)}
                </p>
                <p className="text-sm text-gray-500">per {registration.priceInfo.interval}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCreditsTab = () => (
    <div className="space-y-6">
      {registration.creditBalance ? (
        <>
          {/* Credit Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Credits</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCredits(registration.creditBalance.totalCredits)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Used Credits</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCredits(registration.creditBalance.usedCredits)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <RefreshCw className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Remaining</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCredits(registration.creditBalance.remainingCredits)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Usage Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Credit Usage</h3>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Usage Progress</span>
                    <span>
                      {((registration.creditBalance.usedCredits / registration.creditBalance.totalCredits) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ 
                        width: `${(registration.creditBalance.usedCredits / registration.creditBalance.totalCredits) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Credits Used</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCredits(registration.creditBalance.usedCredits)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Credits Remaining</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCredits(registration.creditBalance.remainingCredits)}
                      </span>
                    </div>
                  </div>
                </div>

                {registration.creditBalance.expiryDate && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Credit Expiry</p>
                        <p className="text-sm text-yellow-700">
                          Credits expire on {formatDate(registration.creditBalance.expiryDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Last updated: {formatDate(registration.creditBalance.lastUpdated)}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Credit Plan</h3>
          <p className="text-gray-600">This registration is using free access without credit limitations.</p>
        </div>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Coming Soon</h3>
        <p className="mt-1 text-sm text-gray-500">
          Detailed usage analytics and performance metrics will be available here.
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={registration.name}
        description={`Gateway Registration • ${registration.gateway.name}`}
        breadcrumbs={[
          { label: 'Gateways', path: '/gateways' },
          { label: registration.gateway.name, path: `/gateways/${registration.gateway.gatewayId}` },
          { label: registration.name }
        ]}
        actions={
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/gateways/${registration.gateway.gatewayId}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gateway
            </button>
            
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
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
                { id: 'credits', name: 'Credits', icon: DollarSign },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
            {activeTab === 'credits' && renderCreditsTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};