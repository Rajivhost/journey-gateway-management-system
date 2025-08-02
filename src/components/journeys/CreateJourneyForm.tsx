import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, MapPin, Code, Eye, Save } from 'lucide-react';
import { CreateJourneyInput, createJourneySchema, JourneyVisibility } from '../../types/journeys';
import { CountryCode } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { Loading } from '../ui/Loading';

interface CreateJourneyFormProps {
  onClose: () => void;
  onSubmit: (data: CreateJourneyInput & { providerId: string; country: CountryCode }) => Promise<void>;
  providerId: string;
  country: CountryCode;
  isSubmitting?: boolean;
}

export const CreateJourneyForm: React.FC<CreateJourneyFormProps> = ({
  onClose,
  onSubmit,
  providerId,
  country,
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const { categories, loading: categoriesLoading } = useCategories(country);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setValue,
    trigger
  } = useForm<CreateJourneyInput>({
    resolver: zodResolver(createJourneySchema),
    defaultValues: {
      visibility: JourneyVisibility.PRIVATE,
      yamlContent: `# Journey Configuration
name: "My Journey"
description: "Journey description"
steps:
  - id: "welcome"
    type: "menu"
    text: "Welcome! Choose an option:"
    options:
      - text: "Option 1"
        next: "step1"
      - text: "Option 2"
        next: "step2"
  - id: "step1"
    type: "display"
    text: "You selected option 1"
    next: "end"
  - id: "step2"
    type: "display"
    text: "You selected option 2"
    next: "end"
  - id: "end"
    type: "end"
    text: "Thank you!"`
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

  const getFieldsForStep = (step: number): (keyof CreateJourneyInput)[] => {
    switch (step) {
      case 1:
        return ['name', 'categoryId', 'visibility'];
      case 2:
        return ['description'];
      case 3:
        return ['yamlContent'];
      default:
        return [];
    }
  };

  const handleFormSubmit = async (data: CreateJourneyInput) => {
    await onSubmit({
      ...data,
      providerId,
      country
    });
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
        <span>Description</span>
        <span>Journey Flow</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Journey Information</h2>
        <p className="text-gray-600">Set up the basic details for your journey</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Journey Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Mobile Money Transfer"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        {categoriesLoading ? (
          <Loading size="sm" text="Loading categories..." />
        ) : (
          <select
            id="categoryId"
            {...register('categoryId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
          Visibility <span className="text-red-500">*</span>
        </label>
        <select
          id="visibility"
          {...register('visibility')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={JourneyVisibility.PRIVATE}>Private - Only you can see this journey</option>
          <option value={JourneyVisibility.PUBLIC}>Public - Anyone can discover this journey</option>
          <option value={JourneyVisibility.UNLISTED}>Unlisted - Accessible via direct link only</option>
        </select>
        {errors.visibility && (
          <p className="mt-1 text-sm text-red-600">{errors.visibility.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Eye className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Journey Description</h2>
        <p className="text-gray-600">Provide additional details about your journey</p>
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
          placeholder="Describe what this journey does and how users will interact with it..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          This description will help users understand what your journey does
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Journey Preview</h3>
        <div className="text-sm text-blue-700">
          <p><strong>Name:</strong> {watchedValues.name || 'Journey Name'}</p>
          <p><strong>Category:</strong> {categories.find(c => c.categoryId === watchedValues.categoryId)?.name || 'Select a category'}</p>
          <p><strong>Visibility:</strong> {watchedValues.visibility}</p>
          {watchedValues.description && (
            <p><strong>Description:</strong> {watchedValues.description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Code className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Journey Flow</h2>
        <p className="text-gray-600">Define the YAML configuration for your journey</p>
      </div>

      <div>
        <label htmlFor="yamlContent" className="block text-sm font-medium text-gray-700">
          YAML Configuration <span className="text-red-500">*</span>
        </label>
        <textarea
          id="yamlContent"
          rows={20}
          {...register('yamlContent')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono text-sm"
          placeholder="Enter your journey YAML configuration..."
        />
        {errors.yamlContent && (
          <p className="mt-1 text-sm text-red-600">{errors.yamlContent.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Define the steps, menus, and flow of your USSD journey using YAML syntax
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">YAML Tips</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use proper indentation (2 spaces per level)</li>
          <li>• Each step must have a unique ID</li>
          <li>• Menu steps should have options with next step references</li>
          <li>• End steps should have type: "end"</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Journey</h2>
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
                      Create Journey
                    </>
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