import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';
import { Profile } from '../lib/supabase';

interface RepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (repData: { displayName: string; email: string; password?: string }) => void;
  editingRep: Profile | null;
}

const RepFormModal: React.FC<RepFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRep
}) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingRep) {
      setFormData({
        displayName: editingRep.display_name,
        email: '', // Email is not in profiles table, cannot edit
        password: ''
      });
    } else {
      setFormData({
        displayName: '',
        email: '',
        password: ''
      });
    }
    setErrors({});
  }, [editingRep, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
    if (!editingRep && !formData.email.trim()) newErrors.email = 'Email is required';
    else if (!editingRep && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!editingRep && !formData.password.trim()) newErrors.password = 'Password is required for new reps';
    else if (!editingRep && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      displayName: formData.displayName.trim(),
      email: formData.email.trim(),
      ...(!editingRep && { password: formData.password })
    });
    onClose();
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editingRep ? 'Edit Rep' : 'Add New Rep'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white ${errors.displayName ? 'border-red-500' : 'border-gray-600'}`}
              placeholder="Enter full name"
            />
            {errors.displayName && <p className="text-red-400 text-sm mt-1">{errors.displayName}</p>}
          </div>

          {!editingRep && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Enter password (min. 6 characters)"
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium">
              {editingRep ? 'Update Rep' : 'Add Rep'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepFormModal;