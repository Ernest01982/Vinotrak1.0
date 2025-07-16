import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface RepNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const RepNavigation: React.FC<RepNavigationProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'calls', label: "Today's Calls", icon: Calendar },
    { id: 'clients', label: 'My Clients', icon: Users },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4">
      <div className="flex space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 border-b-2 ${
                isActive
                  ? 'text-sky-600 border-sky-500 bg-sky-50'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default RepNavigation;