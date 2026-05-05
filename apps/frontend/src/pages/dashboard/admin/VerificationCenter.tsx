import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '../../../services/admin.service';
import { Artist } from '../../../types';

export const VerificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const { data: verifications, isLoading } = useQuery({
    queryKey: ['pending-verifications'],
    queryFn: AdminService.getPendingVerifications,
  });

  const pendingArtists = (verifications as any)?.artists || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">VERIFICATION CENTER</h2>
        <p className="text-xs text-slate-500 font-mono mt-1">QUEUE MANAGER</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('artists')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'artists' ? 'border-red-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Artist Approvals{' '}
          <span className="ml-2 bg-slate-800 text-xs px-1.5 rounded">{pendingArtists.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('supply')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'supply' ? 'border-red-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Management KYC <span className="ml-2 bg-slate-800 text-xs px-1.5 rounded">0</span>
        </button>
        <button
          onClick={() => setActiveTab('demand')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'demand' ? 'border-red-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Booking Company KYC <span className="ml-2 bg-slate-800 text-xs px-1.5 rounded">0</span>
        </button>
      </div>

      {/* Split Pane View for Artists */}
      {activeTab === 'artists' && (
        <div className="flex-1 flex gap-6 min-h-[500px]">
          {/* Queue List */}
          <div className="w-1/3 bg-[#111] border border-slate-800 rounded-md flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-[#0a0a0a] text-xs font-bold text-slate-400">
              PENDING QUEUE
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <div className="p-4 text-center text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-red-500" />
                </div>
              )}
              {pendingArtists.length === 0 && !isLoading && (
                <div className="p-4 text-center text-slate-500 text-sm">Queue is empty.</div>
              )}
              {pendingArtists.map((artist: Artist) => (
                <div
                  key={artist._id}
                  onClick={() => setSelectedArtist(artist)}
                  className={`p-4 border-b border-slate-800/50 hover:bg-slate-900 cursor-pointer transition-colors border-l-2 ${selectedArtist?._id === artist._id ? 'bg-slate-900 border-l-red-500' : 'border-l-transparent hover:border-l-red-500/50'}`}
                >
                  <h4 className="text-white font-medium text-sm mb-1">{artist.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">Mgmt: {artist.createdBy?.email}</p>
                  <div className="flex justify-between text-[10px] font-mono text-slate-600">
                    <span>₹{artist.priceRange?.min?.toLocaleString()}</span>
                    <span>{new Date(artist.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Actions Panel */}
          <div className="flex-1 bg-[#111] border border-slate-800 rounded-md flex flex-col">
            {selectedArtist ? (
              <>
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{selectedArtist.name}</h3>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        {selectedArtist.createdBy?.email} <ExternalLink className="w-3 h-3" />
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-xs font-bold">
                        {selectedArtist.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 mb-2 border-b border-slate-800 pb-1">
                        FINANCIALS
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">
                          <span className="text-slate-500">Min Budget:</span> ₹
                          {selectedArtist.priceRange?.min?.toLocaleString()}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-500">Max Budget:</span> ₹
                          {selectedArtist.priceRange?.max?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 mb-2 border-b border-slate-800 pb-1">
                        LOGISTICS
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">
                          <span className="text-slate-500">City:</span>{' '}
                          {selectedArtist.cityId?.name}
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-500">Category:</span>{' '}
                          {selectedArtist.categoryId?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2 border-b border-slate-800 pb-1">
                      ATTACHED MEDIA
                    </h4>
                    <div className="flex gap-4 flex-wrap">
                      {selectedArtist.kycDocuments?.map((doc, i) => (
                        <div
                          key={i}
                          className="w-32 h-20 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500 border border-slate-700 overflow-hidden"
                        >
                          {doc.type === 'IMAGE' ? (
                            <img src={doc.url} alt="media" className="w-full h-full object-cover" />
                          ) : (
                            'Media'
                          )}
                        </div>
                      ))}
                      <div className="w-32 h-20 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500 border border-slate-700 flex-col gap-1">
                        <FileText className="w-4 h-4" /> Tech Rider
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-4 bg-[#0a0a0a] border-t border-slate-800 flex justify-end gap-3">
                  <button className="px-6 py-2 rounded bg-slate-900 border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" /> Reject Listing
                  </button>
                  <button className="px-6 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Approve & Publish
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                Select an item from the queue to review details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
