import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RepHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Vino<span className="text-sky-500">Track</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 hidden sm:block">
            {user?.profile.display_name}
          </span>
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default RepHeader;