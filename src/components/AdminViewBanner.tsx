import React from 'react';
import { Eye, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminViewBanner: React.FC = () => {
  const { user, viewAs, toggleViewAs } = useAuth();

  // Only show banner if user is admin and viewing as rep
  if (!user || user.profile.role !== 'admin' || viewAs !== 'rep') {
    return null;
  }

  return (
    <div className="bg-purple-600 text-white px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Eye className="w-5 h-5" />
          <span className="font-medium">Admin View: Viewing as Rep</span>
          <span className="text-purple-200 text-sm">
            You are currently viewing the rep dashboard as an administrator
          </span>
        </div>
        <button
          onClick={toggleViewAs}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Admin</span>
        </button>
      </div>
    </div>
  );
};

export default AdminViewBanner;