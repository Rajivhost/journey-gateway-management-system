import React from 'react';

interface SettingsToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  category?: string;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  description,
  enabled,
  onChange,
  category
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className="text-sm font-medium text-gray-900">{label}</h4>
          {category && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {category}
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};