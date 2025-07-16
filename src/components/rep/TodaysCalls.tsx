import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import CallCard from './CallCard';
import CallLogModal from './CallLogModal';
import { Call, Client as SupabaseClient } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface TodaysCallsProps {
  onPlaceOrder: (client: SupabaseClient) => void;
}

const TodaysCalls: React.FC<TodaysCallsProps> = ({ onPlaceOrder }) => {
  const { user } = useAuth();
  const [calls, setCalls] = useState<Call[]>([]);
  const [clients, setClients] = useState<SupabaseClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedClient, setSelectedClient] = useState<SupabaseClient | null>(null);
  const [previousVisit, setPreviousVisit] = useState<Call | null>(null);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    const fetchTodaysCalls = async () => {
      setLoading(true);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .eq('rep_id', user!.id)
        .gte('scheduled_date', today.toISOString())
        .lt('scheduled_date', tomorrow.toISOString())
        .order('scheduled_date', { ascending: true });

      if (callsError) {
        console.error('Error fetching calls:', callsError);
      } else {
        setCalls(callsData || []);
      }

      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
      } else {
        setClients(clientsData || []);
      }

      setLoading(false);
    };

    if (user) {
      fetchTodaysCalls();
    }
  }, [user]);

  const getClientById = (clientId: string): SupabaseClient | undefined => {
    return clients.find(client => client.id === clientId);
  };

  const getPreviousVisit = async (clientId: string): Promise<Call | null> => {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('client_id', clientId)
      .eq('rep_id', user!.id)
      .eq('status', 'completed')
      .lt('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching previous visit:', error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  };

  const handleLogVisit = async (callId: string) => {
    const call = calls.find(c => c.id === callId);
    const client = call ? getClientById(call.client_id) : null;
    
    if (call && client) {
      setSelectedCall(call);
      setSelectedClient(client);
      setPreviousVisit(await getPreviousVisit(call.client_id));
      setIsModalOpen(true);
    }
  };

  const handleSaveLog = async (logData: {
    notes: string;
    outcomes: string[];
    duration: number;
  }) => {
    if (selectedCall) {
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'completed',
          notes: logData.notes,
          outcomes: logData.outcomes,
          duration: logData.duration,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCall.id);

      if (error) {
        console.error('Error updating call:', error);
      } else {
        setCalls(prevCalls => 
          prevCalls.map(call => 
            call.id === selectedCall.id 
              ? { 
                  ...call, 
                  status: 'completed',
                  notes: logData.notes,
                  outcomes: logData.outcomes,
                  duration: logData.duration
                }
              : call
          )
        );
      }
    }
    
    setSelectedCall(null);
    setSelectedClient(null);
    setPreviousVisit(null);
  };

  const handlePlaceOrderClick = (callId: string) => {
    const call = calls.find(c => c.id === callId);
    const client = call ? getClientById(call.client_id) : null;
    
    if (client) {
      onPlaceOrder(client);
    }
  };

  const completedCalls = calls.filter(call => call.status === 'completed');
  const pendingCalls = calls.filter(call => call.status === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading today's calls...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Date Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-sky-500" />
            <h1 className="text-2xl font-bold text-gray-900">{formattedDate}</h1>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{calls.length} scheduled calls</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>{completedCalls.length} completed</span>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        {calls.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Progress</span>
              <span className="text-sm text-gray-600">
                {completedCalls.length} of {calls.length} calls completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calls.length > 0 ? (completedCalls.length / calls.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Calls List */}
        {calls.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No calls scheduled</h3>
            <p className="text-gray-500">You have no calls scheduled for today. Enjoy your free time!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pending Calls */}
            {pendingCalls.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span>Pending Calls ({pendingCalls.length})</span>
                </h2>
                <div className="space-y-4">
                  {pendingCalls.map((call) => {
                    const client = getClientById(call.client_id);
                    if (!client) return null;
                    
                    return (
                      <CallCard
                        key={call.id}
                        call={call}
                        client={client}
                        onLogVisit={handleLogVisit}
                        onPlaceOrder={handlePlaceOrderClick}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Calls */}
            {completedCalls.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Completed Calls ({completedCalls.length})</span>
                </h2>
                <div className="space-y-4">
                  {completedCalls.map((call) => {
                    const client = getClientById(call.client_id);
                    if (!client) return null;
                    
                    return (
                      <CallCard
                        key={call.id}
                        call={call}
                        client={client}
                        onLogVisit={handleLogVisit}
                        onPlaceOrder={handlePlaceOrderClick}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Call Log Modal */}
        {selectedClient && (
          <CallLogModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCall(null);
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

export default TodaysCalls;