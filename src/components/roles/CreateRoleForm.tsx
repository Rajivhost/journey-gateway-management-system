import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Shield, Save, CheckSquare, Square, Settings } from 'lucide-react';
import { CreateRoleInput, createRoleSchema, Permission } from '../../types/roles';
import { usePermissionGroups } from '../../hooks/useRoles';
import { Loading } from '../ui/Loading';

interface CreateRoleFormProps {
  onClose: () => void;
  onSubmit: (data: CreateRoleInput) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateRoleForm: React.FC<CreateRoleFormProps> = ({
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const { permissionGroups, loading: groupsLoading } = usePermissionGroups();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setValue,
    trigger
  } = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      isActive: true,
      permissions: []
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

  const getFieldsForStep = (step: number): (keyof CreateRoleInput)[] => {
    switch (step) {
      case 1:
        return ['name', 'description'];
      case 2:
        return ['permissions'];
      default:
        return [];
    }
  };

  const handlePermissionToggle = (permission: Permission) => {
    const currentPermissions = watchedValues.permissions || [];
    const isSelected = currentPermissions.includes(permission);
    
    if (isSelected) {
      setValue('permissions', currentPermissions.filter(p => p !== permission));
    } else {
      setValue('permissions', [...currentPermissions, permission]);
    }
  };

  const handleGroupToggle = (groupPermissions: Permission[]) => {
    const currentPermissions = watchedValues.permissions || [];
    const allSelected = groupPermissions.every(p => currentPermissions.includes(p));
    
    if (allSelected) {
      // Remove all group permissions
      setValue('permissions', currentPermissions.filter(p => !groupPermissions.includes(p)));
    } else {
      // Add all group permissions
      const newPermissions = [...new Set([...currentPermissions, ...groupPermissions])];
      setValue('permissions', newPermissions);
    }
  };

  const renderStepIndicator = () => (
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
        <span>Basic Information</span>
        <span>Permissions</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Role Information</h2>
        <p className="text-gray-600">Set up the basic details for your new role</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Role Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Content Manager, API Developer"
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
          placeholder="Describe what this role is for and what responsibilities it includes..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Role is active and can be assigned to users
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Assign Permissions</h2>
        <p className="text-gray-600">Select the permissions this role should have</p>
      </div>

      {groupsLoading ? (
        <Loading text="Loading permissions..." />
      ) : (
        <div className="space-y-6">
          {permissionGroups.map((group) => {
            const currentPermissions = watchedValues.permissions || [];
            const groupPermissions = group.permissions;
            const selectedCount = groupPermissions.filter(p => currentPermissions.includes(p)).length;
            const allSelected = selectedCount === groupPermissions.length;
            const someSelected = selectedCount > 0 && selectedCount < groupPermissions.length;

            return (
              <div key={group.groupId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleGroupToggle(groupPermissions)}
                        className="flex items-center"
                      >
                        {allSelected ? (
                          <CheckSquare className="h-5 w-5 text-blue-600 mr-3" />
                        ) : someSelected ? (
                          <div className="h-5 w-5 mr-3 border-2 border-blue-600 rounded bg-blue-100 flex items-center justify-center">
                            <div className="h-2 w-2 bg-blue-600 rounded"></div>
                          </div>
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {selectedCount}/{groupPermissions.length} selected
                    </span>
                  </div>
                  {group.description && (
                    <p className="mt-1 text-xs text-gray-600">{group.description}</p>
                  )}
                </div>
                
                <div className="px-4 py-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {groupPermissions.map((permission) => {
                      const isSelected = currentPermissions.includes(permission);
                      
                      return (
                        <label
                          key={permission}
                          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePermissionToggle(permission)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {errors.permissions && (
            <p className="text-sm text-red-600">{errors.permissions.message}</p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Permission Summary</h3>
            <p className="text-sm text-blue-700">
              Selected {watchedValues.permissions?.length || 0} permission{(watchedValues.permissions?.length || 0) !== 1 ? 's' : ''} 
              {watchedValues.name && ` for "${watchedValues.name}"`}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Role</h2>
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
                      Create Role
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