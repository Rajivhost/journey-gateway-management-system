import React from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { PaymentMethod } from '../../types/payments';
import { PaymentMethodCard } from './PaymentMethodCard';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: Error | null;
  onEdit: (paymentMethod: PaymentMethod) => void;
  onDelete: (paymentMethodId: string) => void;
  onSetDefault: (paymentMethodId: string) => void;
  onAddNew: () => void;
}

export const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  paymentMethods,
  loading,
  error,
  onEdit,
  onDelete,
  onSetDefault,
  onAddNew
}) => {
  if (loading) {
    return <Loading text="Loading payment methods..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading payment methods</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <EmptyState
        title="No payment methods"
        description="Add a payment method to start accepting payments and managing subscriptions."
        icon={<CreditCard className="w-8 h-8 text-gray-400" />}
        actionLabel="Add Payment Method"
        onAction={onAddNew}
      />
    );
  }

  // Sort payment methods: default first, then by creation date
  const sortedMethods = [...paymentMethods].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Methods Overview</h3>
            <p className="mt-1 text-sm text-gray-500">
              You have {paymentMethods.length} payment method{paymentMethods.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>{paymentMethods.filter(pm => pm.status === 'ACTIVE').length} Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>{paymentMethods.filter(pm => pm.status === 'PENDING_VERIFICATION').length} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedMethods.map((paymentMethod) => (
          <PaymentMethodCard
            key={paymentMethod.paymentMethodId}
            paymentMethod={paymentMethod}
            onEdit={onEdit}
            onDelete={onDelete}
            onSetDefault={onSetDefault}
          />
        ))}
      </div>

      {/* Add New Card */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 transition-colors duration-200">
        <button
          onClick={onAddNew}
          className="w-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Add New Payment Method</span>
          <span className="text-xs text-gray-400 mt-1">Credit card, bank account, or mobile money</span>
        </button>
      </div>
    </div>
  );
};