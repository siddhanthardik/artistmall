import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { AuthService } from '../../services/auth.service';
import { User, Mail, Building, Lock, Loader2, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'BOOKING_COMPANY', // Default role for registration
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await AuthService.register(formData);

      // Route based on role
      if (user.role === 'MANAGEMENT_COMPANY') navigate('/dashboard/management');
      else if (user.role === 'BOOKING_COMPANY') navigate('/dashboard/booking');
      else navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to register.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-400 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/30 group-hover:scale-105 transition-transform">
            <span className="text-2xl font-bold text-slate-900">AM</span>
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-white">Apply for an Account</h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-gold-400 hover:text-gold-300 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass-panel py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-700/50">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">First name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Corporate Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Account Type</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all sm:text-sm appearance-none"
                >
                  <option value="BOOKING_COMPANY">Event Planner / Agency (Demand)</option>
                  <option value="MANAGEMENT_COMPANY">Artist Management (Supply)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full flex justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </Button>
            </div>

            <p className="text-xs text-center text-slate-500 mt-4">
              By registering, you agree to our stringent B2B Verification Policy.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
