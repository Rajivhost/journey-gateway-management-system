import React, { useState } from 'react';
import { CreditCard, Receipt, Clock, TrendingUp } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PaymentTransactionsList } from '../../components/payments/PaymentTransactionsList';

export const BillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices' | 'usage'>('transactions');
  
  // Mock provider ID - in a real app, this would come from auth context
  const providerId = 'provider_1';

  // Mock billing summary data
  const billingSummary = {
    currentBalance: 0,
    nextBillingDate: '2024-04-15',
    lastPayment: {
      amount: 75000,
      date: '2024-03-15',
      status: 'completed'
    },
    monthlySpend: 75000,
    yearlySpend: 900000
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderTransactionsTab = () => (
    <PaymentTransactionsList providerId={providerId} />
  );

  const renderInvoicesTab = () => (
    <div className="text-center py-12">
      <Receipt className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Invoices Coming Soon</h3>
      <p className="mt-1 text-sm text-gray-500">
        Detailed invoices and billing statements will be available here.
      </p>
    </div>
  );

  const renderUsageTab = () => (
    <div className="text-center py-12">
      <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Usage Analytics Coming Soon</h3>
      <p className="mt-1 text-sm text-gray-500">
        Detailed usage analytics and spending insights will be available here.
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Billing & Transactions"
        description="View your billing history, transactions, and usage analytics"
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'Billing' }
        ]}
      />

      {/* Billing Summary */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Current Balance</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(billingSummary.currentBalance)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Next Billing</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatDate(billingSummary.nextBillingDate)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(billingSummary.monthlySpend)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">This Year</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(billingSummary.yearlySpend)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {[
                { id: 'transactions', name: 'Transactions', icon: DollarSign },
                { id: 'invoices', name: 'Invoices', icon: Receipt },
                { id: 'usage', name: 'Usage', icon: TrendingUp }
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
            {activeTab === 'transactions' && renderTransactionsTab()}
            {activeTab === 'invoices' && renderInvoicesTab()}
            {activeTab === 'usage' && renderUsageTab()}
          </div>
        </div>
      </div>
    </div>
  );
};