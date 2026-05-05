import React, { useState } from 'react';
import { HeartHandshake, FileText, CheckCircle, XCircle, ArrowRight, ShieldCheck, Loader2, Send } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { BookingService } from '../../../services/booking.service';
import { StatusBadge, StatusType } from '../../../components/shared/StatusBadge';
import { WorkflowTimeline } from '../../../components/shared/WorkflowTimeline';

export const NegotiationRoom: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const queryClient = useQueryClient();
  const [offerValue, setOfferValue] = useState('');
  const [note, setNote] = useState('');

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => BookingService.getBookingDetails(bookingId!),
    enabled: !!bookingId,
  });

  const mutation = useMutation({
    mutationFn: ({ action, amount, notes }: { action: 'ACCEPT' | 'REJECT' | 'COUNTER', amount?: number, notes?: string }) => 
      BookingService.negotiate(bookingId!, action, amount, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      setOfferValue('');
      setNote('');
    }
  });

  const handleAction = (action: 'ACCEPT' | 'REJECT' | 'COUNTER') => {
    mutation.mutate({
      action,
      amount: action === 'COUNTER' ? Number(offerValue) : undefined,
      notes: note || (action === 'ACCEPT' ? 'Accepted the offer.' : action === 'REJECT' ? 'Withdrawn the request.' : undefined)
    });
  };

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-[#1E4DB7]" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Opening Deal Room...</p>
    </div>;
  }

  if (isError || !booking) {
    return <div className="text-center py-40">
      <div className="inline-block p-6 rounded-3xl bg-red-50 border border-red-100">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold">Failed to load booking details.</p>
      </div>
    </div>;
  }

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col space-y-6">
      
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <WorkflowTimeline currentStage={booking.status} />
      </div>

      <div className="flex justify-between items-end px-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-900">Deal Room: {booking.artistId?.name || 'Artist'}</h2>
            <StatusBadge status={booking.status as StatusType} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Request ID: <span className="text-slate-600 font-mono">{booking._id.substring(0, 8).toUpperCase()}</span> 
            <span className="text-slate-200">|</span>
            Event Date: <span className="text-slate-600">{new Date(booking.eventDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Management Agency</p>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm font-bold text-slate-900">{booking.artistId?.createdBy?.email || 'Agency'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden shadow-sm">
        
        {/* Ledger / Timeline Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30">
          
          {/* Timeline Entry: Initial Offer */}
          <div className="flex flex-col items-start max-w-2xl">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm relative w-full">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-[#1E4DB7] bg-blue-50 px-2 py-1 rounded uppercase tracking-widest">Initial Inquiry</span>
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Proposed Budget</p>
                <p className="text-3xl font-black text-slate-900">₹{booking.originalOffer?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 border border-slate-100 italic">
                <FileText className="w-4 h-4 mb-2 text-slate-400" />
                <p>"{booking.notes?.[0]?.text || 'No initial notes provided.'}"</p>
              </div>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 ml-4">Sent by You (Demand)</div>
          </div>

          {/* Timeline Entry: Counter Offer (If Exists) */}
          {booking.currentOffer !== booking.originalOffer && (
            <div className="flex flex-col items-end w-full">
              <div className="max-w-2xl w-full">
                <div className="bg-white border-2 border-[#FF7A2F]/20 rounded-2xl p-6 shadow-md relative">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF7A2F] rounded-l-2xl"></div>
                  <div className="flex justify-between items-start mb-6 pl-2">
                    <span className="text-[10px] font-black text-[#FF7A2F] bg-orange-50 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-2">
                      <HeartHandshake className="w-3 h-3" /> Management Response
                    </span>
                  </div>
                  <div className="mb-6 pl-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revised Budget Request</p>
                    <p className="text-3xl font-black text-slate-900">₹{booking.currentOffer?.toLocaleString()}</p>
                  </div>
                  {booking.notes?.length > 1 && (
                    <div className="ml-2 bg-slate-50 rounded-xl p-4 text-sm text-slate-600 border border-slate-100 italic">
                      <p>"{booking.notes[booking.notes.length - 1].text}"</p>
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 mr-4 text-right">Received from Supply side</div>
              </div>
            </div>
          )}

        </div>

        {/* Action Bar (The Deal Interface) */}
        <div className="p-8 bg-white border-t border-slate-100">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Input Section */}
            <div className="flex-1 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Submit Response</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input 
                    type="number" 
                    placeholder="Enter Counter Offer"
                    value={offerValue}
                    onChange={(e) => setOfferValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-8 pr-4 text-slate-900 font-black focus:ring-4 focus:ring-blue-500/5 focus:border-[#1E4DB7] focus:outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Add a message..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-[#1E4DB7] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-wrap gap-4 items-end">
              <button 
                onClick={() => handleAction('ACCEPT')}
                disabled={mutation.isPending}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" /> Accept Offer
              </button>
              
              <button 
                onClick={() => handleAction('COUNTER')}
                disabled={!offerValue || mutation.isPending}
                className="bg-[#1E4DB7] hover:bg-[#163B8C] text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {mutation.isPending && mutation.variables?.action === 'COUNTER' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
                Send Counter
              </button>

              <button 
                onClick={() => handleAction('REJECT')}
                disabled={mutation.isPending}
                className="border-2 border-red-100 hover:border-red-200 text-red-500 font-black px-6 py-4 rounded-2xl transition-all hover:bg-red-50 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" /> Withdraw
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
