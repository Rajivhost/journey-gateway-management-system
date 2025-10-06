import { z } from 'zod';

export enum ScopeCategory {
  GATEWAYS = 'GATEWAYS',
  JOURNEYS = 'JOURNEYS',
  SESSIONS = 'SESSIONS',
  PROVIDERS = 'PROVIDERS',
  PRODUCTS = 'PRODUCTS',
  PAYMENTS = 'PAYMENTS',
  USERS = 'USERS',
  ANALYTICS = 'ANALYTICS',
  WEBHOOKS = 'WEBHOOKS',
  SYSTEM = 'SYSTEM'
}

export enum AccessLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ADMIN = 'ADMIN'
}

export interface ApiScope {
  scopeId: string;
  name: string;
  description: string;
  scopeKey: string;
  category: ScopeCategory;
  accessLevels: AccessLevel[];
  isActive: boolean;
  isSystem: boolean;
  apiEndpoints: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export const createScopeSchema = z.object({
  name: z.string().min(2, 'Scope name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  scopeKey: z.string()
    .min(3, 'Scope key must be at least 3 characters')
    .regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/, 'Scope key must be lowercase'),
  category: z.nativeEnum(ScopeCategory),
  accessLevels: z.array(z.nativeEnum(AccessLevel)).min(1, 'At least one access level is required'),
  apiEndpoints: z.array(z.string()).min(1, 'At least one API endpoint is required'),
  isActive: z.boolean().default(true),
});

export const editScopeSchema = z.object({
  name: z.string().min(2, 'Scope name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  scopeKey: z.string()
    .min(3, 'Scope key must be at least 3 characters')
    .regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/, 'Scope key must be lowercase'),
  category: z.nativeEnum(ScopeCategory),
  accessLevels: z.array(z.nativeEnum(AccessLevel)).min(1, 'At least one access level is required'),
  apiEndpoints: z.array(z.string()).min(1, 'At least one API endpoint is required'),
  isActive: z.boolean(),
});

export type CreateScopeInput = z.infer<typeof createScopeSchema>;
export type EditScopeInput = z.infer<typeof editScopeSchema>;
