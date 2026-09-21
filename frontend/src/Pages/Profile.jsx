import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Store, CheckCircle, AlertCircle, Package } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth();

  // Basic Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Customer Delivery Address
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'India',
  });

  // Shopkeeper Store Details & Address
  const [isShopkeeper, setIsShopkeeper] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'India',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'delivery' | 'shop'

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setIsShopkeeper(Boolean(user.isShopkeeper || user.role === 'shopkeeper' || user.isAdmin));
      setShopName(user.shopName || '');

      if (user.address) {
        setDeliveryAddress({
          street: user.address.street || '',
          city: user.address.city || '',
          state: user.address.state || '',
          postalCode: user.address.postalCode || '',
          phone: user.address.phone || '',
          country: user.address.country || 'India',
        });
      }

      if (user.shopAddress) {
        setShopAddress({
          street: user.shopAddress.street || '',
          city: user.shopAddress.city || '',
          state: user.shopAddress.state || '',
          postalCode: user.shopAddress.postalCode || '',
          phone: user.shopAddress.phone || '',
          country: user.shopAddress.country || 'India',
        });
      }
    }
  }, [user]);

  const handleDeliveryChange = (field, val) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: val }));
  };

  const handleShopAddressChange = (field, val) => {
    setShopAddress((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const payload = {
        name,
        email,
        address: deliveryAddress,
        ...(isShopkeeper ? { shopName, shopAddress } : {}),
      };

      if (password) {
        payload.password = password;
      }

      const { data } = await axios.put('/api/users/profile', payload, config);
      login({ ...user, ...data });
      setMessage('Profile and address details updated successfully!');
      setPassword('');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto my-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Account Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your personal profile, shipping addresses, and merchant credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl transition"
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </Link>
          {user?.isAdmin && (
            <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900/40 dark:text-purple-300">
              Administrator
            </span>
          )}
          {(user?.isShopkeeper || user?.role === 'shopkeeper') && (
            <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-900/40 dark:text-yellow-300">
              🏬 Verified Merchant
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium border-b-2 transition ${
            activeTab === 'account'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <User className="w-4 h-4" /> Personal Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium border-b-2 transition ${
            activeTab === 'delivery'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <MapPin className="w-4 h-4" /> Delivery Address
        </button>
        {(isShopkeeper || user?.isAdmin) && (
          <button
            type="button"
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'shop'
                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Store className="w-4 h-4" /> Shopkeeper Store Address
          </button>
        )}
      </div>

      {message && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/30 dark:border-green-800 dark:text-green-300">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Account Info */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                New Password <span className="text-xs text-gray-400 font-normal">(leave blank to keep current)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Tab 2: User Delivery Address */}
        {activeTab === 'delivery' && (
          <div className="space-y-4">
            <div className="p-3 mb-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-xs">
              This address will be automatically pre-filled when you checkout on TrendHive.
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Street Address / House No.
              </label>
              <input
                type="text"
                placeholder="House 15, Lake View Road, Indiranagar"
                value={deliveryAddress.street}
                onChange={(e) => handleDeliveryChange('street', e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Bengaluru"
                  value={deliveryAddress.city}
                  onChange={(e) => handleDeliveryChange('city', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  value={deliveryAddress.state}
                  onChange={(e) => handleDeliveryChange('state', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Postal / PIN Code
                </label>
                <input
                  type="text"
                  placeholder="560038"
                  value={deliveryAddress.postalCode}
                  onChange={(e) => handleDeliveryChange('postalCode', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 91234 56789"
                  value={deliveryAddress.phone}
                  onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Shopkeeper Details & Store Address */}
        {activeTab === 'shop' && (
          <div className="space-y-4">
            <div className="p-3 mb-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg text-xs">
              This business information and store address is displayed to buyers on your product pages.
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Store / Merchant Business Name
              </label>
              <input
                type="text"
                placeholder="Sharma Electronics & Lifestyle"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Store Physical Street Address
              </label>
              <input
                type="text"
                placeholder="Shop 12-B, Commercial Street, Brigade Cross"
                value={shopAddress.street}
                onChange={(e) => handleShopAddressChange('street', e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Store City
                </label>
                <input
                  type="text"
                  placeholder="Bengaluru"
                  value={shopAddress.city}
                  onChange={(e) => handleShopAddressChange('city', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Store State
                </label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  value={shopAddress.state}
                  onChange={(e) => handleShopAddressChange('state', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Store Postal / PIN Code
                </label>
                <input
                  type="text"
                  placeholder="560001"
                  value={shopAddress.postalCode}
                  onChange={(e) => handleShopAddressChange('postalCode', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Store Business Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 80 2345 6789"
                  value={shopAddress.phone}
                  onChange={(e) => handleShopAddressChange('phone', e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 font-semibold text-white transition bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-md disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
