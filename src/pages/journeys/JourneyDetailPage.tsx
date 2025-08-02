import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { JourneyDetail } from '../../components/journeys/JourneyDetail';
import { useJourney, useJourneys } from '../../hooks/useJourneys';

export const JourneyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { journey, loading, error } = useJourney(id || '');
  const { publishJourney, archiveJourney, deleteJourney } = useJourneys();

  const handleEdit = () => {
    navigate(`/journeys/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this journey? This action cannot be undone.')) {
      try {
        await deleteJourney(id || '');
        navigate('/journeys');
      } catch (error) {
        console.error('Failed to delete journey:', error);
      }
    }
  };

  const handlePublish = async () => {
    try {
      await publishJourney(id || '');
    } catch (error) {
      console.error('Failed to publish journey:', error);
    }
  };

  const handleArchive = async () => {
    if (window.confirm('Are you sure you want to archive this journey? It will no longer be accessible to users.')) {
      try {
        await archiveJourney(id || '');
      } catch (error) {
        console.error('Failed to archive journey:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={journey ? journey.name : 'Journey Details'}
        description={journey ? `${journey.journeyType} Journey • ${journey.category.name}` : 'Loading journey information...'}
        breadcrumbs={[
          { label: 'Journeys', path: '/journeys' },
          { label: journey ? journey.name : 'Journey Details' }
        ]}
        actions={
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/journeys')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journeys
            </button>
            
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading || error || !journey}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Journey
            </button>
          </div>
        }
      />

      <div className="mt-6">
        <JourneyDetail
          journey={journey}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onArchive={handleArchive}
        />
      </div>
    </div>
  );
};