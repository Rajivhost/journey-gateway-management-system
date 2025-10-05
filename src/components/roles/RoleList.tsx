import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MoreVertical, Edit, Trash2, 
  Copy, Eye, Plus, Shield, Users, CheckCircle, 
  XCircle, Crown, Settings
} from 'lucide-react';
import { Role, RoleType } from '../../types/roles';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface RoleListProps {
  roles: Role[];
  loading: boolean;
  error: Error | null;
  onCreateNew: () => void;
  onEdit: (role: Role) => void;
  onView: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onDuplicate: (roleId: string) => void;
  onToggleStatus: (roleId: string) => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  loading,
  error,
  onCreateNew,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<RoleType | ''>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'users'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredRoles = roles
    .filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           role.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !typeFilter || role.type === typeFilter;
      const matchesStatus = !statusFilter || 
                           (statusFilter === 'active' && role.isActive) ||
                           (statusFilter === 'inactive' && !role.isActive);
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'users':
          comparison = a.userCount - b.userCount;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadge = (role: Role) => {
    if (role.type === RoleType.SYSTEM) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Crown className="w-3 h-3 mr-1" />
          System
        </span>
      );
    }

    return role.isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loading text="Loading roles..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading roles</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <EmptyState
        title="No roles found"
        description="Create your first role to start managing user permissions and access control."
        icon={<Shield className="w-8 h-8 text-gray-400" />}
        actionLabel="Create Role"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as RoleType | '')}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value={RoleType.SYSTEM}>System</option>
                <option value={RoleType.CUSTOM}>Custom</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | '')}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'name' | 'created' | 'users');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="created-desc">Newest first</option>
                <option value="created-asc">Oldest first</option>
                <option value="users-desc">Most users</option>
                <option value="users-asc">Least users</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Roles grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRoles.map((role) => (
          <div key={role.roleId} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md ${
                    role.type === RoleType.SYSTEM ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {role.type === RoleType.SYSTEM ? (
                      <Crown className="h-6 w-6 text-purple-600" />
                    ) : (
                      <Shield className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                    <div className="flex items-center mt-1">
                      {getStatusBadge(role)}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {role.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{role.description}</p>
              )}

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Permissions:</span>
                  <span className="text-gray-900 font-medium">{role.permissions.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Users:</span>
                  <span className="text-gray-900 font-medium">{role.userCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {role.type.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Created {formatDate(role.createdAt)}
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(role)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => onDuplicate(role.roleId)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Duplicate role"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  {role.type === RoleType.CUSTOM && (
                    <>
                      <button
                        onClick={() => onEdit(role)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Edit role"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete(role.roleId)}
                        className="inline-flex items-center p-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete role"
                        disabled={role.userCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && roles.length > 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No roles match your filters</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};