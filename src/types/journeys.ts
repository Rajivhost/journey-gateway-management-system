import { z } from 'zod';
import { CountryCode } from './index';

export enum JourneyType {
  MTN_MOMO_DJS = 'MTN_MOMO_DJS',
  USSD = 'USSD'
}

export enum JourneyStatus {
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export enum JourneyMode {
  EXTERNAL_REDIRECT = 'EXTERNAL_REDIRECT',
  SELF_CONTAINED = 'SELF_CONTAINED'
}

export enum JourneyVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED'
}

export interface JourneyCategory {
  categoryId: string;
  name: string;
  country: CountryCode;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  providerId: string;
  name: string;
  country: CountryCode;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyVersion {
  versionId: string;
  journey: Journey;
  country: CountryCode;
  journeyType: JourneyType;
  journeyMode: JourneyMode;
  yamlContent: string;
  schemaVersion: string;
  createdAt: string;
  publishedAt?: string;
}

export interface Journey {
  journeyId: string;
  name: string;
  status: JourneyStatus;
  category: JourneyCategory;
  provider: ServiceProvider;
  visibility: JourneyVisibility;
  journeyType: JourneyType;
  description?: string;
  currentVersion: JourneyVersion;
  versions: JourneyVersion[];
  createdAt: string;
  publishedAt?: string;
  archivedAt?: string;
  updatedAt: string;
}

// Form schemas
export const createJourneySchema = z.object({
  name: z.string().min(2, 'Journey name must be at least 2 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  visibility: z.nativeEnum(JourneyVisibility),
  description: z.string().optional(),
  yamlContent: z.string().min(1, 'YAML content is required'),
});

export const createJourneyVersionSchema = z.object({
  yamlContent: z.string().min(1, 'YAML content is required'),
});

export const editJourneySchema = z.object({
  name: z.string().min(2, 'Journey name must be at least 2 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  visibility: z.nativeEnum(JourneyVisibility),
  description: z.string().optional(),
});

export type CreateJourneyInput = z.infer<typeof createJourneySchema>;
export type CreateJourneyVersionInput = z.infer<typeof createJourneyVersionSchema>;
export type EditJourneyInput = z.infer<typeof editJourneySchema>;