import { useState, useEffect } from 'react';
import { JourneyVersion, CreateJourneyVersionInput, JourneyType, JourneyMode } from '../types/journeys';
import { CountryCode } from '../types';

// Mock data for journey versions
const mockVersions: JourneyVersion[] = [
  {
    versionId: 'version_1',
    journey: {} as any,
    country: CountryCode.CM,
    journeyType: JourneyType.USSD,
    journeyMode: JourneyMode.SELF_CONTAINED,
    yamlContent: `# Mobile Money Transfer Journey v1.0
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
        next: "check_balance"`,
    schemaVersion: '1.0',
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-15T12:00:00Z'
  },
  {
    versionId: 'version_2',
    journey: {} as any,
    country: CountryCode.CM,
    journeyType: JourneyType.USSD,
    journeyMode: JourneyMode.SELF_CONTAINED,
    yamlContent: `# Mobile Money Transfer Journey v1.1
name: "Mobile Money Transfer"
description: "Enhanced transfer journey with validation"
steps:
  - id: "welcome"
    type: "menu"
    text: "Welcome to Mobile Money"
    options:
      - text: "Send Money"
        next: "send_money"
      - text: "Check Balance"
        next: "check_balance"
      - text: "Transaction History"
        next: "history"`,
    schemaVersion: '1.1',
    createdAt: '2024-01-16T10:00:00Z'
  }
];

export const useJourneyVersions = (journeyId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [versions, setVersions] = useState<JourneyVersion[]>([]);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // In a real implementation, filter by journeyId
        setVersions(mockVersions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch journey versions'));
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [journeyId]);

  const createVersion = async (input: CreateJourneyVersionInput & { journeyId: string; country: CountryCode }): Promise<JourneyVersion> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVersion: JourneyVersion = {
      versionId: `version_${Date.now()}`,
      journey: {} as any,
      country: input.country,
      journeyType: JourneyType.USSD,
      journeyMode: JourneyMode.SELF_CONTAINED,
      yamlContent: input.yamlContent,
      schemaVersion: '1.0',
      createdAt: new Date().toISOString()
    };

    setVersions(prev => [newVersion, ...prev]);
    return newVersion;
  };

  const publishVersion = async (versionId: string): Promise<JourneyVersion> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setVersions(prev => prev.map(version => 
      version.versionId === versionId 
        ? { 
            ...version, 
            publishedAt: new Date().toISOString()
          }
        : version
    ));

    const publishedVersion = versions.find(v => v.versionId === versionId);
    if (!publishedVersion) {
      throw new Error('Version not found');
    }
    
    return { 
      ...publishedVersion, 
      publishedAt: new Date().toISOString()
    };
  };

  const deleteVersion = async (versionId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setVersions(prev => prev.filter(version => version.versionId !== versionId));
  };

  return { 
    versions, 
    loading, 
    error, 
    createVersion,
    publishVersion,
    deleteVersion
  };
};

export const useJourneyVersion = (versionId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState<JourneyVersion | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const found = mockVersions.find(v => v.versionId === versionId);
        if (found) {
          setVersion(found);
        } else {
          throw new Error('Version not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch journey version'));
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, [versionId]);

  return { version, loading, error };
};