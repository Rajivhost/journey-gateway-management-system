import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { CountryCode } from '../../types';
import { CountrySelector } from '../ui/CountrySelector';

const createCarrierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters'),
  country: z.nativeEnum(CountryCode),
});

type CreateCarrierFormData = z.infer<typeof createCarrierSchema>;

interface CreateCarrierFormProps {
  onClose: () => void;
  onSubmit: (data: CreateCarrierFormData) => void;
  initialCountry: CountryCode;
}

export const CreateCarrierForm: React.FC<CreateCarrierFormProps> = ({
  onClose,
  onSubmit,
  initialCountry
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateCarrierFormData>({
    resolver: zodResolver(createCarrierSchema),
    defaultValues: {
      country: initialCountry,
    }
  });

  const handleCountryChange = (country: CountryCode) => {
    setValue('country', country);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Carrier</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Carrier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Carrier Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  {...register('code')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div>
                <CountrySelector
                  value={watch('country')}
                  onChange={handleCountryChange}
                  label="Country"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Carrier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};