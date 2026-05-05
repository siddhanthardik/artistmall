import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Star,
  ShieldCheck,
  AlertCircle,
  Activity,
  Zap,
  Loader2,
  TrendingUp,
  Clock,
  UserCheck,
} from 'lucide-react';
import { AdminService } from '../../../services/admin.service';
import { motion } from 'framer-motion';

export const AdminOverview: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: AdminService.getAdminStats,
  });

  const stats = data?.data?.kpis || {
    totalArtists: 0,
    pendingVerifications: 0,
    featuredArtists: 0,
    totalStaff: 0,
    publishedArtists: 0,
  };

  const activity = data?.data?.recentActivity || [];

  // Calculate percentage for "Live On Platform"
  const livePercentage =
    stats.totalArtists > 0 ? ((stats.publishedArtists / stats.totalArtists) * 100).toFixed(1) : '0';

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
        <p className="text-neutral-content/40 font-bold uppercase tracking-widest text-xs">
          Loading Live Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {/* 1. HEADER & SYSTEM STATUS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-content tracking-tighter">
            Admin Dashboard
          </h1>
          <p className="text-neutral-content/40 text-base md:text-lg font-medium">
            Platform Performance & Overview
          </p>
        </div>
        <div className="bg-[#E9FDF0] px-6 py-3 rounded-2xl border border-[#D1FAE5] flex flex-col sm:flex-row items-center justify-between min-w-full md:min-w-[300px] gap-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-brand-success rounded-full"></div>
            <span className="text-[10px] font-black text-brand-success uppercase tracking-widest">
              System Operational
            </span>
          </div>
          <span className="text-[10px] font-bold text-neutral-content/30 text-center sm:text-right">
            Real-time Data Active
          </span>
        </div>
      </div>

      {/* 2. STATS CARDS GRID (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatCard
          icon={Users}
          label="Total Artists"
          value={stats.totalArtists.toLocaleString()}
          secondary={
            <span className="text-brand-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live platform count
            </span>
          }
          iconColor="text-brand-primary"
          iconBg="bg-[#FDF0E9]"
        />
        <StatCard
          icon={ShieldCheck}
          label="Verification Queue"
          value={stats.pendingVerifications.toLocaleString()}
          secondary={
            <span className="text-brand-primary flex items-center gap-1">
              <Clock className="w-3 h-3" /> Awaiting review
            </span>
          }
          iconColor="text-[#D97706]"
          iconBg="bg-[#FEF3C7]"
        />
        <StatCard
          icon={Zap}
          label="Live On Platform"
          value={stats.publishedArtists.toLocaleString()}
          secondary={
            <span className="text-neutral-content/40">{livePercentage}% visibility rate</span>
          }
          iconColor="text-brand-secondary"
          iconBg="bg-[#E9F0FD]"
        />
        <StatCard
          icon={Star}
          label="Featured Artists"
          value={stats.featuredArtists.toLocaleString()}
          secondary={<span className="text-[#D97706]">Premium Tier</span>}
          iconColor="text-[#D97706]"
          iconBg="bg-[#FEF3C7]"
        />
        <StatCard
          icon={UserCheck}
          label="Admin Users"
          value={stats.totalStaff.toLocaleString()}
          secondary={<span className="text-neutral-content/40">Total Staff Accounts</span>}
          iconColor="text-neutral-content"
          iconBg="bg-[#F3F4F6]"
        />
      </div>

      {/* 3. MAIN CONTENT GRID (Responsive) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Audit Logs Table */}
        <div className="lg:col-span-8 bg-white border border-surface-container rounded-[24px] md:rounded-[40px] p-6 md:p-10 space-y-6 md:space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-content tracking-tight">
              Recent Audit Logs
            </h2>
            <button className="text-[10px] font-black text-brand-secondary uppercase tracking-widest hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 md:mx-0">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-surface-container">
                  <th className="px-6 md:px-0 pb-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                    Action
                  </th>
                  <th className="pb-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                    Admin
                  </th>
                  <th className="pb-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                    ResourceType
                  </th>
                  <th className="pb-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {activity.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-20 text-center text-neutral-content/20 font-bold uppercase tracking-[0.2em] text-xs"
                    >
                      No logs available yet
                    </td>
                  </tr>
                ) : (
                  activity.map((log: any) => (
                    <tr key={log._id} className="group hover:bg-[#F8F9FA] transition-colors">
                      <td className="py-6 px-6 md:px-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              log.action.includes('CREATE')
                                ? 'bg-brand-success'
                                : log.action.includes('UPDATE')
                                  ? 'bg-brand-secondary'
                                  : log.action.includes('DELETE')
                                    ? 'bg-error'
                                    : 'bg-brand-primary'
                            }`}
                          ></div>
                          <span className="text-sm font-bold text-neutral-content uppercase tracking-tighter truncate max-w-[150px] md:max-w-none">
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 text-sm font-medium text-neutral-content/60 truncate max-w-[120px] md:max-w-none">
                        {log.adminId?.fullName || log.adminId?.email || 'System'}
                      </td>
                      <td className="py-6 text-sm font-bold text-neutral-content">
                        {log.resourceType}
                      </td>
                      <td className="py-6 text-sm font-medium text-neutral-content/40">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts Sidebar */}
        <div className="lg:col-span-4 bg-white border border-surface-container rounded-[24px] md:rounded-[40px] p-6 md:p-10 space-y-8 md:space-y-10 shadow-sm flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-content tracking-tight">
              System Alerts
            </h2>
          </div>

          <div className="flex-1 space-y-6">
            <AlertItem
              icon={AlertCircle}
              title="Verification Needed"
              message={`${stats.pendingVerifications} artists are currently in the queue awaiting administrative approval.`}
              type={stats.pendingVerifications > 5 ? 'CRITICAL' : 'INFO'}
              iconBg={
                stats.pendingVerifications > 5
                  ? 'bg-error/10 text-error'
                  : 'bg-brand-secondary/10 text-brand-secondary'
              }
            />
            <AlertItem
              icon={Activity}
              title="Database Status"
              message={`Managing ${stats.totalArtists} artist profiles across all verified categories.`}
              type="INFO"
              iconBg="bg-brand-secondary/10 text-brand-secondary"
            />
            <AlertItem
              icon={Zap}
              title="Marketplace Reach"
              message={`${stats.publishedArtists} artists are currently live and visible to the public.`}
              type="ATTENTION"
              iconBg="bg-[#FEF3C7] text-[#D97706]"
            />
          </div>

          <button className="w-full bg-[#E5E7EB] hover:bg-[#D1D5DB] text-neutral-content font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs uppercase tracking-widest transition-all">
            Refresh Health Metrics
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, secondary, iconColor, iconBg }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white border border-surface-container rounded-[24px] md:rounded-[32px] p-6 md:p-8 space-y-4 md:space-y-6 shadow-sm"
  >
    <div
      className={`w-10 h-10 md:w-12 md:h-12 ${iconBg} ${iconColor} rounded-xl md:rounded-2xl flex items-center justify-center`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
    </div>
    <div>
      <p className="text-[9px] md:text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <p className="text-2xl md:text-3xl font-bold text-neutral-content tracking-tight">{value}</p>
    </div>
    <div className="pt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
      {secondary}
    </div>
  </motion.div>
);

const AlertItem = ({ icon: Icon, title, message, type, iconBg }: any) => (
  <div className="flex gap-4 group">
    <div
      className={`w-10 h-10 md:w-12 md:h-12 ${iconBg} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
    </div>
    <div className="space-y-1.5 md:space-y-2">
      <h4 className="text-sm font-bold text-neutral-content">{title}</h4>
      <p className="text-[10px] md:text-[11px] font-medium text-neutral-content/60 leading-relaxed">
        {message}
      </p>
      <p
        className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
          type === 'CRITICAL'
            ? 'text-error'
            : type === 'INFO'
              ? 'text-brand-secondary'
              : 'text-[#D97706]'
        }`}
      >
        {type}
      </p>
    </div>
  </div>
);
