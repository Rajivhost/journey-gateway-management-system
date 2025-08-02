import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsLayout } from '../../components/settings/SettingsLayout';
import { GeneralSettings } from './GeneralSettings';
import { FeaturesSettings } from './FeaturesSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { SecuritySettings } from './SecuritySettings';
import { PricingSettings } from './PricingSettings';
import { SubscriptionSettings } from './SubscriptionSettings';

export const SettingsPage: React.FC = () => {
  return (
    <SettingsLayout>
      <Routes>
        <Route path="general" element={<GeneralSettings />} />
        <Route path="features" element={<FeaturesSettings />} />
        <Route path="appearance" element={<AppearanceSettings />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="pricing" element={<PricingSettings />} />
        <Route path="subscription" element={<SubscriptionSettings />} />
        <Route path="*" element={<Navigate to="general" replace />} />
      </Routes>
    </SettingsLayout>
  );
};