import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, MoreVertical, Phone, Clock, CheckCircle, 
  XCircle, AlertTriangle, Activity, Zap, StopCircle
} from 'lucide-react';
import { Session, SessionStatus, SessionType } from '../../types/sessions';
import { CountryFlag } from '../ui/CountryFlag';
import { Loading } from '../ui/Loading';
import { EmptyState } from '../ui/EmptyState';

interface SessionListProps {
  sessions: Session[];
  loading: boolean;
  error: Error | null;
  onTerminateSession: (sessionId: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  loading,
  error,
  onTerminateSession
}) => {
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);

  if (loading) {
    return <Loading text="Loading sessions..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading sessions</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No sessions found"
        description="No user sessions match your current filters."
        icon={<Activity className="w-8 h-8 text-gray-400" />}
      />
    );
  }

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case SessionStatus.COMPLETED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case SessionStatus.ABANDONED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <XCircle className="w-3 h-3 mr-1" />
            Abandoned
          </span>
        );
      case SessionStatus.TIMEOUT:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Clock className="w-3 h-3 mr-1" />
            Timeout
          </span>
        );
      case SessionStatus.ERROR:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </span>
        );
    }
  };

  const getSessionTypeIcon = (type: SessionType) => {
    switch (type) {
      case SessionType.USSD:
        return <Phone className="w-4 h-4 text-blue-600" />;
      case SessionType.SMS:
        return <Zap className="w-4 h-4 text-green-600" />;
      case SessionType.API:
        return <Activity className="w-4 h-4 text-purple-600" />;
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to terminate this session?')) {
      setTerminatingSession(sessionId);
      try {
        await onTerminateSession(sessionId);
      } finally {
        setTerminatingSession(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Journey
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gateway
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Started
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.sessionId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getSessionTypeIcon(session.sessionType)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        <Link 
                          to={`/sessions/${session.sessionId}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {session.sessionId.slice(0, 8)}...
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.sessionType}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.phoneNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        <CountryFlag countryCode={session.country} withName />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{session.journey.name}</div>
                  <div className="text-xs text-gray-500">
                    v{session.journey.version} • {session.provider.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{session.gateway.name}</div>
                  <div className="text-xs text-gray-500">
                    {session.gateway.carrier.name} • {session.gateway.shortCode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(session.status)}
                  {session.status === SessionStatus.ACTIVE && session.currentStep && (
                    <div className="text-xs text-gray-500 mt-1">
                      Step {session.steps.length}/{session.totalSteps}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(session.duration)}
                  {session.status === SessionStatus.ACTIVE && (
                    <div className="text-xs text-gray-500">
                      {session.steps.length} steps
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(session.startTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/sessions/${session.sessionId}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    
                    {session.status === SessionStatus.ACTIVE && (
                      <button
                        onClick={() => handleTerminateSession(session.sessionId)}
                        disabled={terminatingSession === session.sessionId}
                        className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                        title="Terminate session"
                      >
                        {terminatingSession === session.sessionId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <StopCircle className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    
                    <button className="text-gray-400 hover:text-gray-500 p-1">
                      <MoreVertical className="h-4 w-4" />
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