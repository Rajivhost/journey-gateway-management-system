import React from 'react';
import { JourneyGatewayType } from '../../types';
import { Network, Router } from 'lucide-react';

interface GatewayTypeChipProps {
  type: JourneyGatewayType;
  size?: 'sm' | 'md' | 'lg';
}

export const GatewayTypeChip: React.FC<GatewayTypeChipProps> = ({ 
  type, 
  size = 'md' 
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case JourneyGatewayType.MULTI_PROVIDER:
        return {
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800',
          borderColor: 'border-indigo-200',
          icon: <Network className="w-4 h-4 text-indigo-600" />,
          label: 'Multi Provider'
        };
      case JourneyGatewayType.SINGLE_PROVIDER:
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Router className="w-4 h-4 text-blue-600" />,
          label: 'Single Provider'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <Router className="w-4 h-4 text-gray-600" />,
          label: type
        };
    }
  };

  const { bgColor, textColor, borderColor, icon, label } = getTypeConfig();
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${borderColor} ${bgColor} ${textColor} ${sizeClasses[size]}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </span>
  );
};