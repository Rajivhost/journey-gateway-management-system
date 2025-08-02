import React from 'react';
import { CreditCard, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SettingsCard } from '../../components/settings/SettingsCard';

interface SubscriptionDetails {
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  plan: string;
  currentPeriodEnd: string;
  amount: number;
  interval: 'month' | 'year';
  paymentMethod: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export const SubscriptionSettings: React.FC = () => {
  // This would normally come from your Stripe integration
  const subscription: SubscriptionDetails = {
    status: 'active',
    plan: 'Professional',
    currentPeriodEnd: '2024-04-15',
    amount: 99,
    interval: 'month',
    paymentMethod: {
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025
    }
  };

  const getStatusBadge = (status: SubscriptionDetails['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Active
          </span>
        );
      case 'past_due':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Past Due
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-4 h-4 mr-1" />
            Incomplete
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Current Subscription"
        description="Manage your subscription and billing details"
        icon={CreditCard}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{subscription.plan} Plan</h3>
              <p className="mt-1 text-sm text-gray-500">
                ${subscription.amount}/{subscription.interval}
              </p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <dl className="divide-y divide-gray-200">
              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Billing period</dt>
                <dd className="text-gray-900">
                  Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </dd>
              </div>

              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Payment method</dt>
                <dd className="text-gray-900">
                  {subscription.paymentMethod.brand.toUpperCase()} ending in{' '}
                  {subscription.paymentMethod.last4}
                </dd>
              </div>

              <div className="py-3 flex justify-between text-sm">
                <dt className="text-gray-500">Card expiry</dt>
                <dd className="text-gray-900">
                  {subscription.paymentMethod.expiryMonth}/
                  {subscription.paymentMethod.expiryYear}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Payment Method
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Billing History
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Billing History"
        description="View your past invoices and billing history"
        icon={Clock}
      >
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                  Mar 1, 2024
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  Professional Plan - Monthly
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  $99.00
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Download<span className="sr-only">, invoice from Mar 1, 2024</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                  Feb 1, 2024
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  Professional Plan - Monthly
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  $99.00
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Download<span className="sr-only">, invoice from Feb 1, 2024</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
};