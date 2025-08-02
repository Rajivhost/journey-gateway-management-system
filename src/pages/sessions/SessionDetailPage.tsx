import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SessionDetail } from '../../components/sessions/SessionDetail';
import { useSession } from '../../hooks/useSessions';

export const SessionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, loading, error } = useSession(id || '');

  const handleTerminateSession = async (sessionId: string) => {
    // In a real implementation, this would call an API to terminate the session
    console.log('Terminating session:', sessionId);
    // Optionally navigate back to the sessions list
    // navigate('/sessions');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={session ? `Session ${session.sessionId.slice(0, 8)}...` : 'Session Details'}
        description={session ? `${session.sessionType} session • ${session.journey.name}` : 'Loading session information...'}
        breadcrumbs={[
          { label: 'Sessions', path: '/sessions' },
          { label: session ? `Session ${session.sessionId.slice(0, 8)}...` : 'Session Details' }
        ]}
        actions={
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </button>
        }
      />

      <div className="mt-6">
        <SessionDetail
          session={session}
          loading={loading}
          error={error}
          onTerminateSession={handleTerminateSession}
        />
      </div>
    </div>
  );
};