import React from 'react';
import { 
  Phone, Clock, CheckCircle, XCircle, AlertTriangle, 
  Activity, MapPin, Router, User, Calendar, ArrowRight,
  Play, Pause, StopCircle
} from 'lucide-react';
import { Session, SessionStatus, SessionType } from '../../types/sessions';
import { CountryFlag } from '../ui/CountryFlag';
import { Loading } from '../ui/Loading';

interface SessionDetailProps {
  session: Session | null;
  loading: boolean;
  error: Error | null;
  onTerminateSession?: (sessionId: string) => void;
}

export const SessionDetail: React.FC<SessionDetailProps> = ({
  session,
  loading,
  error,
  onTerminateSession
}) => {
  if (loading) {
    return <Loading text="Loading session details..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading session</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
        <p className="font-medium">Session not found</p>
        <p className="mt-1 text-sm">The session you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Activity className="w-4 h-4 mr-2" />
            Active
          </span>
        );
      case SessionStatus.COMPLETED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </span>
        );
      case SessionStatus.ABANDONED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <XCircle className="w-4 h-4 mr-2" />
            Abandoned
          </span>
        );
      case SessionStatus.TIMEOUT:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            <Clock className="w-4 h-4 mr-2" />
            Timeout
          </span>
        );
      case SessionStatus.ERROR:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Error
          </span>
        );
    }
  };

  const getSessionTypeIcon = (type: SessionType) => {
    switch (type) {
      case SessionType.USSD:
        return <Phone className="w-6 h-6 text-blue-600" />;
      case SessionType.SMS:
        return <Activity className="w-6 h-6 text-green-600" />;
      case SessionType.API:
        return <Router className="w-6 h-6 text-purple-600" />;
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'menu':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'input':
        return <User className="w-4 h-4 text-green-500" />;
      case 'display':
        return <Play className="w-4 h-4 text-purple-500" />;
      case 'confirmation':
        return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'end':
        return <StopCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-6">
          <div className="flex items-center">
            {getSessionTypeIcon(session.sessionType)}
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Session Details</h3>
              <p className="text-sm text-gray-500">ID: {session.sessionId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(session.status)}
            {session.status === SessionStatus.ACTIVE && onTerminateSession && (
              <button
                onClick={() => onTerminateSession(session.sessionId)}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <StopCircle className="h-4 w-4 mr-1" />
                Terminate
              </button>
            )}
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
              <p className="mt-1 text-sm text-gray-900 font-mono">{session.phoneNumber}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Country</h4>
              <div className="mt-1">
                <CountryFlag countryCode={session.country} withName />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Session Type</h4>
              <p className="mt-1 text-sm text-gray-900">{session.sessionType}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Duration</h4>
              <p className="mt-1 text-sm text-gray-900">{formatDuration(session.duration)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Steps Completed</h4>
              <p className="mt-1 text-sm text-gray-900">
                {session.steps.length} of {session.totalSteps}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">IP Address</h4>
              <p className="mt-1 text-sm text-gray-900 font-mono">{session.ipAddress || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-xs text-gray-500 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>Started: {formatTime(session.startTime)}</span>
            </div>
            {session.endTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                <span>Ended: {formatTime(session.endTime)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Journey & Gateway Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Journey Information</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Journey Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.journey.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Version</dt>
                <dd className="mt-1 text-sm text-gray-900">v{session.journey.version}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Service Provider</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.provider.name}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Router className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Gateway Information</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Gateway Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.gateway.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Carrier</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session.gateway.carrier.name} ({session.gateway.carrier.code})
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Short Code</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{session.gateway.shortCode}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Session Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Session Flow</h3>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {session.steps.map((step, stepIdx) => (
                <li key={step.stepId}>
                  <div className="relative pb-8">
                    {stepIdx !== session.steps.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                          {getStepIcon(step.stepType)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {step.stepName}
                            <span className="ml-2 text-xs text-gray-500 capitalize">
                              ({step.stepType})
                            </span>
                          </p>
                          {step.userInput && (
                            <p className="mt-1 text-sm text-gray-600">
                              <span className="font-medium">User input:</span> {step.userInput}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-gray-600">
                            <span className="font-medium">Response:</span> {step.responseText}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Duration: {formatDuration(step.duration)}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={step.timestamp}>
                            {new Date(step.timestamp).toLocaleTimeString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {session.status === SessionStatus.ACTIVE && session.currentStep && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm font-medium text-blue-800">
                  Session is currently active at step {session.steps.length} of {session.totalSteps}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Information */}
      {session.status === SessionStatus.ERROR && session.errorMessage && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Error Information</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{session.errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};