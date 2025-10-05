import React, { useState } from 'react';
import { Shield, Users, Calendar, CreditCard as Edit, Trash2, Copy, Crown, CheckCircle, XCircle, Clock, Settings, LayoutDashboard, Radio, MapPin, Activity, Building2, Package, Globe, Tags, CreditCard, Smartphone } from 'lucide-react';
import { Role, Permission, RoleType } from '../../types/roles';
import { Loading } from '../ui/Loading';

interface RoleDetailProps {
  role: Role | null;
  loading: boolean;
  error: Error | null;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const RoleDetail: React.FC<RoleDetailProps> = ({
  role,
  loading,
  error,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'users'>('overview');

  if (loading) {
    return <Loading text="Loading role details..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading role</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
        <p className="font-medium">Role not found</p>
        <p className="mt-1 text-sm">The role you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const getStatusBadge = (role: Role) => {
    if (role.type === RoleType.SYSTEM) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          <Crown className="w-4 h-4 mr-2" />
          System Role
        </span>
      );
    }

    return role.isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-4 h-4 mr-2" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-4 h-4 mr-2" />
        Inactive
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPermissionIcon = (permission: Permission) => {
    // Map permissions to appropriate icons
    if (permission.includes('DASHBOARD')) return <LayoutDashboard className="h-4 w-4" />;
    if (permission.includes('GATEWAYS')) return <Radio className="h-4 w-4" />;
    if (permission.includes('JOURNEYS')) return <MapPin className="h-4 w-4" />;
    if (permission.includes('SESSIONS')) return <Activity className="h-4 w-4" />;
    if (permission.includes('PROVIDERS')) return <Building2 className="h-4 w-4" />;
    if (permission.includes('PRODUCTS')) return <Package className="h-4 w-4" />;
    if (permission.includes('CARRIERS')) return <Globe className="h-4 w-4" />;
    if (permission.includes('CATEGORIES')) return <Tags className="h-4 w-4" />;
    if (permission.includes('PAYMENTS') || permission.includes('BILLING')) return <CreditCard className="h-4 w-4" />;
    if (permission.includes('USERS')) return <Users className="h-4 w-4" />;
    if (permission.includes('ROLES')) return <Shield className="h-4 w-4" />;
    if (permission.includes('SETTINGS')) return <Settings className="h-4 w-4" />;
    if (permission.includes('SIMULATOR')) return <Smartphone className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const formatPermissionName = (permission: Permission) => {
    return permission
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const groupPermissionsByCategory = (permissions: Permission[]) => {
    const groups: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      const category = permission.split('_')[0].toLowerCase();
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Role Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
          <div className="flex items-center">
            {role.type === RoleType.SYSTEM ? (
              <Crown className="h-6 w-6 text-purple-600 mr-3" />
            ) : (
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
            )}
            <h3 className="text-lg font-medium text-gray-900">Role Information</h3>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(role)}
            {role.type === RoleType.CUSTOM && (
              <button 
                onClick={onEdit}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Role Name</h4>
              <p className="mt-1 text-sm text-gray-900">{role.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Role Type</h4>
              <p className="mt-1 text-sm text-gray-900 capitalize">{role.type.toLowerCase()}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Assigned Users</h4>
              <p className="mt-1 text-sm text-gray-900">{role.userCount}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Permissions</h4>
              <p className="mt-1 text-sm text-gray-900">{role.permissions.length}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className="mt-1 text-sm text-gray-900">{role.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created By</h4>
              <p className="mt-1 text-sm text-gray-900">{role.createdBy || 'System'}</p>
            </div>
            
            {role.description && (
              <div className="sm:col-span-2 lg:col-span-3">
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-sm text-gray-900">{role.description}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-xs text-gray-500 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>Created: {formatDate(role.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>Last Updated: {formatDate(role.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={onDuplicate}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Role
          </button>
          
          {role.type === RoleType.CUSTOM && (
            <>
              <button
                onClick={onEdit}
                className="flex items-center justify-center px-4 py-3 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Role
              </button>
              
              {role.userCount === 0 && (
                <button
                  onClick={onDelete}
                  className="flex items-center justify-center px-4 py-3 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Role
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderPermissionsTab = () => {
    const groupedPermissions = groupPermissionsByCategory(role.permissions);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Role Permissions</h3>
          <div className="text-sm text-gray-500">
            {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''} assigned
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 capitalize">
                  {category} Permissions
                </h4>
              </div>
              <div className="px-4 py-3">
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div key={permission} className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getPermissionIcon(permission)}
                      </div>
                      <span className="text-sm text-gray-900">
                        {formatPermissionName(permission)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Assigned Users</h3>
        <div className="text-sm text-gray-500">
          {role.userCount} user{role.userCount !== 1 ? 's' : ''} assigned
        </div>
      </div>

      {role.userCount === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users assigned</h3>
          <p className="mt-1 text-sm text-gray-500">
            This role has not been assigned to any users yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">
            User management functionality will be available here. This would show:
          </p>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>List of users assigned to this role</li>
            <li>User assignment and removal capabilities</li>
            <li>Role assignment history and audit trail</li>
            <li>Bulk user management operations</li>
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {role.type === RoleType.SYSTEM ? (
              <Crown className="h-8 w-8 text-purple-600 mr-4" />
            ) : (
              <Shield className="h-8 w-8 text-blue-600 mr-4" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{role.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {role.type === RoleType.SYSTEM ? 'System' : 'Custom'} Role • {role.permissions.length} permissions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onDuplicate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </button>
            
            {role.type === RoleType.CUSTOM && (
              <>
                <button
                  onClick={onEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Role
                </button>
                
                {role.userCount === 0 && (
                  <button
                    onClick={onDelete}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: Shield },
              { id: 'permissions', name: 'Permissions', icon: Settings },
              { id: 'users', name: 'Users', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'permissions' && renderPermissionsTab()}
          {activeTab === 'users' && renderUsersTab()}
        </div>
      </div>
    </div>
  );
};