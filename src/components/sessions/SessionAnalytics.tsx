import React from 'react';
import { 
  Activity, Clock, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, Users, BarChart3, PieChart
} from 'lucide-react';
import { SessionAnalytics } from '../../types/sessions';
import { Loading } from '../ui/Loading';

interface SessionAnalyticsProps {
  analytics: SessionAnalytics | null;
  loading: boolean;
  error: Error | null;
}

export const SessionAnalyticsComponent: React.FC<SessionAnalyticsProps> = ({
  analytics,
  loading,
  error
}) => {
  if (loading) {
    return <Loading text="Loading session analytics..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p className="font-medium">Error loading analytics</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
        <p className="font-medium">No analytics data available</p>
        <p className="mt-1 text-sm">Analytics data will appear here once sessions are recorded.</p>
      </div>
    );
  }

  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalSessions.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.activeSessions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.completionRate.toFixed(1)}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Duration</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatDuration(analytics.averageDuration)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Session Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <PieChart className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Session Status Breakdown</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{analytics.completedSessions}</div>
                  <div className="text-xs text-gray-500">{analytics.completionRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Abandoned</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{analytics.abandonedSessions}</div>
                  <div className="text-xs text-gray-500">{analytics.abandonmentRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Errors</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{analytics.errorSessions}</div>
                  <div className="text-xs text-gray-500">{analytics.errorRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{analytics.activeSessions}</div>
                  <div className="text-xs text-gray-500">Current</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Peak Hours</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-3">
              {analytics.peakHours.map((hour) => {
                const maxCount = Math.max(...analytics.peakHours.map(h => h.count));
                const percentage = (hour.count / maxCount) * 100;
                
                return (
                  <div key={hour.hour} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">
                      {hour.hour.toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm text-gray-900 text-right">
                      {hour.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Items */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Journeys */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Top Journeys</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {analytics.topJourneys.map((journey, index) => (
                <div key={journey.journeyId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{journey.journeyName}</div>
                      <div className="text-xs text-gray-500">{journey.sessionCount} sessions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{journey.completionRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">completion</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Gateways */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Top Gateways</h3>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {analytics.topGateways.map((gateway, index) => (
                <div key={gateway.gatewayId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-medium mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{gateway.gatewayName}</div>
                      <div className="text-xs text-gray-500">{gateway.sessionCount} sessions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{gateway.completionRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">completion</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};