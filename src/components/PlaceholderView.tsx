import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center bg-gray-700 rounded-xl p-12 border border-gray-600 max-w-md">
        <div className="bg-sky-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Icon className="w-10 h-10 text-sky-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-400 mb-6">{description}</p>
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <p className="text-sky-400 font-medium">Coming Soon</p>
          <p className="text-gray-500 text-sm mt-1">This feature is under development</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderView;