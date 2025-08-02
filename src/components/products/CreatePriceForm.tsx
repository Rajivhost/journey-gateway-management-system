import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, DollarSign, Calendar, Info } from 'lucide-react';
import { 
  PriceType, 
  BillingScheme, 
  PriceRecurringInterval, 
  PriceRecurringUsageType,
  CurrencyCode 
} from '../../types/products';

const createPriceSchema = z.object({
  name: z.string().min(2, 'Price name must be at least 2 characters'),
  priceType: z.nativeEnum(PriceType),
  unitAmount: z.number().min(0.01, 'Unit amount must be greater than 0').optional(),
  billingScheme: z.nativeEnum(BillingScheme),
  currency: z.nativeEnum(CurrencyCode),
  active: z.boolean().default(true),
  // Recurring fields
  interval: z.nativeEnum(PriceRecurringInterval).optional(),
  intervalCount: z.number().min(1).default(1).optional(),
  usageType: z.nativeEnum(PriceRecurringUsageType).optional(),
  trialPeriodDays: z.number().min(0).optional(),
}).refine((data) => {
  if (data.priceType === PriceType.RECURRING) {
    return data.interval && data.usageType;
  }
  return true;
}, {
  message: "Interval and usage type are required for recurring prices",
  path: ["interval"],
}).refine((data) => {
  if (data.billingScheme === BillingScheme.PER_UNIT) {
    return data.unitAmount && data.unitAmount > 0;
  }
  return true;
}, {
  message: "Unit amount is required for per-unit billing",
  path: ["unitAmount"],
});

type CreatePriceFormData = z.infer<typeof createPriceSchema>;

interface CreatePriceFormProps {
  productId: string;
  onClose: () => void;
  onSubmit: (data: CreatePriceFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreatePriceForm: React.FC<CreatePriceFormProps> = ({
  productId,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch, 
    setValue,
    trigger
  } = useForm<CreatePriceFormData>({
    resolver: zodResolver(createPriceSchema),
    defaultValues: {
      priceType: PriceType.RECURRING,
      billingScheme: BillingScheme.PER_UNIT,
      currency: CurrencyCode.XAF,
      active: true,
      intervalCount: 1,
      usageType: PriceRecurringUsageType.LICENSE,
      interval: PriceRecurringInterval.MONTH
    }
  });

  const watchedValues = watch();

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof CreatePriceFormData)[] => {
    switch (step) {
      case 1:
        return ['name', 'priceType', 'billingScheme'];
      case 2:
        return ['unitAmount', 'currency', 'interval', 'intervalCount', 'usageType'];
      default:
        return [];
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getIntervalLabel = (interval: PriceRecurringInterval, count: number) => {
    const labels = {
      [PriceRecurringInterval.DAY]: count === 1 ? 'day' : 'days',
      [PriceRecurringInterval.WEEK]: count === 1 ? 'week' : 'weeks',
      [PriceRecurringInterval.MONTH]: count === 1 ? 'month' : 'months',
      [PriceRecurringInterval.YEAR]: count === 1 ? 'year' : 'years',
    };
    return count === 1 ? labels[interval] : `${count} ${labels[interval]}`;
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step <= currentStep 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 2 && (
              <div className={`w-16 h-0.5 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <span>Basic Details</span>
        <span>Pricing & Billing</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <DollarSign className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Price Plan Details</h2>
        <p className="text-gray-600">Configure the basic details for your price plan</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Price Plan Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Monthly Professional, Annual Basic"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="priceType" className="block text-sm font-medium text-gray-700">
          Price Type <span className="text-red-500">*</span>
        </label>
        <select
          id="priceType"
          {...register('priceType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={PriceType.RECURRING}>Recurring (Subscription)</option>
          <option value={PriceType.ONE_TIME}>One-time Payment</option>
        </select>
        {errors.priceType && (
          <p className="mt-1 text-sm text-red-600">{errors.priceType.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {watchedValues.priceType === PriceType.RECURRING 
            ? 'Customers will be charged repeatedly at regular intervals'
            : 'Customers will be charged once for this product'
          }
        </p>
      </div>

      <div>
        <label htmlFor="billingScheme" className="block text-sm font-medium text-gray-700">
          Billing Scheme <span className="text-red-500">*</span>
        </label>
        <select
          id="billingScheme"
          {...register('billingScheme')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={BillingScheme.PER_UNIT}>Per Unit</option>
          <option value={BillingScheme.TIERED}>Tiered Pricing</option>
        </select>
        {errors.billingScheme && (
          <p className="mt-1 text-sm text-red-600">{errors.billingScheme.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {watchedValues.billingScheme === BillingScheme.PER_UNIT 
            ? 'Charge a fixed amount per unit'
            : 'Use different pricing tiers based on quantity'
          }
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          {...register('active')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
          Make this price plan active immediately
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Calendar className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Pricing Configuration</h2>
        <p className="text-gray-600">Set up the pricing details and billing intervals</p>
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
          Currency <span className="text-red-500">*</span>
        </label>
        <select
          id="currency"
          {...register('currency')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={CurrencyCode.XAF}>XAF (Central African CFA Franc)</option>
        </select>
        {errors.currency && (
          <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
        )}
      </div>

      {watchedValues.billingScheme === BillingScheme.PER_UNIT && (
        <div>
          <label htmlFor="unitAmount" className="block text-sm font-medium text-gray-700">
            Price Amount <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">XAF</span>
            </div>
            <input
              type="number"
              id="unitAmount"
              {...register('unitAmount', { valueAsNumber: true })}
              className="block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="25000"
            />
          </div>
          {errors.unitAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.unitAmount.message}</p>
          )}
          {watchedValues.unitAmount && (
            <p className="mt-1 text-sm text-gray-600">
              Formatted: {formatCurrency(watchedValues.unitAmount)}
            </p>
          )}
        </div>
      )}

      {watchedValues.priceType === PriceType.RECURRING && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
                Billing Interval <span className="text-red-500">*</span>
              </label>
              <select
                id="interval"
                {...register('interval')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value={PriceRecurringInterval.DAY}>Daily</option>
                <option value={PriceRecurringInterval.WEEK}>Weekly</option>
                <option value={PriceRecurringInterval.MONTH}>Monthly</option>
                <option value={PriceRecurringInterval.YEAR}>Yearly</option>
              </select>
              {errors.interval && (
                <p className="mt-1 text-sm text-red-600">{errors.interval.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="intervalCount" className="block text-sm font-medium text-gray-700">
                Interval Count
              </label>
              <input
                type="number"
                id="intervalCount"
                min="1"
                {...register('intervalCount', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.intervalCount && (
                <p className="mt-1 text-sm text-red-600">{errors.intervalCount.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Bill every {watchedValues.intervalCount || 1} {watchedValues.interval?.toLowerCase() || 'month'}(s)
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="usageType" className="block text-sm font-medium text-gray-700">
              Usage Type <span className="text-red-500">*</span>
            </label>
            <select
              id="usageType"
              {...register('usageType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value={PriceRecurringUsageType.LICENSE}>Licensed (Fixed fee)</option>
              <option value={PriceRecurringUsageType.METERED}>Metered (Usage-based)</option>
            </select>
            {errors.usageType && (
              <p className="mt-1 text-sm text-red-600">{errors.usageType.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {watchedValues.usageType === PriceRecurringUsageType.LICENSE 
                ? 'Charge a fixed amount each billing period'
                : 'Charge based on actual usage during the billing period'
              }
            </p>
          </div>

          <div>
            <label htmlFor="trialPeriodDays" className="block text-sm font-medium text-gray-700">
              Trial Period (days)
            </label>
            <input
              type="number"
              id="trialPeriodDays"
              min="0"
              {...register('trialPeriodDays', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0"
            />
            {errors.trialPeriodDays && (
              <p className="mt-1 text-sm text-red-600">{errors.trialPeriodDays.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Number of days customers can use the service for free before billing starts
            </p>
          </div>
        </>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Price Plan Summary</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• <strong>{watchedValues.name || 'Your price plan'}</strong></p>
              <p>• {watchedValues.priceType === PriceType.RECURRING ? 'Recurring subscription' : 'One-time payment'}</p>
              {watchedValues.unitAmount && (
                <p>• {formatCurrency(watchedValues.unitAmount)} {watchedValues.priceType === PriceType.RECURRING && watchedValues.interval ? `per ${getIntervalLabel(watchedValues.interval, watchedValues.intervalCount || 1)}` : ''}</p>
              )}
              {watchedValues.trialPeriodDays && watchedValues.trialPeriodDays > 0 && (
                <p>• {watchedValues.trialPeriodDays} day free trial</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Price Plan</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {renderStepIndicator()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}

          <div className="flex justify-between mt-8">
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
              
              {currentStep < totalSteps ? (
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
                      Creating...
                    </>
                  ) : (
                    'Create Price Plan'
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