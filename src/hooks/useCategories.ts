import { useState, useEffect } from 'react';
import { JourneyCategory, CountryCode } from '../types';
import { mockCategories } from '../mocks/gatewayData';

// Hook to fetch categories for a specific country
export const useCategories = (country: CountryCode) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<JourneyCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Filter categories by country
        const filteredCategories = mockCategories.filter(category => category.country === country);
        setCategories(filteredCategories);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [country]);

  return { categories, loading, error };
};

// Hook to fetch a single category
export const useCategory = (categoryId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [category, setCategory] = useState<JourneyCategory | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const found = mockCategories.find(c => c.categoryId === categoryId);
        if (found) {
          setCategory(found);
        } else {
          throw new Error('Category not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch category'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
};