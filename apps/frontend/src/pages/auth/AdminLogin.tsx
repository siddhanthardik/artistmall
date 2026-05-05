import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthService } from '../../services/admin-auth.service';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');
    
    try {
      await AdminAuthService.login({ email, password });
      navigate('/admin');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication Failed. Please check your credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Subtle Glow Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Main Login Card */}
          <div className="bg-white border border-[#fdf0e9] rounded-[48px] p-12 md:p-16 shadow-2xl shadow-brand-primary/5">
            
            {/* Logo & Header */}
            <div className="text-center mb-12">
              <div className="inline-block w-20 h-20 bg-neutral-content rounded-2xl p-4 mb-8">
                <img src="/logo.png" alt="Artist Mall" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-content tracking-tight mb-2">Admin Portal</h1>
              <p className="text-neutral-content/40 text-sm font-medium">Please enter your credentials to manage the mall.</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error/5 border border-error/20 text-error p-4 rounded-xl text-xs font-bold text-center mb-8"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              {/* Email Field */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-neutral-content/60 uppercase tracking-[0.2em] ml-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="admin@artistmall.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-surface-container rounded-2xl px-6 py-5 text-sm font-bold text-neutral-content placeholder:text-neutral-content/20 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-[10px] font-black text-neutral-content/60 uppercase tracking-[0.2em]">PASSWORD</label>
                  <button type="button" className="text-[10px] font-black text-brand-secondary hover:underline tracking-tight">Forgot Password?</button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-surface-container rounded-2xl px-6 py-5 text-sm font-bold text-neutral-content placeholder:text-neutral-content/20 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primaryContainer text-white font-bold py-6 rounded-2xl shadow-2xl shadow-brand-primary/20 active:scale-[0.98] flex items-center justify-center gap-3 transition-all disabled:opacity-50 group"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-center gap-2 text-brand-success">
                <Lock className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Secure Connection</span>
              </div>
              <p className="text-center">
                <span className="text-xs font-bold text-neutral-content/40">Having trouble? </span>
                <button className="text-xs font-black text-brand-secondary hover:underline">Contact Support</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Page Footer */}
      <footer className="w-full px-10 py-12 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-lg font-bold text-neutral-content tracking-tighter">Artist Mall <span className="text-brand-primary">Vibrant</span></p>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <button className="text-xs font-bold text-neutral-content/60 hover:text-neutral-content transition-colors">Terms of Service</button>
          <button className="text-xs font-bold text-neutral-content/60 hover:text-neutral-content transition-colors">Privacy Policy</button>
          <button className="text-xs font-bold text-neutral-content/60 hover:text-neutral-content transition-colors">Security Standards</button>
          <button className="text-xs font-bold text-neutral-content/60 hover:text-neutral-content transition-colors">Support</button>
        </div>

        <p className="text-xs font-bold text-neutral-content/30">© 2024 Artist Mall Vibrant. All rights reserved.</p>
      </footer>
    </div>
  );
};
