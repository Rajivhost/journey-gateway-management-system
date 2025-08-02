import { useState, useEffect } from 'react';
import { Session, SessionAnalytics, SessionFilters, SessionStatus, SessionType } from '../types/sessions';
import { CountryCode } from '../types/index';

// Mock data for development
const mockSessions: Session[] = [
  {
    sessionId: 'sess_1',
    phoneNumber: '+237612345678',
    country: CountryCode.CM,
    gateway: {
      gatewayId: 'gw-1',
      name: 'MTN USSD Gateway',
      shortCode: '*123#',
      carrier: {
        name: 'MTN',
        code: 'MTN'
      }
    },
    journey: {
      journeyId: 'journey_1',
      name: 'Mobile Money Transfer',
      version: '1.0'
    },
    provider: {
      providerId: 'provider_1',
      name: 'FinTech Solutions'
    },
    sessionType: SessionType.USSD,
    status: SessionStatus.COMPLETED,
    startTime: '2024-03-20T10:30:00Z',
    endTime: '2024-03-20T10:32:15Z',
    duration: 135000,
    totalSteps: 5,
    steps: [
      {
        stepId: 'step_1',
        stepType: 'menu',
        stepName: 'Welcome Menu',
        responseText: 'Welcome! Choose: 1. Send Money 2. Check Balance',
        timestamp: '2024-03-20T10:30:00Z',
        duration: 15000
      },
      {
        stepId: 'step_2',
        stepType: 'input',
        stepName: 'Recipient Number',
        userInput: '1',
        responseText: 'Enter recipient number:',
        timestamp: '2024-03-20T10:30:15Z',
        duration: 30000
      },
      {
        stepId: 'step_3',
        stepType: 'input',
        stepName: 'Amount Input',
        userInput: '+237698765432',
        responseText: 'Enter amount:',
        timestamp: '2024-03-20T10:30:45Z',
        duration: 25000
      },
      {
        stepId: 'step_4',
        stepType: 'confirmation',
        stepName: 'Confirm Transfer',
        userInput: '5000',
        responseText: 'Confirm transfer of 5000 XAF to +237698765432? 1. Yes 2. No',
        timestamp: '2024-03-20T10:31:10Z',
        duration: 20000
      },
      {
        stepId: 'step_5',
        stepType: 'end',
        stepName: 'Success',
        userInput: '1',
        responseText: 'Transfer successful! Transaction ID: TXN123456',
        timestamp: '2024-03-20T10:31:30Z',
        duration: 45000
      }
    ],
    ipAddress: '192.168.1.100',
    createdAt: '2024-03-20T10:30:00Z',
    updatedAt: '2024-03-20T10:32:15Z'
  },
  {
    sessionId: 'sess_2',
    phoneNumber: '+237687654321',
    country: CountryCode.CM,
    gateway: {
      gatewayId: 'gw-2',
      name: 'Orange USSD Gateway',
      shortCode: '*456#',
      carrier: {
        name: 'Orange',
        code: 'ORANGE'
      }
    },
    journey: {
      journeyId: 'journey_2',
      name: 'Balance Inquiry',
      version: '1.0'
    },
    provider: {
      providerId: 'provider_1',
      name: 'FinTech Solutions'
    },
    sessionType: SessionType.USSD,
    status: SessionStatus.ABANDONED,
    startTime: '2024-03-20T11:15:00Z',
    duration: 45000,
    totalSteps: 2,
    currentStep: 'step_2',
    steps: [
      {
        stepId: 'step_1',
        stepType: 'menu',
        stepName: 'Main Menu',
        responseText: 'Balance Inquiry: 1. Main Account 2. Savings',
        timestamp: '2024-03-20T11:15:00Z',
        duration: 20000
      },
      {
        stepId: 'step_2',
        stepType: 'display',
        stepName: 'Account Selection',
        userInput: '1',
        responseText: 'Please wait while we fetch your balance...',
        timestamp: '2024-03-20T11:15:20Z',
        duration: 25000
      }
    ],
    ipAddress: '192.168.1.101',
    createdAt: '2024-03-20T11:15:00Z',
    updatedAt: '2024-03-20T11:15:45Z'
  },
  {
    sessionId: 'sess_3',
    phoneNumber: '+237698765432',
    country: CountryCode.CM,
    gateway: {
      gatewayId: 'gw-1',
      name: 'MTN USSD Gateway',
      shortCode: '*123#',
      carrier: {
        name: 'MTN',
        code: 'MTN'
      }
    },
    journey: {
      journeyId: 'journey_1',
      name: 'Mobile Money Transfer',
      version: '1.0'
    },
    provider: {
      providerId: 'provider_1',
      name: 'FinTech Solutions'
    },
    sessionType: SessionType.USSD,
    status: SessionStatus.ACTIVE,
    startTime: '2024-03-20T12:00:00Z',
    totalSteps: 3,
    currentStep: 'step_3',
    steps: [
      {
        stepId: 'step_1',
        stepType: 'menu',
        stepName: 'Welcome Menu',
        responseText: 'Welcome! Choose: 1. Send Money 2. Check Balance',
        timestamp: '2024-03-20T12:00:00Z',
        duration: 10000
      },
      {
        stepId: 'step_2',
        stepType: 'input',
        stepName: 'Recipient Number',
        userInput: '1',
        responseText: 'Enter recipient number:',
        timestamp: '2024-03-20T12:00:10Z',
        duration: 15000
      },
      {
        stepId: 'step_3',
        stepType: 'input',
        stepName: 'Amount Input',
        userInput: '+237612345678',
        responseText: 'Enter amount:',
        timestamp: '2024-03-20T12:00:25Z',
        duration: 0
      }
    ],
    ipAddress: '192.168.1.102',
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2024-03-20T12:00:25Z'
  }
];

const mockAnalytics: SessionAnalytics = {
  totalSessions: 1247,
  activeSessions: 23,
  completedSessions: 892,
  abandonedSessions: 287,
  errorSessions: 45,
  averageDuration: 142000,
  completionRate: 71.5,
  abandonmentRate: 23.0,
  errorRate: 3.6,
  peakHours: [
    { hour: 9, count: 156 },
    { hour: 10, count: 189 },
    { hour: 11, count: 203 },
    { hour: 12, count: 178 },
    { hour: 13, count: 145 },
    { hour: 14, count: 167 },
    { hour: 15, count: 134 },
    { hour: 16, count: 98 }
  ],
  topJourneys: [
    {
      journeyId: 'journey_1',
      journeyName: 'Mobile Money Transfer',
      sessionCount: 567,
      completionRate: 78.2
    },
    {
      journeyId: 'journey_2',
      journeyName: 'Balance Inquiry',
      sessionCount: 423,
      completionRate: 89.1
    },
    {
      journeyId: 'journey_3',
      journeyName: 'Bill Payment',
      sessionCount: 257,
      completionRate: 65.4
    }
  ],
  topGateways: [
    {
      gatewayId: 'gw-1',
      gatewayName: 'MTN USSD Gateway',
      sessionCount: 789,
      completionRate: 74.2
    },
    {
      gatewayId: 'gw-2',
      gatewayName: 'Orange USSD Gateway',
      sessionCount: 458,
      completionRate: 68.9
    }
  ]
};

export const useSessions = (filters?: SessionFilters) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let filteredSessions = [...mockSessions];
        
        if (filters) {
          if (filters.country) {
            filteredSessions = filteredSessions.filter(s => s.country === filters.country);
          }
          if (filters.status) {
            filteredSessions = filteredSessions.filter(s => s.status === filters.status);
          }
          if (filters.sessionType) {
            filteredSessions = filteredSessions.filter(s => s.sessionType === filters.sessionType);
          }
          if (filters.gatewayId) {
            filteredSessions = filteredSessions.filter(s => s.gateway.gatewayId === filters.gatewayId);
          }
          if (filters.journeyId) {
            filteredSessions = filteredSessions.filter(s => s.journey.journeyId === filters.journeyId);
          }
          if (filters.phoneNumber) {
            filteredSessions = filteredSessions.filter(s => 
              s.phoneNumber.includes(filters.phoneNumber!)
            );
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredSessions = filteredSessions.filter(s => 
              s.phoneNumber.toLowerCase().includes(searchLower) ||
              s.journey.name.toLowerCase().includes(searchLower) ||
              s.gateway.name.toLowerCase().includes(searchLower) ||
              s.provider.name.toLowerCase().includes(searchLower)
            );
          }
        }
        
        setSessions(filteredSessions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch sessions'));
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [filters]);

  const terminateSession = async (sessionId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSessions(prev => prev.map(session => 
      session.sessionId === sessionId 
        ? { 
            ...session, 
            status: SessionStatus.COMPLETED,
            endTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : session
    ));
  };

  return { sessions, loading, error, terminateSession };
};

export const useSession = (sessionId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const found = mockSessions.find(s => s.sessionId === sessionId);
        if (found) {
          setSession(found);
        } else {
          throw new Error('Session not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch session'));
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  return { session, loading, error };
};

export const useSessionAnalytics = (filters?: SessionFilters) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalytics(mockAnalytics);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [filters]);

  return { analytics, loading, error };
};