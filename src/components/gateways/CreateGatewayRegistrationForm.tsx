import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, MapPin, CreditCard, DollarSign } from 'lucide-react';
import { 
  CreateJourneyGatewayRegistrationInput, 
  createJourneyGatewayRegistrationSchema,
  CountryCode 
} from '../../types';
import { CountrySelector } from '../ui/CountrySelector';
import { useProducts } from '../../hooks/useProducts';
import { Loading } from '../ui/Loading';

interface CreateGatewayRegistrationFormProps {
  onClose: () => void;
  onSubmit: (data: CreateJourneyGatewayRegistrationInput) => void;
  initialCountry: CountryCode;
  gatewayId?: string;
}

export const CreateGatewayRegistrationForm: React.FC<CreateGatewayRegistrationFormProps> = ({
  onClose,
  onSubmit,
  initialCountry,
  gatewayId
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const { products, loading: productsLoading } = useProducts();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch,
    trigger
  } = useForm<CreateJourneyGatewayRegistrationInput>({
    resolver: zodResolver(createJourneyGatewayRegistrationSchema),
    defaultValues: {
      country: initialCountry,
      active: true,
      gatewayId: gatewayId || '',
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

  const getFieldsForStep = (step: number): (keyof CreateJourneyGatewayRegistrationInput)[] => {
    switch (step) {
      case 1:
        return ['name', 'country', 'gatewayId'];
      case 2:
        return ['menuText', 'position', 'priority'];
      case 3:
        return ['priceId'];
      default:
        return [];
    }
  };

  const handleCountryChange = (country: CountryCode) => {
    setValue('country', country);
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
        <span>Menu Setup</span>
        <span>Pricing</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Registration Information</h2>
        <p className="text-gray-600">Set up the basic details for your gateway registration</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Registration Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Mobile Money Service Registration"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <CountrySelector
          value={watch('country')}
          onChange={handleCountryChange}
          label="Country"
        />
      </div>

      <div>
        <label htmlFor="gatewayId" className="block text-sm font-medium text-gray-700">
          Gateway ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="gatewayId"
          {...register('gatewayId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Gateway identifier"
        />
        {errors.gatewayId && (
          <p className="mt-1 text-sm text-red-600">{errors.gatewayId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="providerId" className="block text-sm font-medium text-gray-700">
          Provider ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="providerId"
          {...register('providerId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Service provider identifier"
        />
        {errors.providerId && (
          <p className="mt-1 text-sm text-red-600">{errors.providerId.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          {...register('active')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
          Active registration
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Menu Configuration</h2>
        <p className="text-gray-600">Configure how this registration appears in gateway menus</p>
      </div>

      <div>
        <label htmlFor="menuText" className="block text-sm font-medium text-gray-700">
          Menu Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="menuText"
          {...register('menuText')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Text displayed in the menu"
        />
        {errors.menuText && (
          <p className="mt-1 text-sm text-red-600">{errors.menuText.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="position"
            min="1"
            {...register('position', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Menu position"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <input
            type="number"
            id="priority"
            min="1"
            {...register('priority', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Optional priority"
          />
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700">
          Short Code
        </label>
        <input
          type="text"
          id="shortCode"
          {...register('shortCode')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Optional short code"
        />
        {errors.shortCode && (
          <p className="mt-1 text-sm text-red-600">{errors.shortCode.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="journeyId" className="block text-sm font-medium text-gray-700">
          Journey ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="journeyId"
          {...register('journeyId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Associated journey identifier"
        />
        {errors.journeyId && (
          <p className="mt-1 text-sm text-red-600">{errors.journeyId.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Pricing Selection</h2>
        <p className="text-gray-600">Choose a credit-based pricing plan for this registration</p>
      </div>

      {productsLoading ? (
        <Loading text="Loading pricing plans..." />
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Pricing Plan
          </label>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="no-price"
                value=""
                {...register('priceId')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="no-price" className="ml-3 block text-sm text-gray-900">
                No pricing plan (Free access)
              </label>
            </div>

            {products.map((product) => (
              <div key={product.productId} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                )}
                
                <div className="space-y-2">
                  {product.prices.map((price) => (
                    <div key={price.priceId} className="flex items-center">
                      <input
                        type="radio"
                        id={price.priceId}
                        value={price.priceId}
                        {...register('priceId')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={price.priceId} className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{price.name}</span>
                            <div className="text-xs text-gray-500">
                              {product.creditAllocation && (
                                <span>
                                  {product.creditAllocation.initialCredits.toLocaleString()} initial credits
                                  {product.creditAllocation.renewalCredits && (
                                    <span>, {product.creditAllocation.renewalCredits.toLocaleString()} renewal credits</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(price.unitAmount || 0)}
                            </div>
                            {price.recurring && (
                              <div className="text-xs text-gray-500">
                                per {price.recurring.interval.toLowerCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {errors.priceId && (
            <p className="mt-1 text-sm text-red-600">{errors.priceId.message}</p>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <DollarSign className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Pricing Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Credit-based pricing allows you to control usage and costs</p>
              <p>• Credits are consumed based on API calls and transactions</p>
              <p>• You can monitor credit usage and balance in real-time</p>
              <p>• Choose "No pricing plan" for unlimited free access</p>
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
          <h2 className="text-xl font-semibold text-gray-900">Create Gateway Registration</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepIndicator()}
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
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
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Registration
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};