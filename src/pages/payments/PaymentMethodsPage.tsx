import React, { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PaymentMethodsList } from '../../components/payments/PaymentMethodsList';
import { AddPaymentMethodForm } from '../../components/payments/AddPaymentMethodForm';
import { EditPaymentMethodForm } from '../../components/payments/EditPaymentMethodForm';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { PaymentMethod } from '../../types/payments';

export const PaymentMethodsPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  
  // Mock provider ID - in a real app, this would come from auth context
  const providerId = 'provider_1';
  
  const {
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  } = usePaymentMethods(providerId);

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  const handleAddSubmit = async (data: any) => {
    try {
      await addPaymentMethod({
        ...data,
        providerId
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setEditingMethod(paymentMethod);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingMethod) return;
    
    try {
      await updatePaymentMethod(editingMethod.paymentMethodId, data);
      setEditingMethod(null);
    } catch (error) {
      console.error('Failed to update payment method:', error);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (window.confirm('Are you sure you want to delete this payment method? This action cannot be undone.')) {
      try {
        await deletePaymentMethod(paymentMethodId);
      } catch (error) {
        console.error('Failed to delete payment method:', error);
      }
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId);
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Payment Methods"
        description="Manage your payment methods for subscriptions and billing"
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'Payment Methods' }
        ]}
        actions={
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </button>
        }
      />

      <div className="mt-6">
        <PaymentMethodsList
          paymentMethods={paymentMethods}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
          onAddNew={handleAddNew}
        />
      </div>

      {showAddForm && (
        <AddPaymentMethodForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {editingMethod && (
        <EditPaymentMethodForm
          paymentMethod={editingMethod}
          onClose={() => setEditingMethod(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};