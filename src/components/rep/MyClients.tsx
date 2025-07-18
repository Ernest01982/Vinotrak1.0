import React, { useState, useEffect } from 'react';
import { Search, Building2, Phone, Mail, MapPin, FileText, ShoppingCart } from 'lucide-react';
import CallLogModal from './CallLogModal';
import { Call, Client as SupabaseClient } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MyClientsProps {
  onPlaceOrder: (client: SupabaseClient) => void;
}

const MyClients: React.FC<MyClientsProps> = ({ onPlaceOrder }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<SupabaseClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<SupabaseClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SupabaseClient | null>(null);
  const [previousVisit, setPreviousVisit] = useState<Call | null>(null);
  const [allCalls, setAllCalls] = useState<Call[]>([]);

  useEffect(() => {
    const fetchMyClients = async () => {
      setLoading(true);

      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('rep_id', user!.id);
      
      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
      } else {
        setClients(clientsData || []);
        setFilteredClients(clientsData || []);
      }

      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .eq('rep_id', user!.id);
      
      if (callsError) {
        console.error('Error fetching calls:', callsError);
      } else {
        setAllCalls(callsData || []);
      }

      setLoading(false);
    };

    if (user) {
      fetchMyClients();
    }
  }, [user]);

  // Filter clients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.store_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const getPreviousVisit = (clientId: string): Call | null => {
    // Find the most recent completed call for this client
    const clientCalls = allCalls
      .filter(call => 
        call.client_id === clientId && 
        call.rep_id === user!.id && 
        call.status === 'completed'
      )
      .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());
    
    return clientCalls.length > 0 ? clientCalls[0] : null;
  };

  const handleLogNewVisit = (client: SupabaseClient) => {
    setSelectedClient(client);
    setPreviousVisit(getPreviousVisit(client.id));
    setIsModalOpen(true);
  };

  const handlePlaceOrderClick = (client: SupabaseClient) => {
    onPlaceOrder(client);
  };

  const handleSaveLog = async (logData: {
    notes: string;
    outcomes: string[];
    duration: number;
  }) => {
    if (selectedClient) {
      const { data: newCall, error } = await supabase
        .from('calls')
        .insert({
          rep_id: user!.id,
          client_id: selectedClient.id,
          scheduled_date: new Date().toISOString(),
          duration: logData.duration,
          notes: logData.notes,
          outcomes: logData.outcomes,
          status: 'completed',
        })
        .select();

      if (error) {
        console.error('Error creating new call:', error);
      } else if (newCall) {
        setAllCalls(prev => [...prev, ...newCall]);
      }
    }
    
    setSelectedClient(null);
    setPreviousVisit(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your clients...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Clients</h1>
              <p className="text-gray-600">Manage your client relationships and contact information</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sky-600">{filteredClients.length}</p>
              <p className="text-sm text-gray-500">Total Clients</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients by name, location, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm ? 'No clients found' : 'No clients assigned'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'You have no clients assigned to you yet'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-sky-100 p-3 rounded-lg flex-shrink-0">
                    <Building2 className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h3>
                    <p className="text-gray-600 text-sm">{client.store_type}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{client.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-gray-700">{client.contact_person}</span>
                      <a 
                        href={`tel:${client.phone}`}
                        className="text-sky-600 hover:text-sky-700 transition-colors duration-200"
                      >
                        {client.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a 
                      href={`mailto:${client.email}`}
                      className="text-sky-600 hover:text-sky-700 transition-colors duration-200 truncate"
                    >
                      {client.email}
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">
                      Added {new Date(client.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLogNewVisit(client)}
                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <FileText size={14} />
                      <span>Log Visit</span>
                    </button>
                    
                    <button
                      onClick={() => handlePlaceOrderClick(client)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={14} />
                      <span>Place Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call Log Modal */}
        {selectedClient && (
          <CallLogModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedClient(null);
              setPreviousVisit(null);
            }}
            onSave={handleSaveLog}
            client={selectedClient}
            previousVisit={previousVisit}
          />
        )}
      </div>
    </div>
  );
};

export default MyClients;