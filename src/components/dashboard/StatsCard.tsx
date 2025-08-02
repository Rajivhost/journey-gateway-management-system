import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  changeText?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeDirection,
  changeText
}) => {
  const getChangeColor = () => {
    if (changeDirection === 'up') return 'text-green-600';
    if (changeDirection === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeText = () => {
    if (change === undefined) return changeText || '';
    
    const prefix = changeDirection === 'up' ? '+' : changeDirection === 'down' ? '-' : '';
    const absChange = Math.abs(change);
    return `${prefix}${absChange}% ${changeText || 'from last period'}`;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md p-3 bg-blue-50">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {(change !== undefined || changeText) && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`${getChangeColor()} font-medium`}>
              {getChangeText()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};