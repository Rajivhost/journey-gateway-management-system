import React, { useState } from 'react';
import { Globe, Clock, Bell } from 'lucide-react';
import { SettingsCard } from '../../components/settings/SettingsCard';
import { SettingsToggle } from '../../components/settings/SettingsToggle';
import { CountrySelector } from '../../components/ui/CountrySelector';
import { CountryCode } from '../../types';

export const GeneralSettings: React.FC = () => {
  const [country, setCountry] = useState<CountryCode>(CountryCode.CM);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [activityLogging, setActivityLogging] = useState(true);

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Platform Information"
        description="Basic platform settings and information"
        icon={Globe}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="platformName" className="block text-sm font-medium text-gray-700">
              Platform Name
            </label>
            <input
              type="text"
              id="platformName"
              defaultValue="USSDLink"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
              Support Email
            </label>
            <input
              type="email"
              id="supportEmail"
              defaultValue="support@ussdlink.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <CountrySelector
              value={country}
              onChange={setCountry}
              label="Default Country"
            />
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Time Zone
            </label>
            <select
              id="timezone"
              defaultValue="Africa/Douala"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Africa/Douala">Africa/Douala (UTC+01:00)</option>
              <option value="Africa/Lagos">Africa/Lagos (UTC+01:00)</option>
              <option value="Africa/Dakar">Africa/Dakar (UTC+00:00)</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="System Preferences"
        description="Configure system-wide preferences"
        icon={Clock}
      >
        <div className="space-y-4 divide-y divide-gray-200">
          <SettingsToggle
            label="Maintenance Mode"
            description="Put the platform in maintenance mode"
            enabled={maintenanceMode}
            onChange={setMaintenanceMode}
          />

          <SettingsToggle
            label="New Registrations"
            description="Allow new service provider registrations"
            enabled={newRegistrations}
            onChange={setNewRegistrations}
          />

          <SettingsToggle
            label="Activity Logging"
            description="Enable detailed activity logging"
            enabled={activityLogging}
            onChange={setActivityLogging}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Notifications"
        description="Configure notification preferences"
        icon={Bell}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="notificationEmail" className="block text-sm font-medium text-gray-700">
              Notification Email
            </label>
            <input
              type="email"
              id="notificationEmail"
              defaultValue="notifications@ussdlink.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="space-y-4 divide-y divide-gray-200">
            <SettingsToggle
              label="Email Notifications"
              description="Send email notifications for important events"
              enabled={true}
              onChange={() => {}}
            />

            <SettingsToggle
              label="SMS Notifications"
              description="Send SMS notifications for critical alerts"
              enabled={false}
              onChange={() => {}}
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};