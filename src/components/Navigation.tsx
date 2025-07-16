import React from 'react';
import { BarChart3, Users, Building2, Package } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reps', label: 'Reps', icon: Users },
    { id: 'clients', label: 'Clients', icon: Building2 },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
    <nav className="fixed top-[73px] left-0 right-0 bg-gray-800 border-b border-gray-700 px-6 py-3 z-40">
      <div className="flex space-x-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
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

export default Navigation;