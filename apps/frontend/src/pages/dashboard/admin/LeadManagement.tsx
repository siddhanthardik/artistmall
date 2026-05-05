import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, Calendar, MapPin, Eye, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  quoted: 'bg-orange-100 text-orange-700',
  converted: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

export const LeadManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'today' | 'high-value' | 'converted'>('all');
  const [page] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Fetch Leads
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['admin-leads', filter, page],
    queryFn: async () => {
      let params: any = { page, limit: 20 };
      if (filter === 'today') params.today = true;
      if (filter === 'high-value') params.tag = 'High Value';
      if (filter === 'converted') params.status = 'converted';
      const res = await api.get('/leads', { params });
      return res.data;
    }
  });

  // Update Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.patch(`/leads/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    },
    onError: () => toast.error('Failed to update status')
  });

  // Delete Lead
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      toast.success('Lead deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      setSelectedLead(null);
    },
    onError: () => toast.error('Failed to delete lead')
  });

  const leads = leadsData?.leads || [];

  return (
    <div className="space-y-8">
      {/* Header & Quick Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads & Enquiries</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage artist booking requests and CRM pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setFilter('all')}
             className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
           >
             All
           </button>
           <button 
             onClick={() => setFilter('today')}
             className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'today' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
           >
             Today
           </button>
           <button 
             onClick={() => setFilter('high-value')}
             className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'high-value' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
           >
             High Value
           </button>
           <button 
             onClick={() => setFilter('converted')}
             className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'converted' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
           >
             Converted
           </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Artist</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">No leads found for this filter.</td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{lead.artistName}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{lead.customerName}</p>
                      {lead.tags?.includes('High Value') && (
                        <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1 uppercase tracking-widest">High Value</span>
                      )}
                    </td>
                    <td className="p-4 space-y-1 text-slate-600 text-xs font-medium">
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-slate-400" /> {lead.phone}</div>
                      {lead.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-slate-400" /> {lead.email}</div>}
                    </td>
                    <td className="p-4 space-y-1 text-slate-600 text-xs font-medium">
                       <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-800">{lead.eventType}</span>
                       </div>
                       <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-slate-400" /> {new Date(lead.eventDate).toLocaleDateString()}</div>
                       <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-slate-400" /> {lead.eventCity} • {lead.guestCount} Guests</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatusMutation.mutate({ id: lead._id, status: e.target.value })}
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg appearance-none cursor-pointer outline-none ${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}`}
                        style={{ paddingRight: '2rem', backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.65em auto' }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                       <button onClick={() => setSelectedLead(lead)} className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
                          <Eye className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">Enquiry Details</h2>
            
            <div className="space-y-4 text-sm font-medium text-slate-600">
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Artist requested</p>
                 <p className="text-base font-bold text-slate-900">{selectedLead.artistName}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                   <p className="font-bold text-slate-900">{selectedLead.customerName}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                   <p>{selectedLead.phone}</p>
                   <p>{selectedLead.email}</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Event Type & Date</p>
                   <p className="font-bold text-slate-900">{selectedLead.eventType}</p>
                   <p>{new Date(selectedLead.eventDate).toDateString()}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location & Guests</p>
                   <p>{selectedLead.eventCity}</p>
                   <p>{selectedLead.guestCount} Guests</p>
                 </div>
               </div>

               {selectedLead.message && (
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Additional Notes</p>
                   <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100">{selectedLead.message}</p>
                 </div>
               )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
               <button 
                 onClick={() => {
                   if(window.confirm('Are you sure you want to delete this lead?')) {
                     deleteMutation.mutate(selectedLead._id);
                   }
                 }} 
                 className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
               >
                 <Trash2 className="w-4 h-4" /> Delete Lead
               </button>
               <button onClick={() => setSelectedLead(null)} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors">
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
