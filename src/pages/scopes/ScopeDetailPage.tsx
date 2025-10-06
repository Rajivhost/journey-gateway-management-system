import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Loading } from '../../components/ui/Loading';
import { useScopes } from '../../hooks/useScopes';

export const ScopeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scopes, loading } = useScopes();

  const scope = scopes.find(s => s.scopeId === id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Loading text="Loading scope details..." />
      </div>
    );
  }

  if (!scope) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p className="font-medium">Scope not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={scope.name}
        description="View API scope details"
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'API Scopes', path: '/scopes' },
          { label: scope.name }
        ]}
        actions={
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/scopes')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            {!scope.isSystem && (
              <button
                onClick={() => navigate(`/scopes/${id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
          </div>
        }
      />

      <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Scope Key</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{scope.scopeKey}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{scope.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 col-span-2">{scope.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Access Levels</dt>
              <dd className="mt-1">
                <div className="flex flex-wrap gap-2">
                  {scope.accessLevels.map(level => (
                    <span key={level} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {level}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">API Endpoints</dt>
              <dd className="mt-1 text-sm text-gray-900">{scope.apiEndpoints.length} endpoints</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
