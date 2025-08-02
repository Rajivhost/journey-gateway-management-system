import React from 'react';
import { ArrowUp, ArrowDown, CheckCircle, XCircle, Building2, CreditCard, DollarSign } from 'lucide-react';
import { CountryCode } from '../../types';
import { useJourneyGatewayRegistrations as useGatewayRegistrations } from '../../hooks/useJourneyGatewayRegistrations';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface GatewayRegistrationListProps {
  gatewayId: string;
  country: CountryCode;
}

export const GatewayRegistrationList: React.FC<GatewayRegistrationListProps> = ({
  gatewayId,
  country
}) => {
  const { registrations, loading, error } = useGatewayRegistrations(country);

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

  if (loading) {
    return <Loading text="Loading gateway registrations..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading registrations</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <EmptyState
        title="No registrations found"
        description="Add journey registrations to this gateway to enable service provider access."
        icon={<Building2 className="w-8 h-8 text-gray-400" />}
      />
    );
  }

  return (
    <div className="overflow-hidden bg-white">
      <ul className="divide-y divide-gray-200">
        {registrations.map((registration) => (
          <li key={registration.registrationId} className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {registration.position}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{registration.name}</p>
                    {registration.priceInfo && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Paid Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{registration.menuText}</p>
                  
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {registration.provider.name}
                    </span>
                    {registration.priority && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Priority: {registration.priority}
                      </span>
                    )}
                  </div>

                  {/* Pricing Information */}
                  {registration.priceInfo && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{registration.priceInfo.name}</p>
                          <p className="text-xs text-gray-500">{registration.priceInfo.productName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(registration.priceInfo.amount)}
                          </p>
                          <p className="text-xs text-gray-500">per {registration.priceInfo.interval}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Credit Balance */}
                  {registration.creditBalance && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-900">Credit Balance</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-900">
                            {formatCredits(registration.creditBalance.remainingCredits)} remaining
                          </p>
                          <p className="text-xs text-blue-700">
                            of {formatCredits(registration.creditBalance.totalCredits)} total
                          </p>
                        </div>
                      </div>
                      
                      {/* Credit Usage Bar */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-blue-700 mb-1">
                          <span>Used: {formatCredits(registration.creditBalance.usedCredits)}</span>
                          <span>
                            {((registration.creditBalance.usedCredits / registration.creditBalance.totalCredits) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${(registration.creditBalance.usedCredits / registration.creditBalance.totalCredits) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {registration.creditBalance.expiryDate && (
                        <p className="text-xs text-blue-600 mt-2">
                          Expires: {new Date(registration.creditBalance.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {registration.active ? (
                  <span className="inline-flex items-center text-xs text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <XCircle className="h-4 w-4 mr-1 text-gray-400" />
                    Inactive
                  </span>
                )}
                
                <div className="flex">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-500"
                    title="Move up"
                    disabled={registration.position === 1}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-500"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};