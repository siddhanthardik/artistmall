import React from 'react';
import { 
  Download, 
  Search, 
  TrendingUp, 
  ArrowUpRight, 
  History,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  CreditCard
} from 'lucide-react';

export const CommissionDashboard: React.FC = () => {
  const DUMMY_COMMISSIONS = [
    { id: 'COM-001', bookingId: 'REQ-8423', amount: 85000, status: 'PAID', date: '2026-04-20', agency: 'OML Entertainment' },
    { id: 'COM-002', bookingId: 'REQ-8419', amount: 15000, status: 'UNPAID', date: '2026-04-22', agency: 'Indie Mgmt' },
    { id: 'COM-003', bookingId: 'REQ-8412', amount: 150000, status: 'UNPAID', date: '2026-04-24', agency: 'Sunburn HQ' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Financial Ledger</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">GMV Tracking & Platform Commission Settlement</p>
        </div>
        <button className="bg-white/5 border border-white/5 px-8 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
           <Download className="w-4 h-4" /> Export Financial Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FinanceCard 
          label="Settled Commissions" 
          value="₹12.45L" 
          sub="YTD Revenue" 
          color="emerald" 
          icon={CheckCircle2} 
        />
        <FinanceCard 
          label="Pending Settlement" 
          value="₹1.65L" 
          sub="3 Bookings Unpaid" 
          color="orange" 
          icon={Clock} 
          alert={true}
        />
        <FinanceCard 
          label="Platform GMV" 
          value="₹1.24Cr" 
          sub="+22% Growth" 
          color="blue" 
          icon={TrendingUp} 
        />
      </div>

      <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-black/20 flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-2xl px-6 py-3 min-w-[300px] flex-1">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search ledger by Booking ID or Agency..."
                className="bg-transparent border-none focus:outline-none text-sm font-bold text-white w-full placeholder:text-slate-700"
              />
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                 <Filter className="w-3.5 h-3.5 text-slate-500" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter: All Status</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10"></div>
              <button className="text-[10px] font-black text-[#FF7A2F] uppercase tracking-widest flex items-center gap-2">
                 Ledger History <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/10 border-b border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction ID</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Booking Reference</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Management Agency</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Commission Amt</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Settlement</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DUMMY_COMMISSIONS.map((comm) => (
                <tr key={comm.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6 font-mono text-[11px] text-slate-500">{comm.id}</td>
                  <td className="px-6 py-6">
                     <span className="text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-2">
                        {comm.bookingId} <ArrowUpRight className="w-3 h-3" />
                     </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-white uppercase tracking-tight">{comm.agency}</td>
                  <td className="px-6 py-6">
                     <p className="text-sm font-black text-white">₹{comm.amount.toLocaleString()}</p>
                     <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">@ 10% Service Fee</p>
                  </td>
                  <td className="px-6 py-6">
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                       comm.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                     }`}>
                        {comm.status}
                     </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    {comm.status === 'UNPAID' ? (
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-[9px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10 active:scale-95">
                         Mark Settled
                      </button>
                    ) : (
                      <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                         <Download className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Footer */}
      <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">
               <Zap className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-white font-black uppercase text-xs tracking-widest">Financial Integrity Shield</h4>
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">All transactions are audit-logged and immutable once settled.</p>
            </div>
         </div>
         <div className="flex items-center gap-2 text-slate-700 font-black italic text-xl select-none">
            <CreditCard className="w-6 h-6" /> THE ARTIST MALL FINANCE
         </div>
      </div>
    </div>
  );
};

const FinanceCard = ({ label, value, sub, color, icon: Icon, alert }: any) => {
  const colors: any = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  };
  return (
    <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 shadow-2xl relative group overflow-hidden">
       {alert && <div className="absolute top-6 right-6 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>}
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${colors[color]} border transition-transform group-hover:scale-110`}>
          <Icon className="w-7 h-7" />
       </div>
       <p className="text-4xl font-black text-white tracking-tighter mb-2">{value}</p>
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
       <div className="mt-8 flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{sub}</span>
       </div>
    </div>
  );
};
