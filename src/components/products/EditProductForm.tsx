import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { 
  EditProductInput, 
  editProductSchema, 
  Product,
  CreditCarryOverPolicy 
} from '../../types/products';

interface EditProductFormProps {
  product: Product;
  onSubmit: (data: EditProductInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch
  } = useForm<EditProductInput>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || '',
      active: product.active,
      creditAllocation: product.creditAllocation ? {
        initialCredits: product.creditAllocation.initialCredits,
        renewalCredits: product.creditAllocation.renewalCredits,
        expiryPeriod: product.creditAllocation.expiryPeriod,
        carryOverPolicy: product.creditAllocation.carryOverPolicy,
        carryOverValue: product.creditAllocation.carryOverValue
      } : undefined
    }
  });

  const watchedValues = watch();

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 max-h-[calc(100vh-250px)] overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name <span className="text-red-500">*</span>
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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      {...register('description')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      {...register('active')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Product is active
                    </label>
                  </div>
                </div>
              </div>

              {/* Credit Allocation */}
              {product.creditAllocation && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Allocation</h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="initialCredits" className="block text-sm font-medium text-gray-700">
                        Initial Credits <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="initialCredits"
                        {...register('creditAllocation.initialCredits', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      {errors.creditAllocation?.initialCredits && (
                        <p className="mt-1 text-sm text-red-600">{errors.creditAllocation.initialCredits.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="renewalCredits" className="block text-sm font-medium text-gray-700">
                        Renewal Credits
                      </label>
                      <input
                        type="number"
                        id="renewalCredits"
                        {...register('creditAllocation.renewalCredits', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      {errors.creditAllocation?.renewalCredits && (
                        <p className="mt-1 text-sm text-red-600">{errors.creditAllocation.renewalCredits.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="expiryPeriod" className="block text-sm font-medium text-gray-700">
                        Expiry Period (days)
                      </label>
                      <input
                        type="number"
                        id="expiryPeriod"
                        {...register('creditAllocation.expiryPeriod', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      {errors.creditAllocation?.expiryPeriod && (
                        <p className="mt-1 text-sm text-red-600">{errors.creditAllocation.expiryPeriod.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="carryOverPolicy" className="block text-sm font-medium text-gray-700">
                        Carry-Over Policy
                      </label>
                      <select
                        id="carryOverPolicy"
                        {...register('creditAllocation.carryOverPolicy')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value={CreditCarryOverPolicy.NONE}>None - Credits expire</option>
                        <option value={CreditCarryOverPolicy.FULL}>Full - All credits carry over</option>
                        <option value={CreditCarryOverPolicy.PERCENTAGE}>Percentage - Partial carry over</option>
                        <option value={CreditCarryOverPolicy.CAPPED}>Capped - Limited carry over</option>
                      </select>
                      {errors.creditAllocation?.carryOverPolicy && (
                        <p className="mt-1 text-sm text-red-600">{errors.creditAllocation.carryOverPolicy.message}</p>
                      )}
                    </div>
                  </div>

                  {(watchedValues.creditAllocation?.carryOverPolicy === CreditCarryOverPolicy.PERCENTAGE || 
                    watchedValues.creditAllocation?.carryOverPolicy === CreditCarryOverPolicy.CAPPED) && (
                    <div className="mt-4">
                      <label htmlFor="carryOverValue" className="block text-sm font-medium text-gray-700">
                        {watchedValues.creditAllocation?.carryOverPolicy === CreditCarryOverPolicy.PERCENTAGE 
                          ? 'Carry-Over Percentage' 
                          : 'Carry-Over Cap'}
                      </label>
                      <input
                        type="number"
                        id="carryOverValue"
                        {...register('creditAllocation.carryOverValue', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      {errors.creditAllocation?.carryOverValue && (
                        <p className="mt-1 text-sm text-red-600">{errors.creditAllocation.carryOverValue.message}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2 inline-block" />
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