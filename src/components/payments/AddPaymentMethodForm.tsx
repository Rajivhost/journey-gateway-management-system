import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CreditCard, Smartphone, Building, Info } from 'lucide-react';
import { PaymentMethodType, PaymentMethodStatus } from '../../types/payments';

const addPaymentMethodSchema = z.object({
  type: z.nativeEnum(PaymentMethodType),
  isDefault: z.boolean().default(false),
  
  // Card fields
  cardHolderName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiryMonth: z.number().min(1).max(12).optional(),
  cardExpiryYear: z.number().min(new Date().getFullYear()).optional(),
  cardCvv: z.string().optional(),
  
  // Bank account fields
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  routingNumber: z.string().optional(),
  
  // Mobile money fields
  mobileProvider: z.string().optional(),
  phoneNumber: z.string().optional(),
  accountName: z.string().optional(),
  
  // Billing address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
}).refine((data) => {
  if (data.type === PaymentMethodType.CARD) {
    return data.cardHolderName && data.cardNumber && data.cardExpiryMonth && data.cardExpiryYear && data.cardCvv;
  }
  if (data.type === PaymentMethodType.BANK_ACCOUNT) {
    return data.bankName && data.accountNumber && data.accountHolderName;
  }
  if (data.type === PaymentMethodType.MOBILE_MONEY) {
    return data.mobileProvider && data.phoneNumber && data.accountName;
  }
  return true;
}, {
  message: "Please fill in all required fields for the selected payment method type",
});

type AddPaymentMethodFormData = z.infer<typeof addPaymentMethodSchema>;

interface AddPaymentMethodFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({
  onClose,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setValue,
    trigger
  } = useForm<AddPaymentMethodFormData>({
    resolver: zodResolver(addPaymentMethodSchema),
    defaultValues: {
      type: PaymentMethodType.CARD,
      isDefault: false,
      country: 'Cameroon'
    }
  });

  const watchedType = watch('type');

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async (data: AddPaymentMethodFormData) => {
    setIsSubmitting(true);
    try {
      // Transform data based on payment method type
      const transformedData = {
        type: data.type,
        status: PaymentMethodStatus.ACTIVE,
        isDefault: data.isDefault,
        ...(data.type === PaymentMethodType.CARD && {
          cardBrand: getCardBrand(data.cardNumber || ''),
          cardLast4: data.cardNumber?.slice(-4),
          cardExpiryMonth: data.cardExpiryMonth,
          cardExpiryYear: data.cardExpiryYear,
          cardHolderName: data.cardHolderName,
        }),
        ...(data.type === PaymentMethodType.BANK_ACCOUNT && {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountHolderName: data.accountHolderName,
          routingNumber: data.routingNumber,
        }),
        ...(data.type === PaymentMethodType.MOBILE_MONEY && {
          mobileProvider: data.mobileProvider,
          phoneNumber: data.phoneNumber,
          accountName: data.accountName,
        }),
        ...(data.street && {
          billingAddress: {
            street: data.street,
            city: data.city || '',
            state: data.state || '',
            postalCode: data.postalCode || '',
            country: data.country || 'Cameroon'
          }
        })
      };

      await onSubmit(transformedData);
    } catch (error) {
      console.error('Failed to add payment method:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const getPaymentTypeIcon = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CARD:
        return <CreditCard className="h-6 w-6 text-blue-600" />;
      case PaymentMethodType.MOBILE_MONEY:
        return <Smartphone className="h-6 w-6 text-green-600" />;
      case PaymentMethodType.BANK_ACCOUNT:
        return <Building className="h-6 w-6 text-purple-600" />;
    }
  };

  const renderTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Add Payment Method</h2>
        <p className="text-gray-600">Choose the type of payment method you'd like to add</p>
      </div>

      <div className="space-y-4">
        {Object.values(PaymentMethodType).map((type) => (
          <label
            key={type}
            className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
              watchedType === type
                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              value={type}
              {...register('type')}
              className="sr-only"
            />
            <div className="flex items-center">
              {getPaymentTypeIcon(type)}
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {type === PaymentMethodType.CARD && 'Credit/Debit Card'}
                  {type === PaymentMethodType.BANK_ACCOUNT && 'Bank Account'}
                  {type === PaymentMethodType.MOBILE_MONEY && 'Mobile Money'}
                </div>
                <div className="text-sm text-gray-500">
                  {type === PaymentMethodType.CARD && 'Visa, Mastercard, American Express'}
                  {type === PaymentMethodType.BANK_ACCOUNT && 'Direct bank account transfer'}
                  {type === PaymentMethodType.MOBILE_MONEY && 'MTN Mobile Money, Orange Money'}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        {getPaymentTypeIcon(watchedType)}
        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          {watchedType === PaymentMethodType.CARD && 'Card Details'}
          {watchedType === PaymentMethodType.BANK_ACCOUNT && 'Bank Account Details'}
          {watchedType === PaymentMethodType.MOBILE_MONEY && 'Mobile Money Details'}
        </h2>
        <p className="text-gray-600">Enter your payment method information</p>
      </div>

      {watchedType === PaymentMethodType.CARD && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">
              Cardholder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cardHolderName"
              {...register('cardHolderName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="John Doe"
            />
            {errors.cardHolderName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardHolderName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cardNumber"
              {...register('cardNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="cardExpiryMonth" className="block text-sm font-medium text-gray-700">
                Month <span className="text-red-500">*</span>
              </label>
              <select
                id="cardExpiryMonth"
                {...register('cardExpiryMonth', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {month.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              {errors.cardExpiryMonth && (
                <p className="mt-1 text-sm text-red-600">{errors.cardExpiryMonth.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cardExpiryYear" className="block text-sm font-medium text-gray-700">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                id="cardExpiryYear"
                {...register('cardExpiryYear', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">YYYY</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.cardExpiryYear && (
                <p className="mt-1 text-sm text-red-600">{errors.cardExpiryYear.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cardCvv"
                {...register('cardCvv')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="123"
                maxLength={4}
              />
              {errors.cardCvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cardCvv.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {watchedType === PaymentMethodType.BANK_ACCOUNT && (
        <div className="space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <select
              id="bankName"
              {...register('bankName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select your bank</option>
              <option value="Afriland First Bank">Afriland First Bank</option>
              <option value="Commercial Bank of Cameroon">Commercial Bank of Cameroon</option>
              <option value="UBA Cameroon">UBA Cameroon</option>
              <option value="Ecobank Cameroon">Ecobank Cameroon</option>
              <option value="SGBC">Société Générale Cameroun</option>
              <option value="Standard Chartered Bank">Standard Chartered Bank</option>
            </select>
            {errors.bankName && (
              <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountHolderName"
              {...register('accountHolderName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Account holder full name"
            />
            {errors.accountHolderName && (
              <p className="mt-1 text-sm text-red-600">{errors.accountHolderName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="accountNumber"
                {...register('accountNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="1234567890"
              />
              {errors.accountNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">
                Routing Number
              </label>
              <input
                type="text"
                id="routingNumber"
                {...register('routingNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Bank routing number"
              />
              {errors.routingNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.routingNumber.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {watchedType === PaymentMethodType.MOBILE_MONEY && (
        <div className="space-y-4">
          <div>
            <label htmlFor="mobileProvider" className="block text-sm font-medium text-gray-700">
              Mobile Money Provider <span className="text-red-500">*</span>
            </label>
            <select
              id="mobileProvider"
              {...register('mobileProvider')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select provider</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Express Union Mobile">Express Union Mobile</option>
            </select>
            {errors.mobileProvider && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileProvider.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountName"
              {...register('accountName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Account holder name"
            />
            {errors.accountName && (
              <p className="mt-1 text-sm text-red-600">{errors.accountName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              {...register('phoneNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="+237612345678"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Billing Address */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address (Optional)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              {...register('street')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              {...register('city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Douala"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State/Region
            </label>
            <input
              type="text"
              id="state"
              {...register('state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Littoral"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              {...register('postalCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="12345"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              {...register('country')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Cameroon">Cameroon</option>
              <option value="Chad">Chad</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Senegal">Senegal</option>
              <option value="Ivory Coast">Ivory Coast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Default Payment Method */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          {...register('isDefault')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
          Set as default payment method
        </label>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your financial data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Payment Method</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= 1 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    1
                  </div>
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > 1 ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= 2 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    2
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-2 text-xs text-gray-600 space-x-16">
                <span>Payment Type</span>
                <span>Payment Details</span>
              </div>
            </div>
            
            {currentStep === 1 && renderTypeSelection()}
            {currentStep === 2 && renderPaymentDetails()}
          </div>

          <div className="flex justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    'Add Payment Method'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};