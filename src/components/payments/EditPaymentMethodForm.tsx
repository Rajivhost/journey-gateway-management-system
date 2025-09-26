import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, CreditCard, Smartphone, Building } from 'lucide-react';
import { PaymentMethod, PaymentMethodType, PaymentMethodStatus } from '../../types/payments';

const editPaymentMethodSchema = z.object({
  isDefault: z.boolean(),
  status: z.nativeEnum(PaymentMethodStatus),
  
  // Card fields
  cardHolderName: z.string().optional(),
  cardExpiryMonth: z.number().min(1).max(12).optional(),
  cardExpiryYear: z.number().min(new Date().getFullYear()).optional(),
  
  // Bank account fields
  accountHolderName: z.string().optional(),
  
  // Mobile money fields
  accountName: z.string().optional(),
  
  // Billing address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type EditPaymentMethodFormData = z.infer<typeof editPaymentMethodSchema>;

interface EditPaymentMethodFormProps {
  paymentMethod: PaymentMethod;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const EditPaymentMethodForm: React.FC<EditPaymentMethodFormProps> = ({
  paymentMethod,
  onClose,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch
  } = useForm<EditPaymentMethodFormData>({
    resolver: zodResolver(editPaymentMethodSchema),
    defaultValues: {
      isDefault: paymentMethod.isDefault,
      status: paymentMethod.status,
      cardHolderName: paymentMethod.cardHolderName || '',
      cardExpiryMonth: paymentMethod.cardExpiryMonth,
      cardExpiryYear: paymentMethod.cardExpiryYear,
      accountHolderName: paymentMethod.accountHolderName || '',
      accountName: paymentMethod.accountName || '',
      street: paymentMethod.billingAddress?.street || '',
      city: paymentMethod.billingAddress?.city || '',
      state: paymentMethod.billingAddress?.state || '',
      postalCode: paymentMethod.billingAddress?.postalCode || '',
      country: paymentMethod.billingAddress?.country || 'Cameroon'
    }
  });

  const handleFormSubmit = async (data: EditPaymentMethodFormData) => {
    setIsSubmitting(true);
    try {
      const transformedData = {
        isDefault: data.isDefault,
        status: data.status,
        ...(paymentMethod.type === PaymentMethodType.CARD && {
          cardHolderName: data.cardHolderName,
          cardExpiryMonth: data.cardExpiryMonth,
          cardExpiryYear: data.cardExpiryYear,
        }),
        ...(paymentMethod.type === PaymentMethodType.BANK_ACCOUNT && {
          accountHolderName: data.accountHolderName,
        }),
        ...(paymentMethod.type === PaymentMethodType.MOBILE_MONEY && {
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
      console.error('Failed to update payment method:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const getPaymentMethodTitle = () => {
    switch (paymentMethod.type) {
      case PaymentMethodType.CARD:
        return `${paymentMethod.cardBrand?.toUpperCase()} •••• ${paymentMethod.cardLast4}`;
      case PaymentMethodType.MOBILE_MONEY:
        return paymentMethod.mobileProvider || 'Mobile Money';
      case PaymentMethodType.BANK_ACCOUNT:
        return paymentMethod.bankName || 'Bank Account';
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {getPaymentTypeIcon(paymentMethod.type)}
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-gray-900">Edit Payment Method</h2>
              <p className="text-sm text-gray-500">{getPaymentMethodTitle()}</p>
            </div>
          </div>
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
            <div className="space-y-6">
              {/* Payment Method Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  {...register('status')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={PaymentMethodStatus.ACTIVE}>Active</option>
                  <option value={PaymentMethodStatus.INACTIVE}>Inactive</option>
                  <option value={PaymentMethodStatus.PENDING_VERIFICATION}>Pending Verification</option>
                  <option value={PaymentMethodStatus.EXPIRED}>Expired</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              {/* Type-specific fields */}
              {paymentMethod.type === PaymentMethodType.CARD && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardHolderName"
                      {...register('cardHolderName')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.cardHolderName && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardHolderName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiryMonth" className="block text-sm font-medium text-gray-700">
                        Expiry Month
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
                        Expiry Year
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
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> For security reasons, you cannot edit the card number. 
                      To change the card number, please add a new payment method and delete this one.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod.type === PaymentMethodType.BANK_ACCOUNT && (
                <div>
                  <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    id="accountHolderName"
                    {...register('accountHolderName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.accountHolderName && (
                    <p className="mt-1 text-sm text-red-600">{errors.accountHolderName.message}</p>
                  )}
                  
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Bank account and routing numbers cannot be edited for security reasons. 
                      To change these details, please add a new payment method.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod.type === PaymentMethodType.MOBILE_MONEY && (
                <div>
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                    Account Name
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    {...register('accountName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.accountName && (
                    <p className="mt-1 text-sm text-red-600">{errors.accountName.message}</p>
                  )}
                  
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Mobile money provider and phone number cannot be edited for security reasons. 
                      To change these details, please add a new payment method.
                    </p>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
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
            </div>
          </div>

          <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};