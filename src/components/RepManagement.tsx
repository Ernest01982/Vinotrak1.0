import React, { useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import RepCard from './RepCard';
import RepFormModal from './RepFormModal';
import { Rep, mockReps, mockClients, mockCalls, mockOrders } from '../data/mockData';

const RepManagement: React.FC = () => {
  const [reps, setReps] = useState<Rep[]>([]);
  const [filteredReps, setFilteredReps] = useState<Rep[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<Rep | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    const fetchReps = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setReps(mockReps);
      setFilteredReps(mockReps);
      setLoading(false);
    };

    fetchReps();
  }, []);

  // Filter reps based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReps(reps);
    } else {
      const filtered = reps.filter(rep =>
        rep.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReps(filtered);
    }
  }, [searchTerm, reps]);

  const getRepStats = (repId: string) => {
    const clientCount = mockClients.filter(client => client.repId === repId).length;
    const callCount = mockCalls.filter(call => call.repId === repId).length;
    const orderCount = mockOrders.filter(order => order.repId === repId).length;
    
    return { clientCount, callCount, orderCount };
  };

  const handleAddRep = () => {
    setEditingRep(null);
    setIsModalOpen(true);
  };

  const handleEditRep = (rep: Rep) => {
    setEditingRep(rep);
    setIsModalOpen(true);
  };

  const handleSaveRep = (repData: Partial<Rep> & { password?: string }) => {
    if (editingRep) {
      // Update existing rep
      const updatedReps = reps.map(rep =>
        rep.id === editingRep.id
          ? { ...rep, ...repData }
          : rep
      );
      setReps(updatedReps);
    } else {
      // Add new rep
      const newRep: Rep = {
        id: `rep-${Date.now()}`,
        displayName: repData.displayName!,
        email: repData.email!,
        photoURL: `https://placehold.co/150x150/4F46E5/FFFFFF?text=${repData.displayName!.split(' ').map(n => n[0]).join('')}`,
        role: 'rep',
        createdAt: new Date().toISOString()
      };
      setReps(prev => [...prev, newRep]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading representatives...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rep Management</h1>
          <p className="text-gray-400">Manage your sales representatives and track their performance</p>
        </div>
        <button
          onClick={handleAddRep}
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Rep</span>
        </button>
      </div>

      <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-semibold text-white">
              All Representatives ({filteredReps.length})
            </h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200 w-full sm:w-64"
            />
          </div>
        </div>

        {filteredReps.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm ? 'No reps found' : 'No representatives yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first sales representative'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddRep}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add First Rep</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReps.map((rep) => {
              const stats = getRepStats(rep.id);
              return (
                <RepCard
                  key={rep.id}
                  rep={rep}
                  clientCount={stats.clientCount}
                  callCount={stats.callCount}
                  orderCount={stats.orderCount}
                  onEdit={handleEditRep}
                />
              );
            })}
          </div>
        )}
      </div>

      <RepFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRep}
        editingRep={editingRep}
      />
    </div>
  );
};

export default RepManagement;