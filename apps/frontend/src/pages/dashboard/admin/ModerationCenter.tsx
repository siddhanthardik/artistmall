import React, { useState } from 'react';
import { Star, Search, Loader2, Zap, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '../../../services/admin.service';

export const ModerationCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: artistsData, isLoading } = useQuery({
    queryKey: ['admin-artists-moderation', searchTerm],
    queryFn: () => AdminService.getArtists({ search: searchTerm, limit: 100 }),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({
      id,
      isFeatured,
      premiumTier,
    }: {
      id: string;
      isFeatured: boolean;
      premiumTier: string;
    }) => AdminService.toggleFeatured(id, { isFeatured, premiumTier }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists-moderation'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const artists = artistsData?.data?.artists || [];

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Monetization & Visibility
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">
            Premium Ranking & Featured Inventory Management
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm">
          <Zap className="w-4 h-4 text-brand-orange" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Global Ranking Priority Active
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] p-4 flex items-center gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified talent by Stage Name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-white border border-slate-200 p-4 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Talent Profile
              </th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                System Status
              </th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Marketplace Visibility
              </th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                Monetization Controls
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
                </td>
              </tr>
            ) : artists.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest"
                >
                  No talent records found
                </td>
              </tr>
            ) : (
              artists.map((artist: any) => (
                <tr key={artist._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 group-hover:border-brand-orange transition-colors bg-slate-100">
                        <img
                          src={artist.profileImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          {artist.stageName}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {artist.categoryId?.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        artist.verificationStatus === 'APPROVED'
                          ? 'bg-green-50 text-brand-success border-green-100'
                          : artist.verificationStatus === 'PENDING_REVIEW'
                            ? 'bg-orange-50 text-brand-orange border-orange-100'
                            : 'bg-red-50 text-brand-error border-red-100'
                      }`}
                    >
                      {artist.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      {artist.isFeatured ? (
                        <div className="flex items-center gap-2 text-brand-orange">
                          <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            FEATURED: {artist.premiumTier}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          ORGANIC RANKING
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: artist._id,
                            isFeatured: false,
                            premiumTier: 'STANDARD',
                          })
                        }
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${!artist.isFeatured ? 'bg-slate-100 text-slate-900 border-slate-200 shadow-inner' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900'}`}
                      >
                        Organic
                      </button>
                      <button
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: artist._id,
                            isFeatured: true,
                            premiumTier: 'SILVER',
                          })
                        }
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${artist.isFeatured && artist.premiumTier === 'SILVER' ? 'bg-slate-200 text-slate-900 border-slate-300' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        Silver
                      </button>
                      <button
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: artist._id,
                            isFeatured: true,
                            premiumTier: 'GOLD',
                          })
                        }
                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${artist.isFeatured && artist.premiumTier === 'GOLD' ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20' : 'bg-white border border-brand-orange/30 text-brand-orange hover:bg-brand-orange/5'}`}
                      >
                        <Star className="w-3 h-3 fill-current" /> Gold Tier
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
