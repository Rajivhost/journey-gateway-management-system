import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Copy, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { RoleDetail } from '../../components/roles/RoleDetail';
import { useRole, useRoles } from '../../hooks/useRoles';

export const RoleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, loading, error } = useRole(id || '');
  const { deleteRole, duplicateRole } = useRoles();

  const handleEdit = () => {
    navigate(`/settings/roles/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!role) return;

    if (role.type === 'SYSTEM') {
      alert('System roles cannot be deleted.');
      return;
    }

    if (role.userCount > 0) {
      alert(`Cannot delete role "${role.name}" because it is assigned to ${role.userCount} user(s). Please reassign these users to other roles first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
      try {
        await deleteRole(role.roleId);
        navigate('/settings/roles');
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const handleDuplicate = async () => {
    if (!role) return;

    try {
      const duplicatedRole = await duplicateRole(role.roleId);
      navigate(`/settings/roles/${duplicatedRole.roleId}/edit`);
    } catch (error) {
      console.error('Failed to duplicate role:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={role ? role.name : 'Role Details'}
        description={role ? `${role.type === 'SYSTEM' ? 'System' : 'Custom'} Role • ${role.userCount} user${role.userCount !== 1 ? 's' : ''}` : 'Loading role information...'}
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'Roles & Permissions', path: '/settings/roles' },
          { label: role ? role.name : 'Role Details' }
        ]}
        actions={
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/settings/roles')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roles
            </button>
            
            {role && (
              <>
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </button>
                
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading || error || !role}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Role
                </button>
                
                {role.type === 'CUSTOM' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        }
      />

      <div className="mt-6">
        <RoleDetail
          role={role}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </div>
    </div>
  );
};