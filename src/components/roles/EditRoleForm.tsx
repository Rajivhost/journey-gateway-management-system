import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Shield, Settings, CheckSquare, Square } from 'lucide-react';
import { 
  EditRoleInput, 
  editRoleSchema, 
  Role,
  Permission 
} from '../../types/roles';
import { usePermissionGroups } from '../../hooks/useRoles';
import { Loading } from '../ui/Loading';

interface EditRoleFormProps {
  role: Role;
  onSubmit: (data: EditRoleInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EditRoleForm: React.FC<EditRoleFormProps> = ({
  role,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { permissionGroups, loading: groupsLoading } = usePermissionGroups();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setValue
  } = useForm<EditRoleInput>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: role.name,
      description: role.description || '',
      permissions: role.permissions,
      isActive: role.isActive
    }
  });

  const watchedValues = watch();

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

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Role Information</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Role Name <span className="text-red-500">*</span>
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
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Role is active and can be assigned to users
            </label>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Permissions</h2>
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
                <div key={group.groupId} className="border border-gray-200 rounded-lg overflow-hidden">
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
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
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
    </div>
  );
};