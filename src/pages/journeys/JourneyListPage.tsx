import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { JourneyList } from '../../components/journeys/JourneyList';
import { CreateJourneyForm } from '../../components/journeys/CreateJourneyForm';
import { useJourneys } from '../../hooks/useJourneys';
import { Journey, CreateJourneyInput } from '../../types/journeys';
import { CountryCode } from '../../types';

interface JourneyListPageProps {
  selectedCountry: CountryCode;
}

export const JourneyListPage: React.FC<JourneyListPageProps> = ({ selectedCountry }) => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock provider ID - in a real app, this would come from auth context
  const providerId = 'provider_1';
  
  const { 
    journeys, 
    loading, 
    error, 
    createJourney, 
    updateJourney, 
    deleteJourney,
    publishJourney,
    archiveJourney
  } = useJourneys(providerId);

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = async (data: CreateJourneyInput & { providerId: string; country: CountryCode }) => {
    setIsSubmitting(true);
    try {
      const journey = await createJourney(data);
      setShowCreateForm(false);
      navigate(`/journeys/${journey.journeyId}`);
    } catch (error) {
      console.error('Failed to create journey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (journey: Journey) => {
    navigate(`/journeys/${journey.journeyId}/edit`);
  };

  const handleDelete = async (journeyId: string) => {
    if (window.confirm('Are you sure you want to delete this journey? This action cannot be undone.')) {
      try {
        await deleteJourney(journeyId);
      } catch (error) {
        console.error('Failed to delete journey:', error);
      }
    }
  };

  const handlePublish = async (journeyId: string) => {
    try {
      await publishJourney(journeyId);
    } catch (error) {
      console.error('Failed to publish journey:', error);
    }
  };

  const handleArchive = async (journeyId: string) => {
    if (window.confirm('Are you sure you want to archive this journey? It will no longer be accessible to users.')) {
      try {
        await archiveJourney(journeyId);
      } catch (error) {
        console.error('Failed to archive journey:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Journeys"
        description="Create and manage your USSD journeys and interactive experiences"
        breadcrumbs={[{ label: 'Journeys' }]}
        actions={
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Journey
          </button>
        }
      />

      <div className="mt-6">
        <JourneyList
          journeys={journeys}
          loading={loading}
          error={error}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onArchive={handleArchive}
        />
      </div>

      {showCreateForm && (
        <CreateJourneyForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSubmit}
          providerId={providerId}
          country={selectedCountry}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};