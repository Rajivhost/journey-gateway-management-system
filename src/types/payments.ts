export enum PaymentMethodType {
  CARD = 'CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  MOBILE_MONEY = 'MOBILE_MONEY'
}

export enum PaymentMethodStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export interface PaymentMethod {
  paymentMethodId: string;
  providerId: string;
  type: PaymentMethodType;
  status: PaymentMethodStatus;
  isDefault: boolean;
  
  // Card details
  cardBrand?: string;
  cardLast4?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  cardHolderName?: string;
  
  // Bank account details
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  routingNumber?: string;
  
  // Mobile money details
  mobileProvider?: string;
  phoneNumber?: string;
  accountName?: string;
  
  // Common fields
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
}

export interface PaymentTransaction {
  transactionId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description: string;
  createdAt: string;
  completedAt?: string;
}