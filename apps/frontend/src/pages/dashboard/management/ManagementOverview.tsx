import { Users, CalendarCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActivityFeed } from '../../../components/shared/ActivityFeed';

export const ManagementOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Agency Overview</h2>
          <p className="text-slate-500 font-medium">
            Welcome back. Here is your agency's performance.
          </p>
        </div>
        <Link
          to="/dashboard/management/artists"
          className="bg-[#FF7A2F] hover:bg-[#E66922] text-white px-6 py-3 rounded-xl font-black transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-sm uppercase"
        >
          + Add New Artist
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-[#1E4DB7]" />
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">
              +2 this month
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">
            Active Roster
          </h3>
          <p className="text-3xl font-black text-slate-900 mt-1">14</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <CalendarCheck className="w-6 h-6 text-[#1E4DB7]" />
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">
              3 pending
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">
            Total Bookings
          </h3>
          <p className="text-3xl font-black text-slate-900 mt-1">128</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
              +12%
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">
            Est. Revenue
          </h3>
          <p className="text-3xl font-black text-slate-900 mt-1">₹4.2 Cr</p>
        </div>

        <div className="bg-white border-2 border-[#FF7A2F]/20 p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-[#FF7A2F]" />
            </div>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">
            Action Required
          </h3>
          <p className="text-sm font-bold text-slate-900 mt-2">2 Artists Pending Admin Approval</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-black text-slate-900 mb-6">Recent Activity</h3>
          <ActivityFeed />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-fit overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-900">Booking Requests</h3>
            <button className="text-xs font-black text-[#1E4DB7] hover:underline uppercase tracking-widest">
              View All
            </button>
          </div>
          <div className="p-8 text-center text-slate-400 text-sm font-medium">
            Connect React Query to{' '}
            <code className="bg-slate-50 px-1 rounded text-xs">/api/v1/bookings</code> to see recent
            activity.
          </div>
        </div>
      </div>
    </div>
  );
};
