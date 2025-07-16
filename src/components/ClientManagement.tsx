import React, { useState, useEffect } from 'react';
import { Search, Building2, Upload } from 'lucide-react';
import ClientCard from './ClientCard';
import ClientBulkUpload from './ClientBulkUpload';
import { Client, mockClients, mockReps } from '../data/mockData';

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Simulate fetching data
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setClients(mockClients);
      setFilteredClients(mockClients);
      setLoading(false);
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.storeType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const getRepName = (repId: string): string => {
    const rep = mockReps.find(r => r.id === repId);
    return rep ? rep.displayName : 'Unassigned';
  };

  const handleClientsUploaded = (newClients: Omit<Client, 'id' | 'createdAt'>[]) => {
    const clientsWithIds = newClients.map(client => ({
      ...client,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }));

    setClients(prev => [...prev, ...clientsWithIds]);
    setShowBulkUpload(false);
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
          <span>{showBulkUpload ? 'Hide' : 'Bulk Upload'}</span>
        </button>
      </div>

      {/* Bulk Upload Component */}
      {showBulkUpload && (
        <ClientBulkUpload
          onClientsUploaded={handleClientsUploaded}
          availableReps={mockReps.map(rep => ({ id: rep.id, displayName: rep.displayName }))}
        />
      )}

      {/* Client List */}
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
                repName={getRepName(client.repId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;