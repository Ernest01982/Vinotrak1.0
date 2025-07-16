import React from 'react';
import { Building2, MapPin, User, Phone, Mail } from 'lucide-react';
import { Client } from '../lib/supabase';

interface ClientCardProps {
  client: Client;
  repName: string;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, repName }) => {
  return (
    <div className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-sky-500/20 p-3 rounded-lg">
            <Building2 className="w-8 h-8 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{client.name}</h3>
            <p className="text-gray-400">{client.store_type}</p>
            <p className="text-gray-500 text-sm">
              Added {new Date(client.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{client.location}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{client.contact_person}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{client.phone}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{client.email}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Assigned Rep:</span>
          <span className="text-sky-400 font-medium">{repName}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;