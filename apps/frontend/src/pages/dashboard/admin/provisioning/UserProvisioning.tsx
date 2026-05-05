import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Users,
  ShieldCheck,
  Mail,
  AlertCircle,
  Loader2,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { AdminService } from '../../../../services/admin.service';
import axios from 'axios';

type Tab = 'ARTIST' | 'STAFF';

export const UserProvisioning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ARTIST');
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    email: string;
    tempPassword?: string;
    name?: string;
  } | null>(null);

  const renderTabButton = (tab: Tab, Icon: React.ElementType, label: string) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setSuccessData(null);
      }}
      className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all ${
        activeTab === tab
          ? 'border-brand-blue text-brand-blue bg-blue-50/50 font-black'
          : 'border-transparent text-slate-400 font-bold hover:text-slate-600'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === tab ? 'text-brand-blue' : 'text-slate-300'}`} />
      <span className="uppercase tracking-widest text-[11px]">{label}</span>
    </button>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Mission Control: User Provisioning
        </h1>
        <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">
          Internal Talent Operations & Staffing Engine
        </p>
      </div>

      <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {renderTabButton('ARTIST', UserPlus, 'Provision Artist')}
          {renderTabButton('STAFF', ShieldCheck, 'Provision Staff')}
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {successData ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Account Provisioned Successfully
                </h2>
                <p className="text-slate-500 font-medium mb-8">
                  {successData.name ? <b>{successData.name}</b> : 'The entry'} has been created in
                  the database.
                  {successData.tempPassword && (
                    <span>
                      {' '}
                      Credentials for <b>{successData.email}</b> are ready.
                    </span>
                  )}
                </p>

                {successData.tempPassword && (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-8 w-full max-w-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      Temporary Password
                    </p>
                    <div className="text-2xl font-mono font-black text-[#1E4DB7] tracking-widest select-all">
                      {successData.tempPassword}
                    </div>
                  </div>
                )}

                <Button variant="outline" onClick={() => setSuccessData(null)}>
                  Provision Another Entry
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {activeTab === 'ARTIST' && (
                  <ArtistForm
                    onSuccess={setSuccessData}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                  />
                )}
                {activeTab === 'STAFF' && (
                  <StaffForm
                    onSuccess={setSuccessData}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ArtistForm: React.FC<{
  onSuccess: (data: any) => void;
  setIsLoading: (v: boolean) => void;
  isLoading: boolean;
}> = ({ onSuccess, setIsLoading, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    cityId: '',
    priceRange: { min: 50000, max: 200000 },
    celebrityLevel: 'RISING',
    internalNotes: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await AdminService.provisionArtist(formData);
      onSuccess({ email: 'Database Entry Created', name: formData.name });
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || 'Provisioning failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase text-center border-2 border-red-100">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Artist Identity
          </h3>
          <div className="space-y-4">
            <FormField
              label="Artist Name"
              placeholder="e.g. Arijit Singh"
              required
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />
            <FormField
              label="Internal Notes"
              placeholder="e.g. Premium only, high hospitality requirements"
              value={formData.internalNotes}
              onChange={(v) => setFormData({ ...formData, internalNotes: v })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Database Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Celebrity Tier
              </label>
              <select
                value={formData.celebrityLevel}
                onChange={(e) => setFormData({ ...formData, celebrityLevel: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#1E4DB7] focus:bg-white transition-all appearance-none"
              >
                <option value="A_LIST">A-List (Mega Star)</option>
                <option value="B_LIST">B-List (Famous)</option>
                <option value="C_LIST">C-List (Regional)</option>
                <option value="RISING">Rising Talent</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Min Fee (₹)"
                placeholder="50000"
                required
                value={formData.priceRange.min.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    priceRange: { ...formData.priceRange, min: parseInt(v) },
                  })
                }
              />
              <FormField
                label="Max Fee (₹)"
                placeholder="200000"
                required
                value={formData.priceRange.max.toString()}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    priceRange: { ...formData.priceRange, max: parseInt(v) },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Internal Artist Database Rules Active
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1E4DB7] hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Artist in Database'}{' '}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

const StaffForm: React.FC<{
  onSuccess: (data: any) => void;
  setIsLoading: (v: boolean) => void;
  isLoading: boolean;
}> = ({ onSuccess, setIsLoading, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'SUB_ADMIN' as const,
    fullName: '',
    department: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await AdminService.provisionStaff(formData);
      onSuccess({
        email: formData.email,
        tempPassword: res.data.tempPassword,
        name: formData.fullName,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || 'Provisioning failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase text-center border-2 border-red-100">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Mail className="w-4 h-4" /> Credentials
          </h3>
          <div className="space-y-4">
            <FormField
              label="Work Email"
              placeholder="name@theartistmall.com"
              required
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
            />
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Role Permission
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#1E4DB7] focus:bg-white transition-all appearance-none"
              >
                <option value="SUB_ADMIN">Sub Admin (Manager)</option>
                <option value="INTERNAL_OPS">Internal Ops (Staff)</option>
                <option value="FINANCE">Finance Ops</option>
                <option value="SUPER_ADMIN">Super Admin (Founders)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Users className="w-4 h-4" /> Personal Details
          </h3>
          <div className="space-y-4">
            <FormField
              label="Full Name"
              placeholder="e.g. John Doe"
              required
              value={formData.fullName}
              onChange={(v) => setFormData({ ...formData, fullName: v })}
            />
            <FormField
              label="Department"
              placeholder="e.g. Operations, Legal"
              required
              value={formData.department}
              onChange={(v) => setFormData({ ...formData, department: v })}
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-[#1E4DB7]" />
          Super Admin Staff Provisioning Layer Active
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1E4DB7] hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Provision Internal Staff'}{' '}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

const FormField: React.FC<{
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, placeholder, required, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type="text"
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#1E4DB7] focus:bg-white transition-all placeholder:text-slate-300"
    />
  </div>
);
