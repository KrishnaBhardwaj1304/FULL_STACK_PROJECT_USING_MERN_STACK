import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ChefHat, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setActiveTab('admin');
      setEmail('admin@bakery.com');
      setPassword('admin123');
    } else {
      setActiveTab('customer');
      setEmail('customer@bakery.com');
      setPassword('customer123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password, activeTab === 'admin' ? 'admin' : undefined);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-bakery-200 shadow-xl space-y-6">
        
        {/* Bakery Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-bakery-100 border-2 border-bakery-300 flex items-center justify-center text-2xl shadow-inner">
            {activeTab === 'admin' ? '👨‍🍳' : '🥐'}
          </div>
          <h1 className="font-serif text-3xl font-bold text-bakery-900">
            {activeTab === 'admin' ? 'Baker / Admin Portal' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-stone-500">
            {activeTab === 'admin'
              ? 'Access oven schedules, menu controls, and incoming orders'
              : 'Sign in to order your daily fresh bakes & track deliveries'}
          </p>
        </div>

        {/* Dual Role Tabs (Customer vs Admin) */}
        <div className="grid grid-cols-2 p-1.5 bg-bakery-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('customer');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'customer'
                ? 'bg-white text-bakery-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-cinnamon" />
            <span>Customer Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-cinnamon text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Baker / Admin</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'admin' ? 'admin@bakery.com' : 'you@example.com'}
                className="w-full pl-10 pr-4 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-bakery-900 hover:bg-cinnamon'
                : 'bg-cinnamon hover:bg-bakery-800'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{activeTab === 'admin' ? 'Access Baker Portal' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="pt-2 border-t border-bakery-100">
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider text-center mb-2">
            Quick Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="py-1.5 px-3 rounded-lg border border-bakery-200 hover:bg-bakery-100 text-[11px] font-medium text-stone-700 text-center transition-colors"
            >
              🥐 Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="py-1.5 px-3 rounded-lg border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-[11px] font-bold text-amber-900 text-center transition-colors"
            >
              👑 Baker Admin Demo
            </button>
          </div>
        </div>

        {/* Bottom Signup Link */}
        {activeTab === 'customer' && (
          <p className="text-center text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-cinnamon hover:underline">
              Create an Account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
