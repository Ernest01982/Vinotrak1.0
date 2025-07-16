import React from 'react';
import { Edit, Users, Phone, ShoppingCart } from 'lucide-react';
import { Profile } from '../lib/supabase';

interface RepCardProps {
  rep: Profile;
  clientCount: number;
  callCount: number;
  orderCount: number;
  onEdit: (rep: Profile) => void;
}

const RepCard: React.FC<RepCardProps> = ({ 
  rep, 
  clientCount, 
  callCount, 
  orderCount, 
  onEdit 
}) => {
  return (
    <div className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={rep.photo_url || `https://placehold.co/150x150/4F46E5/FFFFFF?text=${rep.display_name.split(' ').map(n => n[0]).join('')}`}
            alt={rep.display_name}
            className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-white">{rep.display_name}</h3>
            <p className="text-gray-400">{rep.id}</p> {/* Assuming email is not in profiles, use ID or another identifier */}
            <p className="text-gray-500 text-sm">
              Joined {new Date(rep.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onEdit(rep)}
          className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition-colors duration-200"
          title="Edit Rep"
        >
          <Edit size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="bg-blue-500/20 p-3 rounded-lg mb-2 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{clientCount}</p>
          <p className="text-gray-400 text-sm">Clients</p>
        </div>
        
        <div className="text-center">
          <div className="bg-green-500/20 p-3 rounded-lg mb-2 flex items-center justify-center">
            <Phone className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{callCount}</p>
          <p className="text-gray-400 text-sm">Calls</p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-500/20 p-3 rounded-lg mb-2 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{orderCount}</p>
          <p className="text-gray-400 text-sm">Orders</p>
        </div>
      </div>
    </div>
  );
};

export default RepCard;