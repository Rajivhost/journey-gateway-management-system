import { useState, useEffect } from 'react';
import { JourneyGateway, CountryCode, FilterOptions } from '../types';
import { mockGateways } from '../mocks/gatewayData';

// This would be replaced with actual API calls in a real implementation
export const useGateways = (
  country: CountryCode,
  filter?: FilterOptions,
  limit: number = 10,
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [gateways, setGateways] = useState<JourneyGateway[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchGateways = async () => {
      setLoading(true);
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter mockGateways according to filter criteria
        let filteredGateways = mockGateways.filter(gateway => gateway.country === country);
        
        if (filter) {
          if (filter.status) {
            filteredGateways = filteredGateways.filter(gateway => gateway.status === filter.status);
          }
          
          if (filter.carrierId) {
            filteredGateways = filteredGateways.filter(gateway => gateway.carrier.carrierId === filter.carrierId);
          }
          
          if (filter.gatewayType) {
            filteredGateways = filteredGateways.filter(gateway => gateway.gatewayType === filter.gatewayType);
          }
          
          if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filteredGateways = filteredGateways.filter(gateway => 
              gateway.name.toLowerCase().includes(searchLower) || 
              gateway.description?.toLowerCase().includes(searchLower) ||
              gateway.shortCode.toLowerCase().includes(searchLower)
            );
          }
        }
        
        // In a real implementation, we would use the cursor for pagination
        setGateways(filteredGateways.slice(0, limit));
        setHasMore(filteredGateways.length > limit);
        setCursor(filteredGateways.length > limit ? "next-page" : null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gateways'));
      } finally {
        setLoading(false);
      }
    };

    fetchGateways();
  }, [country, filter, limit]);

  return { gateways, loading, error, hasMore, cursor };
};

// Hook for fetching a single gateway
export const useGateway = (country: CountryCode, gatewayId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [gateway, setGateway] = useState<JourneyGateway | null>(null);

  useEffect(() => {
    const fetchGateway = async () => {
      setLoading(true);
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const found = mockGateways.find(g => g.gatewayId === gatewayId && g.country === country);
        if (found) {
          setGateway(found);
        } else {
          throw new Error('Gateway not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gateway'));
      } finally {
        setLoading(false);
      }
    };

    fetchGateway();
  }, [country, gatewayId]);

  return { gateway, loading, error };
};