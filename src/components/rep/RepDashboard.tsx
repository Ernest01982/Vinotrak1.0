import React, { useState } from 'react';
import RepHeader from './RepHeader';
import RepNavigation from './RepNavigation';
import TodaysCalls from './TodaysCalls';
import MyClients from './MyClients';
import NewOrder from './NewOrder';
import AdminViewBanner from '../AdminViewBanner';
import { Client } from '../../lib/supabase';

const RepDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('calls');
  const [orderClient, setOrderClient] = useState<Client | null>(null);

  const handlePlaceOrder = (client: Client) => {
    setOrderClient(client);
    setActiveView('order');
  };

  const handleBackFromOrder = () => {
    setOrderClient(null);
    setActiveView('calls');
  };

  const handleOrderSubmitted = () => {
    // Could trigger a refresh of data here if needed
    console.log('Order submitted successfully');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'calls':
        return <TodaysCalls onPlaceOrder={handlePlaceOrder} />;
      case 'clients':
        return <MyClients onPlaceOrder={handlePlaceOrder} />;
      case 'order':
        return orderClient ? (
          <NewOrder
            client={orderClient}
            onBack={handleBackFromOrder}
            onOrderSubmitted={handleOrderSubmitted}
          />
        ) : null;
      default:
        return <TodaysCalls onPlaceOrder={handlePlaceOrder} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminViewBanner />
      {activeView !== 'order' && (
        <>
          <RepHeader />
          <RepNavigation activeView={activeView} onViewChange={setActiveView} />
        </>
      )}
      {renderContent()}
    </div>
  );
};

export default RepDashboard;