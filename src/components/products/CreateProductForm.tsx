import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Save, ArrowLeft, CreditCard, DollarSign, 
  RefreshCw, Clock, Info, AlertCircle
} from 'lucide-react';
import { 
  CreateCreditProductInput, 
  createCreditProductSchema, 
  CreditCarryOverPolicy 
} from '../../types/products';

interface CreateProductFormProps {
  onSubmit: (data: CreateCreditProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch, 
    setValue,
    trigger
  } = useForm<CreateCreditProductInput>({
    resolver: zodResolver(createCreditProductSchema),
    defaultValues: {
      carryOverPolicy: CreditCarryOverPolicy.PERCENTAGE,
      carryOverValue: 10
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

  const getFieldsForStep = (step: number): (keyof CreateCreditProductInput)[] => {
    switch (step) {
      case 1:
        return ['name', 'description'];
      case 2:
        return ['initialCredits', 'renewalCredits', 'expiryPeriod', 'carryOverPolicy', 'carryOverValue'];
      case 3:
        return ['priceName', 'unitAmount'];
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

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step <= currentStep 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-0.5 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <span>Basic Info</span>
        <span>Credit Settings</span>
        <span>Pricing</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Product Information</h2>
        <p className="text-gray-600">Let's start with the basic details of your credit product</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Professional API Credits"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Describe what this product offers and who it's for..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <RefreshCw className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Credit Allocation</h2>
        <p className="text-gray-600">Configure how credits are allocated and managed</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="initialCredits" className="block text-sm font-medium text-gray-700">
            Initial Credits <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="initialCredits"
            {...register('initialCredits', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="1000"
          />
          {errors.initialCredits && (
            <p className="mt-1 text-sm text-red-600">{errors.initialCredits.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Credits given when subscription starts</p>
        </div>

        <div>
          <label htmlFor="renewalCredits" className="block text-sm font-medium text-gray-700">
            Renewal Credits
          </label>
          <input
            type="number"
            id="renewalCredits"
            {...register('renewalCredits', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="1000"
          />
          {errors.renewalCredits && (
            <p className="mt-1 text-sm text-red-600">{errors.renewalCredits.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Credits given on each renewal period</p>
        </div>

        <div>
          <label htmlFor="expiryPeriod" className="block text-sm font-medium text-gray-700">
            Credit Expiry (days)
          </label>
          <input
            type="number"
            id="expiryPeriod"
            {...register('expiryPeriod', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="30"
          />
          {errors.expiryPeriod && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryPeriod.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">How long credits remain valid</p>
        </div>

        <div>
          <label htmlFor="carryOverPolicy" className="block text-sm font-medium text-gray-700">
            Carry-Over Policy <span className="text-red-500">*</span>
          </label>
          <select
            id="carryOverPolicy"
            {...register('carryOverPolicy')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value={CreditCarryOverPolicy.NONE}>None - Credits expire</option>
            <option value={CreditCarryOverPolicy.FULL}>Full - All credits carry over</option>
            <option value={CreditCarryOverPolicy.PERCENTAGE}>Percentage - Partial carry over</option>
            <option value={CreditCarryOverPolicy.CAPPED}>Capped - Limited carry over</option>
          </select>
          {errors.carryOverPolicy && (
            <p className="mt-1 text-sm text-red-600">{errors.carryOverPolicy.message}</p>
          )}
        </div>
      </div>

      {(watchedValues.carryOverPolicy === CreditCarryOverPolicy.PERCENTAGE || 
        watchedValues.carryOverPolicy === CreditCarryOverPolicy.CAPPED) && (
        <div>
          <label htmlFor="carryOverValue" className="block text-sm font-medium text-gray-700">
            {watchedValues.carryOverPolicy === CreditCarryOverPolicy.PERCENTAGE 
              ? 'Carry-Over Percentage' 
              : 'Carry-Over Cap'}
          </label>
          <input
            type="number"
            id="carryOverValue"
            {...register('carryOverValue', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={watchedValues.carryOverPolicy === CreditCarryOverPolicy.PERCENTAGE ? "10" : "500"}
          />
          {errors.carryOverValue && (
            <p className="mt-1 text-sm text-red-600">{errors.carryOverValue.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {watchedValues.carryOverPolicy === CreditCarryOverPolicy.PERCENTAGE 
              ? 'Percentage of unused credits to carry over'
              : 'Maximum number of credits to carry over'}
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Credit Allocation Preview</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Users will receive <strong>{watchedValues.initialCredits || 0}</strong> credits when they first subscribe</p>
              {watchedValues.renewalCredits && (
                <p>• They'll get <strong>{watchedValues.renewalCredits}</strong> credits on each renewal</p>
              )}
              {watchedValues.expiryPeriod && (
                <p>• Credits will expire after <strong>{watchedValues.expiryPeriod}</strong> days</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <DollarSign className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Pricing Configuration</h2>
        <p className="text-gray-600">Set up the default pricing for this product</p>
      </div>

      <div>
        <label htmlFor="priceName" className="block text-sm font-medium text-gray-700">
          Price Plan Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="priceName"
          {...register('priceName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Monthly Professional"
        />
        {errors.priceName && (
          <p className="mt-1 text-sm text-red-600">{errors.priceName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="unitAmount" className="block text-sm font-medium text-gray-700">
          Price (XAF) <span className="text-red-500">*</span>
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

      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <Clock className="h-5 w-5 text-green-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Pricing Summary</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>• <strong>{watchedValues.priceName || 'Your price plan'}</strong></p>
              <p>• Monthly recurring subscription</p>
              <p>• {formatCurrency(watchedValues.unitAmount || 0)} per month</p>
              <p>• Includes {watchedValues.initialCredits || 0} initial credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {renderStepIndicator()}
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
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
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};