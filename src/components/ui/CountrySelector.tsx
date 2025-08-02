import React from 'react';
import { CountryCode } from '../../types';
import { CountryFlag } from './CountryFlag';
import { ChevronDown } from 'lucide-react';

interface CountrySelectorProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
  label?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  label = 'Country'
}) => {
  const countries = Object.values(CountryCode);
  
  // Country names mapping
  const countryNames: Record<CountryCode, string> = {
    [CountryCode.BJ]: 'Benin',
    [CountryCode.CD]: 'DR Congo',
    [CountryCode.CG]: 'Congo',
    [CountryCode.CI]: 'Ivory Coast',
    [CountryCode.CM]: 'Cameroon',
    [CountryCode.SN]: 'Senegal',
    [CountryCode.TD]: 'Chad'
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id="country-select"
          value={value}
          onChange={(e) => onChange(e.target.value as CountryCode)}
          className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {countryNames[country]} ({country})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CountryFlag countryCode={value} size="sm" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};