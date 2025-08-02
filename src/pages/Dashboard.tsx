import React, { useMemo } from 'react';
import { Radio, Activity, Globe, PieChart } from 'lucide-react';
import { useGateways } from '../hooks/useGateways';
import { CountryCode } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { StatusOverview } from '../components/dashboard/StatusOverview';
import { Loading } from '../components/ui/Loading';

interface DashboardProps {
  selectedCountry: CountryCode;
}

export const Dashboard: React.FC<DashboardProps> = ({ selectedCountry }) => {
  const { gateways, loading, error } = useGateways(selectedCountry);

  // Calculate gateway statistics
  const gatewayStats = useMemo(() => {
    if (loading || error) {
      return {
        active: 0,
        inactive: 0,
        maintenance: 0,
        total: 0
      };
    }

    return gateways.reduce(
      (stats, gateway) => {
        switch (gateway.status) {
          case 'ACTIVE':
            stats.active += 1;
            break;
          case 'INACTIVE':
            stats.inactive += 1;
            break;
          case 'MAINTENANCE':
            stats.maintenance += 1;
            break;
        }
        stats.total += 1;
        return stats;
      },
      { active: 0, inactive: 0, maintenance: 0, total: 0 }
    );
  }, [gateways, loading, error]);

  // Calculate carrier statistics
  const carrierStats = useMemo(() => {
    if (loading || error) return 0;
    
    const uniqueCarrierIds = new Set(gateways.map(gateway => gateway.carrier.carrierId));
    return uniqueCarrierIds.size;
  }, [gateways, loading, error]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <p className="font-medium">Error loading dashboard data</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your journey gateways and system health" 
      />
      
      {loading ? (
        <Loading text="Loading dashboard data..." />
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Gateways" 
              value={gatewayStats.total} 
              icon={<Radio className="h-6 w-6 text-blue-600" />}
            />
            
            <StatsCard 
              title="Active Gateways" 
              value={gatewayStats.active} 
              icon={<Activity className="h-6 w-6 text-green-600" />}
              changeDirection="up"
              change={10}
              changeText="active gateways"
            />
            
            <StatsCard 
              title="Carriers" 
              value={carrierStats} 
              icon={<Globe className="h-6 w-6 text-indigo-600" />}
            />
            
            <StatsCard 
              title="Success Rate" 
              value="99.8%" 
              icon={<PieChart className="h-6 w-6 text-teal-600" />}
              changeDirection="up"
              change={1.2}
              changeText="from previous week"
            />
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <StatusOverview stats={gatewayStats} loading={loading} />
            
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-500 text-sm">
                  No recent activity to display.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};