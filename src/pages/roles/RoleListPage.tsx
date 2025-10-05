import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { RoleList } from '../../components/roles/RoleList';
import { CreateRoleForm } from '../../components/roles/CreateRoleForm';
import { useRoles } from '../../hooks/useRoles';
import { Role, CreateRoleInput } from '../../types/roles';

export const RoleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    roles, 
    loading, 
    error, 
    createRole, 
    updateRole, 
    deleteRole,
    duplicateRole
  } = useRoles();

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = async (data: CreateRoleInput) => {
    setIsSubmitting(true);
    try {
      const role = await createRole(data);
      setShowCreateForm(false);
      navigate(`/roles/${role.roleId}`);
    } catch (error) {
      console.error('Failed to create role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (role: Role) => {
    navigate(`/roles/${role.roleId}/edit`);
  };

  const handleView = (role: Role) => {
    navigate(`/roles/${role.roleId}`);
  };

  const handleDelete = async (roleId: string) => {
    const role = roles.find(r => r.roleId === roleId);
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
        await deleteRole(roleId);
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const handleDuplicate = async (roleId: string) => {
    try {
      const duplicatedRole = await duplicateRole(roleId);
      navigate(`/roles/${duplicatedRole.roleId}/edit`);
    } catch (error) {
      console.error('Failed to duplicate role:', error);
    }
  };

  const handleToggleStatus = async (roleId: string) => {
    const role = roles.find(r => r.roleId === roleId);
    if (!role) return;

    if (role.type === 'SYSTEM') {
      alert('System roles cannot be deactivated.');
      return;
    }

    try {
      await updateRole(roleId, {
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: !role.isActive
      });
    } catch (error) {
      console.error('Failed to toggle role status:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and their associated permissions"
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'Roles & Permissions' }
        ]}
        actions={
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </button>
        }
      />

      <div className="mt-6">
        <RoleList
          roles={roles}
          loading={loading}
          error={error}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {showCreateForm && (
        <CreateRoleForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};