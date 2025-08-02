import { useState, useEffect } from 'react';
import { JourneyGatewayRegistration, CountryCode } from '../types';

// Mock data for development
const mockRegistrations: JourneyGatewayRegistration[] = [
  {
    registrationId: 'reg_1',
    name: 'Mobile Money Service',
    active: true,
    menuText: 'Mobile Money',
    position: 1,
    priority: 1,
    shortCode: '*123#',
    gateway: {
      gatewayId: 'gw-1',
      name: 'MTN USSD Gateway',
      status: 'ACTIVE',
      carrier: {
        carrierId: 'carr-1',
        code: 'MTN',
        name: 'MTN',
        country: 'CM',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      country: 'CM',
      shortCode: '*123#',
      gatewayType: 'MULTI_PROVIDER',
      description: 'Primary USSD gateway for MTN Cameroon',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-06-20T15:45:00Z'
    },
    journey: {
      journeyId: 'j-1',
      name: 'Money Transfer Journey',
      description: 'Complete mobile money transfer journey',
      country: 'CM',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z'
    },
    provider: {
      providerId: 'p-1',
      name: 'FinTech Solutions',
      email: 'contact@fintech.com',
      phone: '+237612345678',
      country: 'CM',
      status: 'ACTIVE',
      companyName: 'FinTech Solutions Ltd',
      companyRegistrationNumber: 'RC123456',
      createdAt: '2024-03-10T10:00:00Z',
      updatedAt: '2024-03-10T10:00:00Z'
    },
    priceId: 'price_1',
    priceInfo: {
      priceId: 'price_1',
      name: 'Professional Plan',
      amount: 75000,
      currency: 'XAF',
      interval: 'month',
      productName: 'Professional API Credits'
    },
    creditBalance: {
      totalCredits: 5000,
      usedCredits: 1250,
      remainingCredits: 3750,
      expiryDate: '2024-04-15T00:00:00Z',
      lastUpdated: '2024-03-20T10:30:00Z'
    },
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    registrationId: 'reg_2',
    name: 'Bill Payment Service',
    active: true,
    menuText: 'Pay Bills',
    position: 2,
    priority: 2,
    gateway: {
      gatewayId: 'gw-1',
      name: 'MTN USSD Gateway',
      status: 'ACTIVE',
      carrier: {
        carrierId: 'carr-1',
        code: 'MTN',
        name: 'MTN',
        country: 'CM',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      country: 'CM',
      shortCode: '*123#',
      gatewayType: 'MULTI_PROVIDER',
      description: 'Primary USSD gateway for MTN Cameroon',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-06-20T15:45:00Z'
    },
    journey: {
      journeyId: 'j-2',
      name: 'Bill Payment Journey',
      description: 'Utility bill payment service',
      country: 'CM',
      createdAt: '2024-03-16T10:00:00Z',
      updatedAt: '2024-03-16T10:00:00Z'
    },
    provider: {
      providerId: 'p-2',
      name: 'PayTech Solutions',
      email: 'contact@paytech.com',
      phone: '+237687654321',
      country: 'CM',
      status: 'ACTIVE',
      companyName: 'PayTech Solutions Ltd',
      companyRegistrationNumber: 'RC789012',
      createdAt: '2024-03-11T10:00:00Z',
      updatedAt: '2024-03-11T10:00:00Z'
    },
    // No pricing plan - free access
    creditBalance: {
      totalCredits: 1000,
      usedCredits: 150,
      remainingCredits: 850,
      lastUpdated: '2024-03-20T10:30:00Z'
    },
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z'
  }
];

export const useJourneyGatewayRegistrations = (country: CountryCode) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [registrations, setRegistrations] = useState<JourneyGatewayRegistration[]>([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter registrations by country
        const filteredRegistrations = mockRegistrations.filter(
          registration => registration.gateway.country === country
        );
        setRegistrations(filteredRegistrations);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch registrations'));
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [country]);

  return { registrations, loading, error };
};

export const useJourneyGatewayRegistration = (registrationId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [registration, setRegistration] = useState<JourneyGatewayRegistration | null>(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const found = mockRegistrations.find(r => r.registrationId === registrationId);
        if (found) {
          setRegistration(found);
        } else {
          throw new Error('Registration not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch registration'));
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [registrationId]);

  return { registration, loading, error };
};