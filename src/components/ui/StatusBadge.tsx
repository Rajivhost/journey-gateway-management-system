import React from 'react';
import { JourneyGatewayStatus } from '../../types';
import { ActivitySquare, CheckSquare, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: JourneyGatewayStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case JourneyGatewayStatus.ACTIVE:
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckSquare className="w-4 h-4 text-green-600" />,
          label: 'Active'
        };
      case JourneyGatewayStatus.INACTIVE:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <ActivitySquare className="w-4 h-4 text-gray-600" />,
          label: 'Inactive'
        };
      case JourneyGatewayStatus.MAINTENANCE:
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200',
          icon: <AlertOctagon className="w-4 h-4 text-amber-600" />,
          label: 'Maintenance'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <ActivitySquare className="w-4 h-4 text-gray-600" />,
          label: status
        };
    }
  };

  const { bgColor, textColor, borderColor, icon, label } = getStatusConfig();
  
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