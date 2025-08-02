import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MoreVertical, Edit, Trash2, 
  Play, Archive, Eye, Plus, MapPin, Calendar,
  CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Journey, JourneyStatus, JourneyVisibility } from '../../types/journeys';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface JourneyListProps {
  journeys: Journey[];
  loading: boolean;
  error: Error | null;
  onCreateNew: () => void;
  onEdit: (journey: Journey) => void;
  onDelete: (journeyId: string) => void;
  onPublish: (journeyId: string) => void;
  onArchive: (journeyId: string) => void;
}

export const JourneyList: React.FC<JourneyListProps> = ({
  journeys,
  loading,
  error,
  onCreateNew,
  onEdit,
  onDelete,
  onPublish,
  onArchive
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<JourneyStatus | ''>('');
  const [visibilityFilter, setVisibilityFilter] = useState<JourneyVisibility | ''>('');

  const filteredJourneys = journeys.filter(journey => {
    const matchesSearch = journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journey.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || journey.status === statusFilter;
    const matchesVisibility = !visibilityFilter || journey.visibility === visibilityFilter;
    
    return matchesSearch && matchesStatus && matchesVisibility;
  });

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
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loading text="Loading journeys..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading journeys</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (journeys.length === 0) {
    return (
      <EmptyState
        title="No journeys found"
        description="Create your first journey to start building interactive USSD experiences."
        icon={<MapPin className="w-8 h-8 text-gray-400" />}
        actionLabel="Create Journey"
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
                placeholder="Search journeys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as JourneyStatus | '')}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value={JourneyStatus.PUBLISHED}>Published</option>
                <option value={JourneyStatus.DRAFT}>Draft</option>
                <option value={JourneyStatus.ARCHIVED}>Archived</option>
              </select>
              
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value as JourneyVisibility | '')}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Visibility</option>
                <option value={JourneyVisibility.PUBLIC}>Public</option>
                <option value={JourneyVisibility.PRIVATE}>Private</option>
                <option value={JourneyVisibility.UNLISTED}>Unlisted</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Journeys grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredJourneys.map((journey) => (
          <div key={journey.journeyId} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(journey.status)}
                  {getVisibilityBadge(journey.visibility)}
                </div>
                
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{journey.name}</h3>
                {journey.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{journey.description}</p>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{journey.category.name}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Created {formatDate(journey.createdAt)}</span>
                </div>
                
                {journey.publishedAt && (
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Published {formatDate(journey.publishedAt)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  v{journey.currentVersion.schemaVersion}
                </span>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/journeys/${journey.journeyId}`}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  
                  <button
                    onClick={() => onEdit(journey)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Edit journey"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  {journey.status === JourneyStatus.DRAFT && (
                    <button
                      onClick={() => onPublish(journey.journeyId)}
                      className="inline-flex items-center p-2 border border-green-300 rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      title="Publish journey"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  
                  {journey.status === JourneyStatus.PUBLISHED && (
                    <button
                      onClick={() => onArchive(journey.journeyId)}
                      className="inline-flex items-center p-2 border border-yellow-300 rounded-md text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      title="Archive journey"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDelete(journey.journeyId)}
                    className="inline-flex items-center p-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Delete journey"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJourneys.length === 0 && journeys.length > 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No journeys match your filters</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};