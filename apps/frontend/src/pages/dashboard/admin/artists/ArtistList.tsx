import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  RotateCcw,
  Edit3,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminService } from '../../../../services/admin.service';

export const ArtistList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ category: '', tier: '', status: '' });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-artists', page, search, filter],
    queryFn: () => AdminService.getArtists({ page, limit: 10, search, ...filter }),
  });

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: AdminService.getAdminStats,
  });

  const artists = data?.data?.artists || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10);
  const stats = statsData?.data?.kpis || {
    totalArtists: 0,
    pendingVerifications: 0,
    publishedArtists: 0,
  };

  const handleReset = () => {
    setSearch('');
    setFilter({ category: '', tier: '', status: '' });
    setPage(1);
  };

  return (
    <div className="space-y-10">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-neutral-content tracking-tighter">
            Artist Directory
          </h1>
          <p className="text-neutral-content/40 text-lg font-medium">
            Manage and monitor the performance of your artist community.
          </p>
        </div>
        <Link to="/admin/artists/create">
          <button className="bg-brand-primary hover:brightness-110 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-brand-primary/20 flex items-center gap-3 transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Add New Artist
          </button>
        </Link>
      </div>

      {/* 2. FILTER BAR */}
      <div className="bg-white border border-surface-container rounded-[32px] p-8 flex flex-wrap items-center gap-8 shadow-sm">
        <div className="flex-1 min-w-[300px]">
          <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest mb-3">
            Quick Search
          </p>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-content/30 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="Filter by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-3.5 pl-12 pr-6 text-sm font-medium text-neutral-content placeholder:text-neutral-content/30 focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
            />
          </div>
        </div>

        <div className="w-[200px]">
          <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest mb-3">
            All Tiers
          </p>
          <select
            value={filter.tier}
            onChange={(e) => setFilter({ ...filter, tier: e.target.value })}
            className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-3.5 px-6 text-sm font-bold text-neutral-content appearance-none cursor-pointer hover:bg-[#F3F4F6] transition-colors focus:outline-none focus:border-brand-primary"
          >
            <option value="">All Tiers</option>
            <option value="EXCLUSIVE">Exclusive</option>
            <option value="PREMIUM">Premium</option>
            <option value="GOLD">Gold</option>
            <option value="STANDARD">Standard</option>
          </select>
        </div>

        <div className="w-[200px]">
          <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest mb-3">
            All Statuses
          </p>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-3.5 px-6 text-sm font-bold text-neutral-content appearance-none cursor-pointer hover:bg-[#F3F4F6] transition-colors focus:outline-none focus:border-brand-primary"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <div className="flex items-end h-full pt-6">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-brand-secondary font-bold text-sm hover:brightness-90 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="bg-white border border-surface-container rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-container bg-[#F8F9FA]">
                <th className="px-10 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                  Artist
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                  Featured
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                  Home
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-primary" />
                    <p className="text-[10px] font-black text-neutral-content/30 uppercase tracking-widest mt-4">
                      Loading Artist Directory...
                    </p>
                  </td>
                </tr>
              ) : artists.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-20 text-center text-neutral-content/20 font-bold uppercase tracking-[0.2em] text-xs"
                  >
                    No artists found matching your criteria
                  </td>
                </tr>
              ) : (
                artists.map((artist: any) => (
                  <tr key={artist._id} className="group hover:bg-[#F8F9FA] transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-surface-container rounded-xl overflow-hidden border border-surface-container">
                          <img
                            src={artist.profileImage || 'https://via.placeholder.com/100'}
                            alt={artist.stageName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-content">
                            {artist.stageName}
                          </p>
                          <p className="text-[11px] font-medium text-neutral-content/40 mt-0.5">
                            @{artist.slug || artist._id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="bg-[#E9F0FD] text-brand-secondary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {artist.categoryName || 'Talent'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <button
                        onClick={() =>
                          AdminService.toggleFeatured(artist._id).then(() =>
                            queryClient.invalidateQueries({ queryKey: ['admin-artists'] }),
                          )
                        }
                        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${artist.isFeatured ? 'bg-emerald-500' : 'bg-neutral-content/10'}`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${artist.isFeatured ? 'translate-x-5' : ''}`}
                        ></div>
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <button
                        onClick={() => {
                          if (!artist.isPublished && !artist.showOnHome) {
                            alert('Cannot show unpublished artist on homepage');
                            return;
                          }
                          AdminService.toggleHome(artist._id).then(() =>
                            queryClient.invalidateQueries({ queryKey: ['admin-artists'] }),
                          );
                        }}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${artist.showOnHome ? 'bg-brand-secondary' : 'bg-neutral-content/10'}`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${artist.showOnHome ? 'translate-x-5' : ''}`}
                        ></div>
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            artist.verificationStatus === 'PUBLISHED'
                              ? 'bg-brand-success'
                              : artist.verificationStatus === 'PENDING_REVIEW'
                                ? 'bg-[#D97706]'
                                : 'bg-neutral-content/30'
                          }`}
                        ></div>
                        <span className="text-sm font-bold text-neutral-content">
                          {artist.verificationStatus === 'PUBLISHED'
                            ? 'Active'
                            : artist.verificationStatus === 'PENDING_REVIEW'
                              ? 'Pending'
                              : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                        <Link
                          to={`/admin/artists/${artist._id}/edit`}
                          className="p-2 text-neutral-content/40 hover:text-neutral-content transition-colors"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </Link>
                        <Link
                          to={`/artists/${artist.slug || artist._id}`}
                          target="_blank"
                          className="p-2 text-neutral-content/40 hover:text-brand-secondary transition-colors"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </Link>
                        <button className="p-2 text-neutral-content/40 hover:text-error transition-colors">
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION */}
        <div className="p-10 border-t border-surface-container bg-[#F8F9FA] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-sm font-medium text-neutral-content/40">
            Showing{' '}
            <span className="font-bold text-neutral-content">
              {(page - 1) * 10 + 1} - {Math.min(page * 10, total)}
            </span>{' '}
            of <span className="font-bold text-neutral-content">{total}</span> artists
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-12 h-12 bg-white border border-surface-container rounded-2xl flex items-center justify-center text-neutral-content/40 hover:text-neutral-content disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-neutral-content/40 hover:bg-[#F3F4F6]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="w-12 h-12 bg-white border border-surface-container rounded-2xl flex items-center justify-center text-neutral-content/40 hover:text-neutral-content disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-surface-container rounded-[40px] p-10 space-y-6 shadow-sm">
          <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
            Total Artists
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-5xl font-bold text-neutral-content tracking-tighter">
              {stats.totalArtists.toLocaleString()}
            </h2>
            <div className="text-[11px] font-bold text-brand-success flex items-center gap-1 mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> +12% vs last month
            </div>
          </div>
        </div>

        <div className="bg-[#E9F0FD] border border-[#D1E0FA] rounded-[40px] p-10 space-y-6 shadow-sm">
          <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">
            Verified Roster
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-5xl font-bold text-brand-secondary tracking-tighter">
              {stats.publishedArtists.toLocaleString()}
            </h2>
            <div className="text-[11px] font-bold text-brand-secondary/60 mb-2">
              {stats.totalArtists > 0
                ? ((stats.publishedArtists / stats.totalArtists) * 100).toFixed(0)
                : 0}
              % of total directory
            </div>
          </div>
        </div>

        <div className="bg-white border border-surface-container rounded-[40px] p-10 space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest mb-4">
              Pending Approvals
            </p>
            <div className="flex items-center justify-between">
              <h2 className="text-5xl font-bold text-neutral-content tracking-tighter">
                {stats.pendingVerifications.toLocaleString()}
              </h2>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-container"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Pending"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-[10px] font-bold text-neutral-content/40">
                  +24
                </div>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-brand-primary font-bold text-sm group">
            Review Queue{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
