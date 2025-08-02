import React from 'react';
import { Radio, AlertTriangle } from 'lucide-react';
import { JourneyGatewayStatus } from '../../types';

interface GatewayStats {
  active: number;
  inactive: number;
  maintenance: number;
  total: number;
}

interface StatusOverviewProps {
  stats: GatewayStats;
  loading?: boolean;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({
  stats,
  loading = false
}) => {
  const calculatePercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

  const getStatusStyles = (status: JourneyGatewayStatus) => {
    switch (status) {
      case JourneyGatewayStatus.ACTIVE:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          barColor: 'bg-green-500',
        };
      case JourneyGatewayStatus.INACTIVE:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          barColor: 'bg-gray-500',
        };
      case JourneyGatewayStatus.MAINTENANCE:
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200',
          barColor: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          barColor: 'bg-gray-500',
        };
    }
  };

  const statusItems = [
    {
      status: JourneyGatewayStatus.ACTIVE,
      count: stats.active,
      percentage: calculatePercentage(stats.active),
      label: 'Active',
    },
    {
      status: JourneyGatewayStatus.INACTIVE,
      count: stats.inactive,
      percentage: calculatePercentage(stats.inactive),
      label: 'Inactive',
    },
    {
      status: JourneyGatewayStatus.MAINTENANCE,
      count: stats.maintenance,
      percentage: calculatePercentage(stats.maintenance),
      label: 'Maintenance',
    },
  ];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <Radio className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Gateway Status Overview</h3>
        </div>
      </div>
      
      <div className="px-5 py-5">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : stats.total === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">No gateways found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {statusItems.map((item) => {
              const styles = getStatusStyles(item.status);
              
              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${styles.barColor} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.count} ({item.percentage}%)
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${styles.barColor} h-2.5 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Gateways</span>
                <span className="text-lg font-semibold text-gray-900">{stats.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};