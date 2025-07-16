import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (!formData.displayName.trim()) {
          setError('Display name is required');
          return;
        }
        
        const { error: authError } = await signUp(formData.email, formData.password, formData.displayName);
        
        if (authError) {
          setError(authError.message);
        } else {
          setError(null);
          // Show success message for signup
          alert('Account created successfully! You can now sign in with your credentials.');
          setIsSignUp(false);
          setFormData({ email: formData.email, password: '', displayName: '' });
        }
      } else {
        const { error: authError } = await signIn(formData.email, formData.password);
        
        if (authError) {
          setError(authError.message);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const fillTestCredentials = (type: 'admin' | 'rep') => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@vinotrack.app',
        password: 'password123',
        displayName: ''
      });
    } else {
      setFormData({
        email: 'rep@vinotrack.app',
        password: 'password123',
        displayName: ''
      });
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Vino<span className="text-sky-400">Track</span>
          </h1>
          <p className="text-gray-400">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Test Credentials */}
        {!isSignUp && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium mb-3">Test Credentials:</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillTestCredentials('admin')}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors duration-200"
              >
                <strong>Admin:</strong> admin@vinotrack.app / password123
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('rep')}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors duration-200"
              >
                <strong>Rep:</strong> rep@vinotrack.app / password123
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Note: If test users don't exist, you can create them using the sign-up form.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Display Name (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User size={16} className="inline mr-2" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-200 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setFormData({ email: '', password: '', displayName: '' });
                }}
                className="text-sky-400 hover:text-sky-300 text-sm transition-colors duration-200"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;