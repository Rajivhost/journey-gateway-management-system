import React, { useState } from 'react';
import { Palette, Image, Upload } from 'lucide-react';
import { SettingsCard } from '../../components/settings/SettingsCard';

type Theme = 'light' | 'dark' | 'system';

export const AppearanceSettings: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [secondaryColor, setSecondaryColor] = useState('#3730a3');

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Theme"
        description="Customize the platform appearance"
        icon={Palette}
      >
        <div className="grid grid-cols-3 gap-4">
          {themes.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedTheme(value)}
              className={`${
                selectedTheme === value
                  ? 'border-blue-500 ring-2 ring-blue-500'
                  : 'border-gray-200'
              } relative aspect-[4/3] overflow-hidden rounded-lg border bg-white`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100" />
              <div className="relative flex h-full flex-col items-center justify-center p-4">
                <span className="mt-2 text-sm font-medium text-gray-900">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Branding"
        description="Customize your platform branding"
        icon={Image}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                <div className="flex h-full items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Upload New Logo
              </button>
              <p className="text-xs text-gray-500">Recommended size: 200x200px</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Favicon</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="h-8 w-8 overflow-hidden rounded-lg bg-gray-100">
                <div className="flex h-full items-center justify-center">
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Upload New Favicon
              </button>
              <p className="text-xs text-gray-500">Recommended size: 32x32px</p>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Colors"
        description="Customize platform colors"
        icon={Palette}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              </span>
              <input
                type="text"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: secondaryColor }}
                />
              </span>
              <input
                type="text"
                id="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reset to Default
          </button>
          <button
            type="button"
            className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </SettingsCard>
    </div>
  );
};