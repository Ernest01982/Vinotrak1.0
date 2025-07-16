import React, { useState, useEffect } from 'react';
import { Search, Building2, Upload } from 'lucide-react';
import ClientCard from './ClientCard';
import ClientBulkUpload from './ClientBulkUpload';
import { Client, Profile } from '../lib/supabase';
import { supabase } from '../lib/supabase';

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [reps, setReps] = useState<Profile[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const fetchClientsAndReps = async () => {
    setLoading(true);
    const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
    if (clientsError) console.error('Error fetching clients:', clientsError);
    else {
      setClients(clientsData || []);
      setFilteredClients(clientsData || []);
    }

    const { data: repsData, error: repsError } = await supabase.from('profiles').select('*').eq('role', 'rep');
    if (repsError) console.error('Error fetching reps:', repsError);
    else setReps(repsData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchClientsAndReps();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(lowercasedTerm) ||
        client.email.toLowerCase().includes(lowercasedTerm) ||
        client.location.toLowerCase().includes(lowercasedTerm) ||
        client.contact_person.toLowerCase().includes(lowercasedTerm) ||
        client.store_type.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const getRepName = (repId: string): string => {
    const rep = reps.find(r => r.id === repId);
    return rep ? rep.display_name : 'Unassigned';
  };

  const handleClientsUploaded = async (newClients: Omit<Client, 'id' | 'created_at' | 'updated_at'>[]) => {
    const { error } = await supabase.from('clients').insert(newClients);
    if (error) {
      alert('Error uploading clients: ' + error.message);
    } else {
      setShowBulkUpload(false);
      fetchClientsAndReps(); // Refresh the client list
      alert('Clients uploaded successfully!');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
          <p className="text-gray-400">Manage your client relationships and track engagement</p>
        </div>
        <button
          onClick={() => setShowBulkUpload(!showBulkUpload)}
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Upload size={20} />
          <span>{showBulkUpload ? 'Hide Upload' : 'Bulk Upload'}</span>
        </button>
      </div>

      {showBulkUpload && (
        <ClientBulkUpload
          onClientsUploaded={handleClientsUploaded}
          availableReps={reps.map(rep => ({ id: rep.id, displayName: rep.display_name }))}
        />
      )}

      <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-semibold text-white">
              All Clients ({filteredClients.length})
            </h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200 w-full sm:w-64"
            />
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by uploading your client data'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowBulkUpload(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Upload size={20} />
                <span>Upload Clients</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                repName={getRepName(client.rep_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;