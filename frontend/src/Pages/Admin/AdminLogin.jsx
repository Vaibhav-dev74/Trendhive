import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Store, ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/users/admin-login', {
        email,
        password,
      });

      login(data);
      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      const errMsg =
        err.response?.data?.message ||
        'Authentication failed. Please verify your merchant or admin credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl dark:bg-gray-800 dark:border-gray-700">
        {/* Header Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400">
          <Store className="w-8 h-8" />
        </div>

        <div className="text-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-900/60 dark:text-yellow-300">
            <ShieldCheck className="w-3.5 h-3.5" /> Merchant & Admin Access
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Shopkeeper Portal
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sign in to manage your inventory, store profile, and product listings.
          </p>
        </div>

        {/* Demo Quick-Fill Buttons */}
        <div className="p-3 mt-5 bg-gray-50 rounded-xl dark:bg-gray-700/50 border border-gray-200/60 dark:border-gray-600">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">
            Quick demo credentials:
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('shopkeeper@trendhive.com', 'shop123')}
              className="flex-1 py-1.5 px-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
            >
              🏬 Shopkeeper
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@trendhive.com', 'admin123')}
              className="flex-1 py-1.5 px-2 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Business / Admin Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@trendhive.com"
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-2.5 mt-2 font-semibold text-white transition bg-yellow-600 hover:bg-yellow-700 active:scale-[0.99] rounded-lg disabled:opacity-50 shadow-md shadow-yellow-600/20"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <div>
            Are you a shopper / customer?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Customer Sign In
            </Link>
          </div>
          <div>
            Want to sell on TrendHive?{' '}
            <Link to="/signup" className="font-semibold text-green-600 hover:underline dark:text-green-400">
              Create Seller Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

