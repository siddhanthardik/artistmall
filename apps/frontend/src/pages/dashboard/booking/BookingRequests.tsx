import React from 'react';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookingService } from '../../../services/booking.service';
import { StatusBadge, StatusType } from '../../../components/shared/StatusBadge';
import { Booking } from '../../../types';

export const BookingRequests: React.FC = () => {
  const { data: requests, isLoading, isError } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: BookingService.getMyRequests
  });



  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-black text-slate-900">Booking Requests</h2>
        <p className="text-slate-500 font-medium">Track all active inquiries and negotiations.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by artist or ID..." 
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-[#1E4DB7] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-600 font-bold focus:border-[#1E4DB7] focus:outline-none cursor-pointer">
              <option>All Statuses</option>
              <option>Awaiting Mgmt</option>
              <option>Deal Room</option>
              <option>Advance Pending</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-black text-[10px] tracking-widest uppercase border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Request ID</th>
                <th className="px-8 py-4">Artist</th>
                <th className="px-8 py-4">Event Date</th>
                <th className="px-8 py-4">Current Offer</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Last Updated</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1E4DB7]" />
                    <p className="font-bold">Fetching booking requests...</p>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="inline-block p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                      Failed to load booking requests. Please try again.
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && !isError && (!requests || requests.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-bold">No active booking requests found.</p>
                  </td>
                </tr>
              )}
              {requests?.map((req: Booking) => (
                <tr key={req._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                      {req._id.substring(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E4DB7] font-black text-xs">
                        {req.artistId?.name?.charAt(0) || 'A'}
                      </div>
                      <span className="font-black text-slate-900">{req.artistId?.name || 'Unknown Artist'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-600">{new Date(req.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-900">₹{req.currentOffer?.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5"><StatusBadge status={req.status as StatusType} /></td>
                  <td className="px-8 py-5 font-medium text-slate-400 text-xs">{new Date(req.updatedAt).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right">
                    {req.status === 'NEGOTIATING' ? (
                      <Link to={`/dashboard/booking/negotiations?id=${req._id}`} className="bg-[#1E4DB7] hover:bg-[#163B8C] text-white px-4 py-2 rounded-lg text-xs font-black shadow-md shadow-blue-500/10 transition-all inline-flex items-center gap-2">
                        Enter Deal Room <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button className="text-slate-400 hover:text-slate-900 px-4 py-2 rounded-lg text-xs font-black transition-all inline-flex items-center gap-2">
                        View Details <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
