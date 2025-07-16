import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-gray-500 text-sm">vs last month</span>
            </div>
          )}
        </div>
        <div className="bg-sky-500/20 p-3 rounded-lg">
          <Icon className="w-8 h-8 text-sky-400" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;