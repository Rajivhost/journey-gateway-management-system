import { z } from 'zod';

export enum ProductType {
  CREDIT_BASED = 'CREDIT_BASED'
}

export enum CreditCarryOverPolicy {
  CAPPED = 'CAPPED',
  FULL = 'FULL',
  NONE = 'NONE',
  PERCENTAGE = 'PERCENTAGE'
}

export enum PriceType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING'
}

export enum BillingScheme {
  PER_UNIT = 'PER_UNIT',
  TIERED = 'TIERED'
}

export enum PriceRecurringInterval {
  DAY = 'DAY',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  YEAR = 'YEAR'
}

export enum PriceRecurringUsageType {
  LICENSE = 'LICENSE',
  METERED = 'METERED'
}

export enum CurrencyCode {
  XAF = 'XAF'
}

export interface CreditAllocation {
  initialCredits: number;
  renewalCredits?: number;
  expiryPeriod?: number;
  carryOverPolicy: CreditCarryOverPolicy;
  carryOverValue?: number;
}

export interface PriceRecurring {
  interval: PriceRecurringInterval;
  meter?: string;
  usageType: PriceRecurringUsageType;
  intervalCount: number;
  trialPeriodDays?: number;
}

export interface Price {
  priceId: string;
  name: string;
  active: boolean;
  currency: CurrencyCode;
  priceType: PriceType;
  recurring?: PriceRecurring;
  unitAmount?: number;
  billingScheme: BillingScheme;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  productId: string;
  name: string;
  active: boolean;
  country: string;
  description?: string;
  productType: ProductType;
  defaultPrice?: Price;
  creditAllocation?: CreditAllocation;
  prices: Price[];
  createdAt: string;
  updatedAt: string;
}

// Form schemas
export const createCreditProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  priceName: z.string().min(2, 'Price name must be at least 2 characters'),
  unitAmount: z.number().min(0.01, 'Unit amount must be greater than 0'),
  initialCredits: z.number().min(1, 'Initial credits must be at least 1'),
  renewalCredits: z.number().min(0).optional(),
  expiryPeriod: z.number().min(1).optional(),
  carryOverPolicy: z.nativeEnum(CreditCarryOverPolicy),
  carryOverValue: z.number().min(0).max(100).optional(),
});

export const editProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  active: z.boolean(),
  creditAllocation: z.object({
    initialCredits: z.number().min(1, 'Initial credits must be at least 1'),
    renewalCredits: z.number().min(0).optional(),
    expiryPeriod: z.number().min(1).optional(),
    carryOverPolicy: z.nativeEnum(CreditCarryOverPolicy),
    carryOverValue: z.number().min(0).max(100).optional(),
  }).optional(),
});

export type CreateCreditProductInput = z.infer<typeof createCreditProductSchema>;
export type EditProductInput = z.infer<typeof editProductSchema>;