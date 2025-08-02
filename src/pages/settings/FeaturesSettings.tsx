import React, { useState } from 'react';
import { Settings, Upload, Shield, Globe } from 'lucide-react';
import { SettingsCard } from '../../components/settings/SettingsCard';
import { SettingsToggle } from '../../components/settings/SettingsToggle';

export const FeaturesSettings: React.FC = () => {
  const [batchUpload, setBatchUpload] = useState(true);
  const [roleBasedPermissions, setRoleBasedPermissions] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);
  const [automatedNotifications, setAutomatedNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Feature Management"
        description="Enable or disable platform features"
        icon={Settings}
      >
        <div className="space-y-4 divide-y divide-gray-200">
          <SettingsToggle
            label="Batch Upload for Exam Results"
            description="Allow uploading multiple exam results at once using CSV or Excel files"
            enabled={batchUpload}
            onChange={setBatchUpload}
            category="exams"
          />

          <SettingsToggle
            label="Role-based Permissions"
            description="Configure granular permissions for different user roles"
            enabled={roleBasedPermissions}
            onChange={setRoleBasedPermissions}
            category="admin"
          />

          <SettingsToggle
            label="API Access"
            description="Enable API access for integration with external systems"
            enabled={apiAccess}
            onChange={setApiAccess}
            category="integration"
          />

          <SettingsToggle
            label="Automated Notifications"
            description="Send automated notifications for new results and other events"
            enabled={automatedNotifications}
            onChange={setAutomatedNotifications}
            category="notifications"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Integration Settings"
        description="Configure external integrations"
        icon={Globe}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
              Webhook URL
            </label>
            <input
              type="url"
              id="webhookUrl"
              placeholder="https://your-domain.com/webhook"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-700">
              API Endpoint
            </label>
            <input
              type="url"
              id="apiEndpoint"
              placeholder="https://api.your-domain.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Import/Export"
        description="Manage data import and export settings"
        icon={Upload}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
            <p className="mt-1 text-sm text-gray-500">Download your platform data</p>
            <div className="mt-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Export as CSV
              </button>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-medium text-gray-900">Import Data</h4>
            <p className="mt-1 text-sm text-gray-500">Upload data from CSV file</p>
            <div className="mt-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Access Control"
        description="Configure feature access control"
        icon={Shield}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700">
              Maximum Users
            </label>
            <input
              type="number"
              id="maxUsers"
              defaultValue={100}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="maxStorage" className="block text-sm font-medium text-gray-700">
              Storage Limit (GB)
            </label>
            <input
              type="number"
              id="maxStorage"
              defaultValue={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};