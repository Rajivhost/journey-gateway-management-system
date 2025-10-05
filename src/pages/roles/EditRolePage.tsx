import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { EditRoleForm } from '../../components/roles/EditRoleForm';
import { useRole, useRoles } from '../../hooks/useRoles';
import { EditRoleInput } from '../../types/roles';

export const EditRolePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, loading, error } = useRole(id || '');
  const { updateRole } = useRoles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EditRoleInput) => {
    if (!role) return;
    
    setIsSubmitting(true);
    try {
      await updateRole(role.roleId, data);
      navigate(`/settings/roles/${role.roleId}`);
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/settings/roles/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p className="font-medium">Error loading role</p>
          <p className="mt-1 text-sm">{error?.message || 'Role not found'}</p>
        </div>
      </div>
    );
  }

  if (role.type === 'SYSTEM') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          <p className="font-medium">Cannot Edit System Role</p>
          <p className="mt-1 text-sm">System roles cannot be modified. You can duplicate this role to create a custom version.</p>
          <div className="mt-4">
            <button
              onClick={() => navigate(`/settings/roles/${role.roleId}`)}
              className="inline-flex items-center px-3 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-white hover:bg-yellow-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Role Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Edit Role"
        description={`Editing ${role.name}`}
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'Roles & Permissions', path: '/settings/roles' },
          { label: role.name, path: `/settings/roles/${role.roleId}` },
          { label: 'Edit' }
        ]}
        actions={
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </button>
        }
      />

      <div className="mt-6">
        <div className="max-w-4xl mx-auto">
          <EditRoleForm
            role={role}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};