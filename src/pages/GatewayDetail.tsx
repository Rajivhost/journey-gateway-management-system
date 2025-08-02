import React from 'react';
import { useParams } from 'react-router-dom';
import { Edit, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGateway } from '../hooks/useGateways';
import { CountryCode } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { GatewayDetail as GatewayDetailComponent } from '../components/gateways/GatewayDetail';

interface GatewayDetailPageProps {
  selectedCountry: CountryCode;
}

export const GatewayDetailPage: React.FC<GatewayDetailPageProps> = ({ selectedCountry }) => {
  const { id } = useParams<{ id: string }>();
  const { gateway, loading, error } = useGateway(selectedCountry, id || '');

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title={gateway ? gateway.name : 'Gateway Details'} 
        description={gateway ? `${gateway.carrier.name} - ${gateway.shortCode}` : 'Loading gateway information...'}
        breadcrumbs={[
          { label: 'Gateways', path: '/gateways' },
          { label: gateway ? gateway.name : 'Gateway Details' }
        ]}
        actions={
          <div className="flex space-x-3">
            <Link
              to="/gateways"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gateways
            </Link>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading || error || !gateway}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Gateway
            </button>
          </div>
        }
      />
      
      <div className="mt-6">
        <GatewayDetailComponent 
          gateway={gateway}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};