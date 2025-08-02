import { useState } from 'react';
import { Price } from '../types/products';

interface CreatePriceInput {
  productId: string;
  name: string;
  priceType: string;
  unitAmount?: number;
  billingScheme: string;
  currency: string;
  active: boolean;
  interval?: string;
  intervalCount?: number;
  usageType?: string;
  trialPeriodDays?: number;
}

export const usePrices = (productId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPrice = async (input: CreatePriceInput): Promise<Price> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPrice: Price = {
        priceId: `price_${Date.now()}`,
        name: input.name,
        active: input.active,
        currency: input.currency as any,
        priceType: input.priceType as any,
        recurring: input.priceType === 'RECURRING' ? {
          interval: input.interval as any,
          usageType: input.usageType as any,
          intervalCount: input.intervalCount || 1,
          trialPeriodDays: input.trialPeriodDays
        } : undefined,
        unitAmount: input.unitAmount,
        billingScheme: input.billingScheme as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return newPrice;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create price');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (priceId: string, input: Partial<CreatePriceInput>): Promise<Price> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would update the existing price
      const updatedPrice: Price = {
        priceId,
        name: input.name || 'Updated Price',
        active: input.active ?? true,
        currency: (input.currency as any) || 'XAF',
        priceType: (input.priceType as any) || 'RECURRING',
        unitAmount: input.unitAmount,
        billingScheme: (input.billingScheme as any) || 'PER_UNIT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return updatedPrice;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update price');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePrice = async (priceId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would delete the price
      console.log('Price deleted:', priceId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete price');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPrice,
    updatePrice,
    deletePrice
  };
};