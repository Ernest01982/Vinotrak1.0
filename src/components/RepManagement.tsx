import React, { useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import RepCard from './RepCard';
import RepFormModal from './RepFormModal';
import { Profile, Client, Call, Order } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const RepManagement: React.FC = () => {
  const { signUp } = useAuth();
  const [reps, setReps] = useState<Profile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredReps, setFilteredReps] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: repsData, error: repsError } = await supabase.from('profiles').select('*').eq('role', 'rep');
    const { data: clientsData, error: clientsError } = await supabase.from('clients').select('rep_id');
    const { data: callsData, error: callsError } = await supabase.from('calls').select('rep_id');
    const { data: ordersData, error: ordersError } = await supabase.from('orders').select('rep_id');

    if (repsError || clientsError || callsError || ordersError) {
      console.error(repsError || clientsError || callsError || ordersError);
    } else {
      setReps(repsData || []);
      setFilteredReps(repsData || []);
      setClients(clientsData as Client[] || []);
      setCalls(callsData as Call[] || []);
      setOrders(ordersData as Order[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReps(reps);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = reps.filter(rep =>
        rep.display_name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredReps(filtered);
    }
  }, [searchTerm, reps]);

  const getRepStats = (repId: string) => ({
    clientCount: clients.filter(c => c.rep_id === repId).length,
    callCount: calls.filter(c => c.rep_id === repId).length,
    orderCount: orders.filter(o => o.rep_id === repId).length,
  });

  const handleAddRep = () => {
    setEditingRep(null);
    setIsModalOpen(true);
  };

  const handleEditRep = (rep: Profile) => {
    setEditingRep(rep);
    setIsModalOpen(true);
  };

  const handleSaveRep = async (repData: { displayName: string; email: string; password?: string }) => {
    if (editingRep) {
      const { error } = await supabase.from('profiles').update({ display_name: repData.displayName }).eq('id', editingRep.id);
      if (error) alert('Error updating rep: ' + error.message);
    } else {
      if (!repData.password) return;
      const { error } = await signUp(repData.email, repData.password, repData.displayName);
      if (error) alert('Error adding rep: ' + error.message);
    }
    fetchData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
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
        <button onClick={handleAddRep} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2">
          <Plus size={20} />
          <span>Add New Rep</span>
        </button>
      </div>

      <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-semibold text-white">All Representatives ({filteredReps.length})</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white w-full sm:w-64"
            />
          </div>
        </div>

        {filteredReps.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No representatives found</h3>
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