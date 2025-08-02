import React, { useState } from 'react';
import { CreditCard, Package, Edit2, Trash2, Plus } from 'lucide-react';
import { SettingsCard } from '../../components/settings/SettingsCard';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

export const PricingSettings: React.FC = () => {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    {
      id: 'basic',
      name: 'Basic',
      description: 'For small businesses getting started',
      price: 29,
      interval: 'month',
      features: [
        'Up to 1,000 transactions/month',
        '24/7 support',
        'Basic analytics',
        'Single gateway'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'For growing businesses',
      price: 99,
      interval: 'month',
      features: [
        'Up to 10,000 transactions/month',
        'Priority support',
        'Advanced analytics',
        'Multiple gateways',
        'Custom branding'
      ],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 299,
      interval: 'month',
      features: [
        'Unlimited transactions',
        'Dedicated support',
        'Enterprise analytics',
        'Unlimited gateways',
        'Custom integration',
        'SLA guarantee'
      ]
    }
  ]);

  const [editingTier, setEditingTier] = useState<string | null>(null);

  const handleEditTier = (tierId: string) => {
    setEditingTier(tierId);
  };

  const handleDeleteTier = (tierId: string) => {
    setPricingTiers(tiers => tiers.filter(tier => tier.id !== tierId));
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Pricing Configuration"
        description="Manage your subscription plans and pricing tiers"
        icon={CreditCard}
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Tier
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-lg border ${
                  tier.isPopular ? 'border-blue-500' : 'border-gray-200'
                } bg-white p-6 shadow-sm`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{tier.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTier(tier.id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTier(tier.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight text-gray-900">
                      ${tier.price}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">/{tier.interval}</span>
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Package className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};