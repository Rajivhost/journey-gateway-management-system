import { z } from 'zod';

export enum CountryCode {
  BJ = 'BJ',
  CD = 'CD',
  CG = 'CG',
  CI = 'CI',
  CM = 'CM',
  SN = 'SN',
  TD = 'TD'
}

export enum JourneyGatewayStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

export enum JourneyGatewayType {
  MULTI_PROVIDER = 'MULTI_PROVIDER',
  SINGLE_PROVIDER = 'SINGLE_PROVIDER'
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ServiceProviderStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface Carrier {
  carrierId: string;
  code: string;
  name: string;
  country: CountryCode;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyGateway {
  gatewayId: string;
  name: string;
  status: JourneyGatewayStatus;
  carrier: Carrier;
  country: CountryCode;
  shortCode: string;
  gatewayType: JourneyGatewayType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyCategory {
  categoryId: string;
  name: string;
  country: CountryCode;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyGatewayMenu {
  menuId: string;
  gateway: JourneyGateway;
  category?: JourneyCategory;
  active: boolean;
  country: CountryCode;
  position: number;
  menuText: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Journey {
  journeyId: string;
  name: string;
  description?: string;
  country: CountryCode;
  createdAt: string;
  updatedAt: string;
}

export interface CreditBalance {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  expiryDate?: string;
  lastUpdated: string;
}

export interface PriceInfo {
  priceId: string;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  productName: string;
}

export interface JourneyGatewayRegistration {
  registrationId: string;
  name: string;
  menu?: JourneyGatewayMenu;
  active: boolean;
  journey: Journey;
  gateway: JourneyGateway;
  menuText: string;
  position: number;
  priority?: number;
  provider: ServiceProvider;
  shortCode?: string;
  priceId?: string;
  priceInfo?: PriceInfo;
  creditBalance?: CreditBalance;
  createdAt: string;
  updatedAt?: string;
}

export interface FilterOptions {
  country?: CountryCode;
  status?: JourneyGatewayStatus;
  carrierId?: string;
  gatewayType?: JourneyGatewayType;
  search?: string;
}

export interface ServiceProvider {
  providerId: string;
  name: string;
  email: string;
  phone: string;
  country: CountryCode;
  status: ServiceProviderStatus;
  companyName: string;
  companyRegistrationNumber: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  address?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessType?: string;
  yearEstablished?: number;
  numberOfEmployees?: string;
  annualRevenue?: string;
  servicesOffered?: string[];
  targetMarkets?: string[];
  complianceCertifications?: string[];
  bankingPartners?: string[];
  technologyStack?: string[];
  supportedLanguages?: string[];
  operatingHours?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
  registrationStatus?: RegistrationStatus;
}

export interface ProviderRequest {
  requestId: string;
  name: string;
  email: string;
  phone: string;
  country: CountryCode;
  status: RegistrationStatus;
  companyName: string;
  companyRegistrationNumber: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  address?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessType?: string;
  yearEstablished?: number;
  numberOfEmployees?: string;
  annualRevenue?: string;
  servicesOffered?: string[];
  targetMarkets?: string[];
  complianceCertifications?: string[];
  bankingPartners?: string[];
  technologyStack?: string[];
  supportedLanguages?: string[];
  operatingHours?: string;
  emergencyContact?: string;
  submittedDocuments?: string[];
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'PROVIDER';
  country: CountryCode;
  createdAt: string;
  updatedAt: string;
}

// Zod schema for JourneyGatewayRegistration
export const createJourneyGatewayRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  menuId: z.string().optional(),
  active: z.boolean().default(true),
  country: z.nativeEnum(CountryCode),
  position: z.number().int().positive(),
  menuText: z.string().min(2, 'Menu text must be at least 2 characters'),
  priority: z.number().int().optional(),
  journeyId: z.string(),
  gatewayId: z.string(),
  shortCode: z.string().optional(),
  providerId: z.string(),
  priceId: z.string().optional(),
});

export const createServiceProviderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  country: z.nativeEnum(CountryCode),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyRegistrationNumber: z.string().min(2, 'Registration number is required'),
  description: z.string().optional(),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  website: z.string().url('Invalid website URL').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters').optional(),
  contactEmail: z.string().email('Invalid contact email address').optional(),
  contactPhone: z.string().min(10, 'Contact phone must be at least 10 characters').optional(),
  businessType: z.string().optional(),
  yearEstablished: z.number().min(1800).max(new Date().getFullYear()).optional(),
  numberOfEmployees: z.string().optional(),
  annualRevenue: z.string().optional(),
  servicesOffered: z.array(z.string()).optional(),
  targetMarkets: z.array(z.string()).optional(),
  complianceCertifications: z.array(z.string()).optional(),
  bankingPartners: z.array(z.string()).optional(),
  technologyStack: z.array(z.string()).optional(),
  supportedLanguages: z.array(z.string()).optional(),
  operatingHours: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export type CreateJourneyGatewayRegistrationInput = z.infer<typeof createJourneyGatewayRegistrationSchema>;
export type CreateServiceProviderInput = z.infer<typeof createServiceProviderSchema>;