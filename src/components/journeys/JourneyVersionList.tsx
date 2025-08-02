import React from 'react';
import { 
  GitBranch, Calendar, Play, Trash2, Download, 
  CheckCircle, Clock, Code
} from 'lucide-react';
import { useJourneyVersions } from '../../hooks/useJourneyVersions';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface JourneyVersionListProps {
  journeyId: string;
}

export const JourneyVersionList: React.FC<JourneyVersionListProps> = ({
  journeyId
}) => {
  const { versions, loading, error, publishVersion, deleteVersion } = useJourneyVersions(journeyId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePublish = async (versionId: string) => {
    try {
      await publishVersion(versionId);
    } catch (error) {
      console.error('Failed to publish version:', error);
    }
  };

  const handleDelete = async (versionId: string) => {
    if (window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
      try {
        await deleteVersion(versionId);
      } catch (error) {
        console.error('Failed to delete version:', error);
      }
    }
  };

  if (loading) {
    return <Loading text="Loading journey versions..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading versions</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <EmptyState
        title="No versions found"
        description="Create your first version to start tracking changes to this journey."
        icon={<GitBranch className="w-8 h-8 text-gray-400" />}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {versions.map((version) => (
              <tr key={version.versionId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        v{version.schemaVersion}
                      </div>
                      <div className="text-xs text-gray-500">
                        {version.journeyMode}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {version.publishedAt ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(version.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {version.publishedAt ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(version.publishedAt)}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Not published</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      className="text-gray-400 hover:text-gray-500 p-1"
                      title="View YAML"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                    
                    <button
                      className="text-gray-400 hover:text-gray-500 p-1"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    {!version.publishedAt && (
                      <button
                        onClick={() => handlePublish(version.versionId)}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Publish version"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(version.versionId)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete version"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};