import React from 'react';
import { LogOut, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut, viewAs, toggleViewAs } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 px-6 py-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">
            Vino<span className="text-sky-400">Track</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Admin View Toggle */}
          {user?.profile.role === 'admin' && (
            <button
              onClick={toggleViewAs}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Eye size={18} />
              <span className="hidden sm:block">
                Switch to {viewAs === 'admin' ? 'Rep' : 'Admin'} View
              </span>
            </button>
          )}
          
          <span className="text-gray-300 hidden sm:block">
            Welcome, {user?.profile.display_name}!
          </span>
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;