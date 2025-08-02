import React, { useState } from 'react';
import { 
  MapPin, Calendar, Eye, Edit, Trash2, Play, Archive, 
  Code, GitBranch, Clock, CheckCircle, XCircle, Plus,
  Download, Upload, Settings
} from 'lucide-react';
import { Journey, JourneyStatus, JourneyVisibility, JourneyVersion } from '../../types/journeys';
import { Loading } from '../ui/Loading';
import { JourneyVersionList } from './JourneyVersionList';
import { CreateJourneyVersionForm } from './CreateJourneyVersionForm';

interface JourneyDetailProps {
  journey: Journey | null;
  loading: boolean;
  error: Error | null;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onArchive: () => void;
}

export const JourneyDetail: React.FC<JourneyDetailProps> = ({
  journey,
  loading,
  error,
  onEdit,
  onDelete,
  onPublish,
  onArchive
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'yaml'>('overview');
  const [showCreateVersionForm, setShowCreateVersionForm] = useState(false);

  if (loading) {
    return <Loading text="Loading journey details..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading journey</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
        <p className="font-medium">Journey not found</p>
        <p className="mt-1 text-sm">The journey you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const getStatusBadge = (status: JourneyStatus) => {
    switch (status) {
      case JourneyStatus.PUBLISHED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </span>
        );
      case JourneyStatus.DRAFT:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </span>
        );
      case JourneyStatus.ARCHIVED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Archived
          </span>
        );
    }
  };

  const getVisibilityBadge = (visibility: JourneyVisibility) => {
    const config = {
      [JourneyVisibility.PUBLIC]: { color: 'bg-blue-100 text-blue-800', label: 'Public' },
      [JourneyVisibility.PRIVATE]: { color: 'bg-gray-100 text-gray-800', label: 'Private' },
      [JourneyVisibility.UNLISTED]: { color: 'bg-purple-100 text-purple-800', label: 'Unlisted' }
    };

    const { color, label } = config[visibility];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
        {label}
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

  const handleCreateVersion = () => {
    setShowCreateVersionForm(true);
  };

  const handleCreateVersionSubmit = async (data: any) => {
    console.log('Creating version:', data);
    setShowCreateVersionForm(false);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Journey Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Journey Information</h3>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(journey.status)}
            {getVisibilityBadge(journey.visibility)}
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Journey Name</h4>
              <p className="mt-1 text-sm text-gray-900">{journey.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Category</h4>
              <p className="mt-1 text-sm text-gray-900">{journey.category.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Journey Type</h4>
              <p className="mt-1 text-sm text-gray-900">{journey.journeyType}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Current Version</h4>
              <p className="mt-1 text-sm text-gray-900">v{journey.currentVersion.schemaVersion}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Provider</h4>
              <p className="mt-1 text-sm text-gray-900">{journey.provider.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Country</h4>
              <p className="mt-1 text-sm text-gray-900">{journey.category.country}</p>
            </div>
            
            {journey.description && (
              <div className="sm:col-span-2 lg:col-span-3">
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-sm text-gray-900">{journey.description}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-xs text-gray-500 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>Created: {formatDate(journey.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>Last Updated: {formatDate(journey.updatedAt)}</span>
            </div>
            {journey.publishedAt && (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-gray-400" />
                <span>Published: {formatDate(journey.publishedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={onEdit}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Journey
          </button>
          
          {journey.status === JourneyStatus.DRAFT && (
            <button
              onClick={onPublish}
              className="flex items-center justify-center px-4 py-3 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Play className="h-4 w-4 mr-2" />
              Publish
            </button>
          )}
          
          {journey.status === JourneyStatus.PUBLISHED && (
            <button
              onClick={onArchive}
              className="flex items-center justify-center px-4 py-3 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </button>
          )}
          
          <button
            onClick={handleCreateVersion}
            className="flex items-center justify-center px-4 py-3 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Version
          </button>
        </div>
      </div>
    </div>
  );

  const renderVersionsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Journey Versions</h3>
        <button
          onClick={handleCreateVersion}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Version
        </button>
      </div>
      
      <JourneyVersionList journeyId={journey.journeyId} />
    </div>
  );

  const renderYamlTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Current YAML Configuration</h3>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            Version {journey.currentVersion.schemaVersion} - {journey.currentVersion.journeyMode}
          </span>
        </div>
        <div className="p-4">
          <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-md overflow-x-auto">
            {journey.currentVersion.yamlContent}
          </pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{journey.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {journey.journeyType} Journey • {journey.category.name}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={onDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: Eye },
              { id: 'versions', name: 'Versions', icon: GitBranch },
              { id: 'yaml', name: 'YAML', icon: Code }
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
          {activeTab === 'versions' && renderVersionsTab()}
          {activeTab === 'yaml' && renderYamlTab()}
        </div>
      </div>

      {/* Create Version Form Modal */}
      {showCreateVersionForm && (
        <CreateJourneyVersionForm
          journeyId={journey.journeyId}
          country={journey.category.country}
          onClose={() => setShowCreateVersionForm(false)}
          onSubmit={handleCreateVersionSubmit}
        />
      )}
    </div>
  );
};