import React from 'react';
import { CountryCode } from '../../types';

interface CountryFlagProps {
  countryCode: CountryCode;
  size?: 'sm' | 'md' | 'lg';
  withName?: boolean;
}

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

export const CountryFlag: React.FC<CountryFlagProps> = ({ 
  countryCode, 
  size = 'md',
  withName = false
}) => {
  // Convert ISO codes to country codes for flag emoji
  const getFlagEmoji = (country: CountryCode) => {
    // Convert country code to regional indicator symbols
    // Each letter A-Z is represented by a regional indicator symbol from U+1F1E6 to U+1F1FF
    const codePoints = country
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className={`${sizeClasses[size]}`}>{getFlagEmoji(countryCode)}</span>
      {withName && <span className="font-medium">{countryNames[countryCode]}</span>}
    </span>
  );
};