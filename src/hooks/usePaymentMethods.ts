import { useState, useEffect } from 'react';
import { PaymentMethod, PaymentMethodType, PaymentMethodStatus, PaymentTransaction } from '../types/payments';

// Mock data for development
const mockPaymentMethods: PaymentMethod[] = [
  {
    paymentMethodId: 'pm_1',
    providerId: 'provider_1',
    type: PaymentMethodType.CARD,
    status: PaymentMethodStatus.ACTIVE,
    isDefault: true,
    cardBrand: 'visa',
    cardLast4: '4242',
    cardExpiryMonth: 12,
    cardExpiryYear: 2025,
    cardHolderName: 'John Doe',
    billingAddress: {
      street: '123 Business Street',
      city: 'Douala',
      state: 'Littoral',
      postalCode: '12345',
      country: 'Cameroon'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    lastUsed: '2024-03-10T14:30:00Z'
  },
  {
    paymentMethodId: 'pm_2',
    providerId: 'provider_1',
    type: PaymentMethodType.MOBILE_MONEY,
    status: PaymentMethodStatus.ACTIVE,
    isDefault: false,
    mobileProvider: 'MTN Mobile Money',
    phoneNumber: '+237612345678',
    accountName: 'John Doe',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    lastUsed: '2024-03-05T09:15:00Z'
  },
  {
    paymentMethodId: 'pm_3',
    providerId: 'provider_1',
    type: PaymentMethodType.BANK_ACCOUNT,
    status: PaymentMethodStatus.PENDING_VERIFICATION,
    isDefault: false,
    bankName: 'Afriland First Bank',
    accountNumber: '****1234',
    accountHolderName: 'Tech Solutions Ltd',
    routingNumber: 'AFB001',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  }
];

const mockTransactions: PaymentTransaction[] = [
  {
    transactionId: 'txn_1',
    paymentMethodId: 'pm_1',
    amount: 75000,
    currency: 'XAF',
    status: 'COMPLETED',
    description: 'Monthly subscription - Professional Plan',
    createdAt: '2024-03-10T14:30:00Z',
    completedAt: '2024-03-10T14:30:15Z'
  },
  {
    transactionId: 'txn_2',
    paymentMethodId: 'pm_2',
    amount: 25000,
    currency: 'XAF',
    status: 'COMPLETED',
    description: 'API Credits Purchase',
    createdAt: '2024-03-05T09:15:00Z',
    completedAt: '2024-03-05T09:15:30Z'
  }
];

export const usePaymentMethods = (providerId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const filtered = mockPaymentMethods.filter(pm => pm.providerId === providerId);
        setPaymentMethods(filtered);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [providerId]);

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'paymentMethodId' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPaymentMethod: PaymentMethod = {
      ...paymentMethod,
      paymentMethodId: `pm_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPaymentMethods(prev => [newPaymentMethod, ...prev]);
    return newPaymentMethod;
  };

  const updatePaymentMethod = async (paymentMethodId: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPaymentMethods(prev => prev.map(pm => 
      pm.paymentMethodId === paymentMethodId 
        ? { ...pm, ...updates, updatedAt: new Date().toISOString() }
        : pm
    ));

    const updated = paymentMethods.find(pm => pm.paymentMethodId === paymentMethodId);
    if (!updated) throw new Error('Payment method not found');
    
    return { ...updated, ...updates, updatedAt: new Date().toISOString() };
  };

  const deletePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setPaymentMethods(prev => prev.filter(pm => pm.paymentMethodId !== paymentMethodId));
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.paymentMethodId === paymentMethodId,
      updatedAt: new Date().toISOString()
    })));
  };

  return {
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  };
};

export const usePaymentTransactions = (providerId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        setTransactions(mockTransactions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [providerId]);

  return { transactions, loading, error };
};