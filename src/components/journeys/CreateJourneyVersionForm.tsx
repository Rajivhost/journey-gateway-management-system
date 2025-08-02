import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, GitBranch, Code, Save } from 'lucide-react';
import { CreateJourneyVersionInput, createJourneyVersionSchema } from '../../types/journeys';
import { CountryCode } from '../../types';

interface CreateJourneyVersionFormProps {
  journeyId: string;
  country: CountryCode;
  onClose: () => void;
  onSubmit: (data: CreateJourneyVersionInput & { journeyId: string; country: CountryCode }) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateJourneyVersionForm: React.FC<CreateJourneyVersionFormProps> = ({
  journeyId,
  country,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<CreateJourneyVersionInput>({
    resolver: zodResolver(createJourneyVersionSchema),
    defaultValues: {
      yamlContent: `# Journey Version Configuration
name: "Updated Journey"
description: "Updated journey description"
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

  const handleFormSubmit = async (data: CreateJourneyVersionInput) => {
    await onSubmit({
      ...data,
      journeyId,
      country
    });
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <GitBranch className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Version</h2>
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
              <div className="text-center mb-6">
                <Code className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Journey Version Configuration</h3>
                <p className="text-gray-600">Create a new version of your journey with updated YAML configuration</p>
              </div>

              <div>
                <label htmlFor="yamlContent" className="block text-sm font-medium text-gray-700">
                  YAML Configuration <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="yamlContent"
                  rows={25}
                  {...register('yamlContent')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono text-sm"
                  placeholder="Enter your journey YAML configuration..."
                />
                {errors.yamlContent && (
                  <p className="mt-1 text-sm text-red-600">{errors.yamlContent.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Define the updated steps, menus, and flow of your USSD journey using YAML syntax
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Version Notes</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• This will create a new draft version of your journey</li>
                  <li>• You can publish this version later to make it live</li>
                  <li>• Previous versions will remain available for rollback</li>
                  <li>• Make sure to test your YAML configuration before publishing</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">YAML Guidelines</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Use proper indentation (2 spaces per level)</li>
                  <li>• Each step must have a unique ID</li>
                  <li>• Menu steps should have options with next step references</li>
                  <li>• End steps should have type: "end"</li>
                  <li>• Validate your YAML syntax before submitting</li>
                </ul>
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Version
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};