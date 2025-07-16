import React from 'react';
import { MapPin, Clock, CheckCircle, FileText, ShoppingCart, Navigation } from 'lucide-react';
import { Call, Client } from '../../data/mockData';

interface CallCardProps {
  call: Call;
  client: Client;
  onLogVisit: (callId: string) => void;
  onPlaceOrder: (callId: string) => void;
}

const CallCard: React.FC<CallCardProps> = ({ call, client, onLogVisit, onPlaceOrder }) => {
  const isCompleted = call.status === 'completed';
  const scheduledTime = new Date(call.scheduledDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const getDirectionsUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md ${
      isCompleted 
        ? 'border-green-200 bg-green-50/30 opacity-75' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isCompleted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">{client.storeType}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>{client.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{scheduledTime}</span>
            </div>
          </div>
        </div>
        {isCompleted && (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">Contact:</span>
          <span>{client.contactPerson}</span>
          <span>•</span>
          <span>{client.phone}</span>
        </div>

        {call.notes && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{call.notes}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => onLogVisit(call.id)}
            disabled={isCompleted}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isCompleted
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600 text-white'
            }`}
          >
            <FileText size={16} />
            <span>Log Visit</span>
          </button>
          
          <button
            onClick={() => onPlaceOrder(call.id)}
            disabled={isCompleted}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isCompleted
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <ShoppingCart size={16} />
            <span>Place Order</span>
          </button>
          
          <a
            href={getDirectionsUrl(client.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            <Navigation size={16} />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallCard;