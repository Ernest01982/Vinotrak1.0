import React, { useState, useEffect } from 'react';
import { X, Clock, FileText, CheckSquare, Calendar } from 'lucide-react';
import { Call, Client, availableOutcomes } from '../../data/mockData';

interface CallLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (callData: {
    notes: string;
    outcomes: string[];
    duration: number;
  }) => void;
  client: Client;
  previousVisit?: Call | null;
}

const CallLogModal: React.FC<CallLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  client,
  previousVisit
}) => {
  const [notes, setNotes] = useState('');
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
  const [duration, setDuration] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setNotes('');
      setSelectedOutcomes([]);
      setDuration(30);
    }
  }, [isOpen]);

  const handleOutcomeToggle = (outcome: string) => {
    setSelectedOutcomes(prev => 
      prev.includes(outcome)
        ? prev.filter(o => o !== outcome)
        : [...prev, outcome]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notes.trim()) {
      alert('Please add visit notes before saving.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave({
      notes: notes.trim(),
      outcomes: selectedOutcomes,
      duration
    });
    
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Log Visit</h2>
              <p className="text-gray-600">{client.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Previous Visit Section */}
          {previousVisit ? (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Last Visit</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">
                    {new Date(previousVisit.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {previousVisit.duration && (
                    <span className="text-blue-600">• {previousVisit.duration} minutes</span>
                  )}
                </div>
                {previousVisit.notes && (
                  <div className="bg-white rounded p-3 border border-blue-200">
                    <p className="text-sm text-gray-700">{previousVisit.notes}</p>
                  </div>
                )}
                {previousVisit.outcomes && previousVisit.outcomes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {previousVisit.outcomes.map((outcome, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {outcome}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-700">Last Visit</h3>
              </div>
              <p className="text-gray-600 text-sm">No previous visits recorded for this client.</p>
            </div>
          )}

          {/* Current Visit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Visit Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Visit Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Visit Notes *
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what happened during this visit, key discussion points, client feedback, etc."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <CheckSquare className="inline w-4 h-4 mr-1" />
                Visit Outcomes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableOutcomes.map((outcome) => (
                  <label
                    key={outcome}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedOutcomes.includes(outcome)
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOutcomes.includes(outcome)}
                      onChange={() => handleOutcomeToggle(outcome)}
                      className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <span className="text-sm font-medium">{outcome}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !notes.trim()}
                className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Log & Complete Visit</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CallLogModal;