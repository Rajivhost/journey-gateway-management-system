import { z } from 'zod';
import { CountryCode } from './index';

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
  TIMEOUT = 'TIMEOUT',
  ERROR = 'ERROR'
}

export enum SessionType {
  USSD = 'USSD',
  SMS = 'SMS',
  API = 'API'
}

export interface SessionStep {
  stepId: string;
  stepType: 'menu' | 'input' | 'display' | 'confirmation' | 'end';
  stepName: string;
  userInput?: string;
  responseText: string;
  timestamp: string;
  duration: number; // in milliseconds
}

export interface Session {
  sessionId: string;
  userId?: string;
  phoneNumber: string;
  country: CountryCode;
  gateway: {
    gatewayId: string;
    name: string;
    shortCode: string;
    carrier: {
      name: string;
      code: string;
    };
  };
  journey: {
    journeyId: string;
    name: string;
    version: string;
  };
  provider: {
    providerId: string;
    name: string;
  };
  sessionType: SessionType;
  status: SessionStatus;
  startTime: string;
  endTime?: string;
  duration?: number; // in milliseconds
  totalSteps: number;
  currentStep?: string;
  steps: SessionStep[];
  metadata?: Record<string, any>;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionAnalytics {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  errorSessions: number;
  averageDuration: number;
  completionRate: number;
  abandonmentRate: number;
  errorRate: number;
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
  topJourneys: Array<{
    journeyId: string;
    journeyName: string;
    sessionCount: number;
    completionRate: number;
  }>;
  topGateways: Array<{
    gatewayId: string;
    gatewayName: string;
    sessionCount: number;
    completionRate: number;
  }>;
}

export interface SessionFilters {
  country?: CountryCode;
  status?: SessionStatus;
  sessionType?: SessionType;
  gatewayId?: string;
  journeyId?: string;
  providerId?: string;
  phoneNumber?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Form schemas
export const sessionFiltersSchema = z.object({
  country: z.nativeEnum(CountryCode).optional(),
  status: z.nativeEnum(SessionStatus).optional(),
  sessionType: z.nativeEnum(SessionType).optional(),
  gatewayId: z.string().optional(),
  journeyId: z.string().optional(),
  providerId: z.string().optional(),
  phoneNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export type SessionFiltersInput = z.infer<typeof sessionFiltersSchema>;