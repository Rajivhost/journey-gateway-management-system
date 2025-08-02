import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { USSDSimulator } from '../../components/simulator/USSDSimulator';

export const SimulatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title="USSD Journey Simulator"
          description="Test your USSD journeys in a realistic mobile phone interface"
          breadcrumbs={[{ label: 'Simulator' }]}
        />
      </div>
      
      <USSDSimulator />
    </div>
  );
};