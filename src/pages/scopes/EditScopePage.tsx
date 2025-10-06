import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Loading } from '../../components/ui/Loading';
import { useScopes } from '../../hooks/useScopes';

export const EditScopePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scopes, loading } = useScopes();

  const scope = scopes.find(s => s.scopeId === id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Loading text="Loading scope..." />
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
        title="Edit API Scope"
        description={`Modify ${scope.name} configuration`}
        breadcrumbs={[
          { label: 'Settings', path: '/settings' },
          { label: 'API Scopes', path: '/scopes' },
          { label: scope.name, path: `/scopes/${id}` },
          { label: 'Edit' }
        ]}
        actions={
          <button
            onClick={() => navigate(`/scopes/${id}`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </button>
        }
      />

      <div className="mt-6 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Edit form will be implemented here.</p>
      </div>
    </div>
  );
};
