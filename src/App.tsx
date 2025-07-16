import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import RepManagement from './components/RepManagement';
import ClientManagement from './components/ClientManagement';
import PlaceholderView from './components/PlaceholderView';
import RepDashboard from './components/rep/RepDashboard';
import { Package } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading, viewAs } = useAuth();
  const [activeView, setActiveView] = React.useState('dashboard');

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
          <p className="text-gray-500 text-sm mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Show rep dashboard if user is rep OR admin viewing as rep
  if (user.profile.role === 'rep' || (user.profile.role === 'admin' && viewAs === 'rep')) {
    return <RepDashboard />;
  }

  // Show admin dashboard (only if admin and viewing as admin)
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'reps':
        return <RepManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'products':
        return (
          <PlaceholderView
            title="Product Management"
            description="Manage your wine catalog, pricing, and inventory across all locations."
            icon={Package}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      
      <main className="pt-[140px] px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;