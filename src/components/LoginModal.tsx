import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/kyc/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Store user data in localStorage and update auth context
        localStorage.setItem('user', JSON.stringify(result.data));
        login(result.data);
        
        alert(`Login successful! Welcome ${result.data.name} (${result.data.type.toUpperCase()})`);
        onClose();
        
        // Navigate to appropriate page based on user type
        if (result.data.type === 'farmer') {
          navigate('/dashboard');
        } else if (result.data.type === 'ngo') {
          navigate('/profile');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(`Login failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{ paddingTop: '400px', paddingLeft: '100px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Login to FarmVilla</h2>
                  <p className="text-green-100">Access your verified account</p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Login Type Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setLoginType('phone')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      loginType === 'phone'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType('email')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      loginType === 'email'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </button>
                </div>

                {/* Identifier Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {loginType === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <input
                    type={loginType === 'phone' ? 'tel' : 'email'}
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    placeholder={loginType === 'phone' ? '9876543210' : 'your@email.com'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Demo Credentials Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Demo Login Credentials:</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Farmers:</strong></p>
                    <p>Phone: 9876543210 | Password: demo123</p>
                    <p>Phone: 9876543211 | Password: demo123</p>
                    <p>Phone: 9876543212 | Password: demo123</p>
                    <p><strong>NGOs:</strong></p>
                    <p>Email: info@kfwt.org | Password: demo123</p>
                    <p>Email: contact@safoundation.org | Password: demo123</p>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              {/* Registration Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <span className="text-green-600 font-medium">
                    Complete KYC verification using the buttons in the header
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
