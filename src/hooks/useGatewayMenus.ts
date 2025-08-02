import { useState, useEffect } from 'react';
import { JourneyGatewayMenu, CountryCode } from '../types';
import { mockGatewayMenus } from '../mocks/gatewayData';

// Hook to fetch gateway menus for a specific gateway
export const useGatewayMenus = (gatewayId: string, country: CountryCode) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [menus, setMenus] = useState<JourneyGatewayMenu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Filter menus by gateway ID and country
        const filteredMenus = mockGatewayMenus.filter(
          menu => menu.gateway.gatewayId === gatewayId && menu.country === country
        );
        
        // Sort by position
        const sortedMenus = [...filteredMenus].sort((a, b) => a.position - b.position);
        setMenus(sortedMenus);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gateway menus'));
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [gatewayId, country]);

  return { menus, loading, error };
};

// Hook to fetch a single gateway menu
export const useGatewayMenu = (menuId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [menu, setMenu] = useState<JourneyGatewayMenu | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const found = mockGatewayMenus.find(m => m.menuId === menuId);
        if (found) {
          setMenu(found);
        } else {
          throw new Error('Gateway menu not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gateway menu'));
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  return { menu, loading, error };
};