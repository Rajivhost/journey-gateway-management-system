import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useScopes } from '../../hooks/useScopes';
import { ApiScope } from '../../types/scopes';
import { Loading } from '../../components/ui/Loading';

export const ScopeListPage: React.FC = () => {
  const navigate = useNavigate();
  const { scopes, loading, error } = useScopes();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Loading text="Loading API scopes..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="API Scopes"
        description="Manage API access scopes and permissions"
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'API Scopes' }
        ]}
        actions={
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Scope
          </button>
        }
      />

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {scopes.map((scope) => (
            <div
              key={scope.scopeId}
              onClick={() => navigate(`/scopes/${scope.scopeId}`)}
              className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{scope.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{scope.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{scope.scopeKey}</code>
                  <span className="text-gray-500">Category: {scope.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
