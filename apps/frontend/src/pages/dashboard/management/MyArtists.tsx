import React from 'react';
import { Search, Plus, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { ManagementService } from '../../../services/management.service';
import { StatusBadge, StatusType } from '../../../components/shared/StatusBadge';
import { Artist } from '../../../types';

export const MyArtists: React.FC = () => {
  const {
    data: artists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-artists'],
    queryFn: ManagementService.getMyRoster,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">My Roster</h2>
          <p className="text-slate-500 font-medium">Manage your agency's talent and listings.</p>
        </div>
        <Button className="bg-[#FF7A2F] hover:bg-[#E66922] text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Artist
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search roster..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-[#1E4DB7] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-600 font-bold focus:border-[#1E4DB7] focus:outline-none cursor-pointer">
              <option>All Statuses</option>
              <option>Live</option>
              <option>In Review</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-black text-[10px] tracking-widest uppercase border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Artist Name</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">City</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Added On</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1E4DB7]" />
                    <p className="font-bold">Loading your roster...</p>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="inline-block p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                      Failed to load roster. Please try again.
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && !isError && (!artists || artists.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-bold">
                      You haven't added any artists to your roster yet.
                    </p>
                  </td>
                </tr>
              )}
              {artists?.map((artist: Artist) => (
                <tr key={artist._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF7A2F] font-black">
                        {artist.name?.charAt(0) || 'A'}
                      </div>
                      <span className="font-black text-slate-900">{artist.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-blue-50 text-[#1E4DB7] text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                      {artist.categoryId?.name || 'Artist'}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-600">
                    {artist.cityId?.name || 'India'}
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={artist.status as StatusType} />
                  </td>
                  <td className="px-8 py-5 font-medium text-slate-400 text-xs">
                    {new Date(artist.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {artists?.length || 0} artists
          </span>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-400 hover:bg-white transition-all disabled:opacity-30"
              disabled
            >
              Previous
            </button>
            <button
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-400 hover:bg-white transition-all disabled:opacity-30"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
