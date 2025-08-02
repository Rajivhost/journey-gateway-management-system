import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SessionList } from '../../components/sessions/SessionList';
import { SessionFiltersComponent } from '../../components/sessions/SessionFilters';
import { SessionAnalyticsComponent } from '../../components/sessions/SessionAnalytics';
import { useSessions, useSessionAnalytics } from '../../hooks/useSessions';
import { SessionFilters, CountryCode } from '../../types/sessions';

interface SessionListPageProps {
  selectedCountry: CountryCode;
}

export const SessionListPage: React.FC<SessionListPageProps> = ({ selectedCountry }) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'analytics'>('sessions');
  const [filters, setFilters] = useState<SessionFilters>({
    country: selectedCountry
  });

  // Update filters when country changes
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, country: selectedCountry }));
  }, [selectedCountry]);

  const { sessions, loading: sessionsLoading, error: sessionsError, terminateSession } = useSessions(filters);
  const { analytics, loading: analyticsLoading, error: analyticsError } = useSessionAnalytics(filters);

  const handleFilterChange = (newFilters: SessionFilters) => {
    setFilters(newFilters);
  };

  const handleTerminateSession = async (sessionId: string) => {
    await terminateSession(sessionId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="User Sessions"
        description="Monitor and manage active user sessions across all gateways and journeys"
        breadcrumbs={[{ label: 'Sessions' }]}
      />

      {/* Tabs */}
      <div className="mt-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {[
                { id: 'sessions', name: 'Sessions', icon: Activity },
                { id: 'analytics', name: 'Analytics', icon: Activity }
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
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <SessionFiltersComponent
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  isLoading={sessionsLoading}
                />
                
                <SessionList
                  sessions={sessions}
                  loading={sessionsLoading}
                  error={sessionsError}
                  onTerminateSession={handleTerminateSession}
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <SessionAnalyticsComponent
                analytics={analytics}
                loading={analyticsLoading}
                error={analyticsError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};