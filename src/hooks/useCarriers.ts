import { useState, useEffect } from 'react';
import { Carrier, CountryCode } from '../types';
import { mockCarriers } from '../mocks/gatewayData';

// Hook to fetch carriers for a country
export const useCarriers = (country: CountryCode) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  useEffect(() => {
    const fetchCarriers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Filter carriers by country
        const filteredCarriers = mockCarriers.filter(carrier => carrier.country === country);
        setCarriers(filteredCarriers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch carriers'));
      } finally {
        setLoading(false);
      }
    };

    fetchCarriers();
  }, [country]);

  return { carriers, loading, error };
};

// Hook to fetch a single carrier
export const useCarrier = (carrierId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [carrier, setCarrier] = useState<Carrier | null>(null);

  useEffect(() => {
    const fetchCarrier = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const found = mockCarriers.find(c => c.carrierId === carrierId);
        if (found) {
          setCarrier(found);
        } else {
          throw new Error('Carrier not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch carrier'));
      } finally {
        setLoading(false);
      }
    };

    fetchCarrier();
  }, [carrierId]);

  return { carrier, loading, error };
};