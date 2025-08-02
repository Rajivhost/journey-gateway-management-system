import { useState, useEffect } from 'react';
import { Journey, JourneyVersion, CreateJourneyInput, CreateJourneyVersionInput, EditJourneyInput, JourneyStatus, JourneyVisibility, JourneyType, JourneyMode } from '../types/journeys';
import { CountryCode } from '../types';

// Mock data for development
const mockJourneys: Journey[] = [
  {
    journeyId: 'journey_1',
    name: 'Mobile Money Transfer',
    status: JourneyStatus.PUBLISHED,
    category: {
      categoryId: 'cat_1',
      name: 'Financial Services',
      country: CountryCode.CM,
      description: 'Banking and financial services',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    provider: {
      providerId: 'provider_1',
      name: 'FinTech Solutions',
      country: CountryCode.CM,
      status: 'ACTIVE',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    visibility: JourneyVisibility.PUBLIC,
    journeyType: JourneyType.USSD,
    description: 'Complete mobile money transfer journey with balance check and transaction history',
    currentVersion: {
      versionId: 'version_1',
      journey: {} as Journey, // Will be populated
      country: CountryCode.CM,
      journeyType: JourneyType.USSD,
      journeyMode: JourneyMode.SELF_CONTAINED,
      yamlContent: `# Mobile Money Transfer Journey
name: "Mobile Money Transfer"
description: "Transfer money to other mobile numbers"
steps:
  - id: "welcome"
    type: "menu"
    text: "Welcome to Mobile Money"
    options:
      - text: "Send Money"
        next: "send_money"
      - text: "Check Balance"
        next: "check_balance"
  - id: "send_money"
    type: "input"
    text: "Enter recipient number:"
    validation: "phone"
    next: "amount_input"
  - id: "amount_input"
    type: "input"
    text: "Enter amount:"
    validation: "number"
    next: "confirm"
  - id: "confirm"
    type: "confirmation"
    text: "Confirm transfer?"
    next: "success"
  - id: "success"
    type: "end"
    text: "Transfer successful!"`,
      schemaVersion: '1.0',
      createdAt: '2024-01-15T10:00:00Z',
      publishedAt: '2024-01-15T12:00:00Z'
    },
    versions: [],
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    journeyId: 'journey_2',
    name: 'Account Balance Check',
    status: JourneyStatus.DRAFT,
    category: {
      categoryId: 'cat_1',
      name: 'Financial Services',
      country: CountryCode.CM,
      description: 'Banking and financial services',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    provider: {
      providerId: 'provider_1',
      name: 'FinTech Solutions',
      country: CountryCode.CM,
      status: 'ACTIVE',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    visibility: JourneyVisibility.PRIVATE,
    journeyType: JourneyType.USSD,
    description: 'Simple balance inquiry journey',
    currentVersion: {
      versionId: 'version_2',
      journey: {} as Journey,
      country: CountryCode.CM,
      journeyType: JourneyType.USSD,
      journeyMode: JourneyMode.SELF_CONTAINED,
      yamlContent: `# Balance Check Journey
name: "Balance Check"
description: "Check account balance"
steps:
  - id: "welcome"
    type: "menu"
    text: "Balance Inquiry"
    options:
      - text: "Main Account"
        next: "main_balance"
      - text: "Savings Account"
        next: "savings_balance"
  - id: "main_balance"
    type: "display"
    text: "Your balance is: {{balance}}"
    next: "end"
  - id: "end"
    type: "end"
    text: "Thank you!"`,
      schemaVersion: '1.0',
      createdAt: '2024-01-16T10:00:00Z'
    },
    versions: [],
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  }
];

export const useJourneys = (providerId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);

  useEffect(() => {
    const fetchJourneys = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter by provider if specified
        const filteredJourneys = providerId 
          ? mockJourneys.filter(journey => journey.provider.providerId === providerId)
          : mockJourneys;
        
        setJourneys(filteredJourneys);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch journeys'));
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [providerId]);

  const createJourney = async (input: CreateJourneyInput & { providerId: string; country: CountryCode }): Promise<Journey> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newJourney: Journey = {
      journeyId: `journey_${Date.now()}`,
      name: input.name,
      status: JourneyStatus.DRAFT,
      category: {
        categoryId: input.categoryId,
        name: 'Selected Category',
        country: input.country,
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      provider: {
        providerId: input.providerId,
        name: 'Current Provider',
        country: input.country,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      visibility: input.visibility,
      journeyType: JourneyType.USSD,
      description: input.description,
      currentVersion: {
        versionId: `version_${Date.now()}`,
        journey: {} as Journey,
        country: input.country,
        journeyType: JourneyType.USSD,
        journeyMode: JourneyMode.SELF_CONTAINED,
        yamlContent: input.yamlContent,
        schemaVersion: '1.0',
        createdAt: new Date().toISOString()
      },
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setJourneys(prev => [newJourney, ...prev]);
    return newJourney;
  };

  const updateJourney = async (journeyId: string, input: EditJourneyInput): Promise<Journey> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setJourneys(prev => prev.map(journey => 
      journey.journeyId === journeyId 
        ? { 
            ...journey, 
            ...input,
            updatedAt: new Date().toISOString()
          }
        : journey
    ));

    const updatedJourney = journeys.find(j => j.journeyId === journeyId);
    if (!updatedJourney) {
      throw new Error('Journey not found');
    }
    
    return { ...updatedJourney, ...input, updatedAt: new Date().toISOString() };
  };

  const deleteJourney = async (journeyId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setJourneys(prev => prev.filter(journey => journey.journeyId !== journeyId));
  };

  const publishJourney = async (journeyId: string): Promise<Journey> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setJourneys(prev => prev.map(journey => 
      journey.journeyId === journeyId 
        ? { 
            ...journey, 
            status: JourneyStatus.PUBLISHED,
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : journey
    ));

    const publishedJourney = journeys.find(j => j.journeyId === journeyId);
    if (!publishedJourney) {
      throw new Error('Journey not found');
    }
    
    return { 
      ...publishedJourney, 
      status: JourneyStatus.PUBLISHED,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const archiveJourney = async (journeyId: string): Promise<Journey> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setJourneys(prev => prev.map(journey => 
      journey.journeyId === journeyId 
        ? { 
            ...journey, 
            status: JourneyStatus.ARCHIVED,
            archivedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : journey
    ));

    const archivedJourney = journeys.find(j => j.journeyId === journeyId);
    if (!archivedJourney) {
      throw new Error('Journey not found');
    }
    
    return { 
      ...archivedJourney, 
      status: JourneyStatus.ARCHIVED,
      archivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  return { 
    journeys, 
    loading, 
    error, 
    createJourney, 
    updateJourney, 
    deleteJourney,
    publishJourney,
    archiveJourney
  };
};

export const useJourney = (journeyId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [journey, setJourney] = useState<Journey | null>(null);

  useEffect(() => {
    const fetchJourney = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const found = mockJourneys.find(j => j.journeyId === journeyId);
        if (found) {
          setJourney(found);
        } else {
          throw new Error('Journey not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch journey'));
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [journeyId]);

  return { journey, loading, error };
};