import React, { useState } from 'react';
import { Shield, Lock, Key } from 'lucide-react';
import { SettingsCard } from '../../components/settings/SettingsCard';
import { SettingsToggle } from '../../components/settings/SettingsToggle';

export const SecuritySettings: React.FC = () => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [passwordComplexity, setPasswordComplexity] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [ipRestriction, setIpRestriction] = useState(false);
  const [failedLoginLockout, setFailedLoginLockout] = useState(true);

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Authentication"
        description="Configure authentication settings"
        icon={Shield}
      >
        <div className="space-y-4 divide-y divide-gray-200">
          <SettingsToggle
            label="Two-Factor Authentication"
            description="Require 2FA for admin accounts"
            enabled={twoFactorAuth}
            onChange={setTwoFactorAuth}
          />

          <SettingsToggle
            label="Password Complexity"
            description="Enforce strong password requirements"
            enabled={passwordComplexity}
            onChange={setPasswordComplexity}
          />

          <SettingsToggle
            label="Session Timeout"
            description="Automatically log out inactive users"
            enabled={sessionTimeout}
            onChange={setSessionTimeout}
          />

          <div className="pt-4">
            <label htmlFor="sessionLength" className="block text-sm font-medium text-gray-700">
              Session Length (minutes)
            </label>
            <input
              type="number"
              id="sessionLength"
              defaultValue={30}
              min={1}
              max={1440}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Access Control"
        description="Configure access control settings"
        icon={Lock}
      >
        <div className="space-y-4 divide-y divide-gray-200">
          <SettingsToggle
            label="IP Restriction"
            description="Restrict admin access to specific IP ranges"
            enabled={ipRestriction}
            onChange={setIpRestriction}
          />

          <SettingsToggle
            label="Failed Login Lockout"
            description="Lock accounts after multiple failed login attempts"
            enabled={failedLoginLockout}
            onChange={setFailedLoginLockout}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="API Security"
        description="Configure API security settings"
        icon={Key}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="apiKey"
                defaultValue="sk_test_123456789"
                readOnly
                className="flex-1 rounded-none rounded-l-md border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="webhookSecret" className="block text-sm font-medium text-gray-700">
              Webhook Secret
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="webhookSecret"
                defaultValue="whsec_123456789"
                readOnly
                className="flex-1 rounded-none rounded-l-md border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};