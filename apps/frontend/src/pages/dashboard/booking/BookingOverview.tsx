import { FileSearch, HeartHandshake, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RemindersWidget } from '../../../components/shared/RemindersWidget';
import { ActivityFeed } from '../../../components/shared/ActivityFeed';

export const BookingOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-black text-slate-900">Demand Operations</h2>
        <p className="text-slate-500 font-medium">Manage your corporate bookings and negotiations.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileSearch className="w-6 h-6 text-[#1E4DB7]" />
            </div>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Active Inquiries</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">12</p>
        </div>

        <div className="bg-white border-2 border-[#FF7A2F]/20 p-6 rounded-2xl shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF7A2F]/5 rounded-full -mr-12 -mt-12" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-orange-50 rounded-xl">
              <HeartHandshake className="w-6 h-6 text-[#FF7A2F]" />
            </div>
            <span className="text-[10px] font-black text-[#FF7A2F] bg-orange-50 px-2 py-1 rounded-full uppercase tracking-tighter">2 Action Required</span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest relative z-10">In Negotiation</h3>
          <p className="text-3xl font-black text-slate-900 mt-1 relative z-10">5</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Confirmed (Upcoming)</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">3</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Clock className="w-6 h-6 text-slate-600" />
            </div>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Pending Mgmt</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          <RemindersWidget />
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
            <h3 className="text-lg font-black text-slate-900 mb-6">Recent Activity</h3>
            <ActivityFeed />
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
          <h3 className="text-lg font-black text-slate-900 mb-6">Quick Links</h3>
          <div className="space-y-3">
            <Link to="/artists" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-[#1E4DB7]/30 transition-all group">
              <span className="text-sm font-bold text-slate-600 group-hover:text-[#1E4DB7]">Discover New Artists</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4DB7]" />
            </Link>
            <Link to="/dashboard/booking/saved" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-[#1E4DB7]/30 transition-all group">
              <span className="text-sm font-bold text-slate-600 group-hover:text-[#1E4DB7]">View Shortlists (4)</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4DB7]" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
