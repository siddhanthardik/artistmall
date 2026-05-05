import React from 'react';
import { RefreshCcw, ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HEADER SECTION */}
      <section className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-brand-success"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Financial Integrity</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Refund Policy</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Effective Date: April 25, 2026</p>
        </div>
      </section>

      {/* 2. CONTENT SECTION */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 md:p-20 shadow-sm space-y-16">
            
            <div className="prose prose-slate max-w-none">
              <div className="flex items-center gap-4 mb-8">
                <RefreshCcw className="w-8 h-8 text-brand-success" />
                <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">Fair Resolution</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                The Artist Mall operates with an escrow-first model to ensure that every booking is financially protected. Our refund policy is designed to be fair, transparent, and legally sound for both the host and the talent.
              </p>
            </div>

            <LegalSection 
              title="1. Eligibility for Refunds" 
              icon={ShieldCheck}
              content={[
                "Performance Failure: 100% refund if the artist fails to attend the event without professional cause.",
                "Force Majeure: Full or partial refund/credit if the event is cancelled due to legally recognized unforeseen circumstances.",
                "Platform Verification Error: Refund if the talent delivered differs significantly from the verified profile.",
                "Mutually Agreed Cancellation: Refund processed according to the specific cancellation timeline."
              ]}
            />

            <LegalSection 
              title="2. Non-Refundable Items" 
              icon={FileText}
              content={[
                "Platform Service Fees: Fees for logistical coordination are generally non-refundable once service is initiated.",
                "Non-Refundable Deposits: Initial deposits required to block artist dates as defined in the specific booking agreement.",
                "On-Ground Technical Expenses: Costs already incurred for technical riders, travel, and hospitality arrangements."
              ]}
            />

            <LegalSection 
              title="3. Processing Timelines" 
              icon={Clock}
              content={[
                "Audit Period: All refund requests undergo a 48-hour operational audit to verify performance records.",
                "Bank Processing: Once approved, funds are released to the original source within 5-7 business days.",
                "Credit Options: Clients may opt for platform credit for future bookings for immediate balance transfer."
              ]}
            />

            <div className="bg-green-50 rounded-3xl p-10 border border-green-100">
               <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Escrow Security</h3>
               <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                 Your event budget is held in a secure escrow account. Funds are only transferred to the artist after our operations team confirms successful performance delivery.
               </p>
               <p className="text-brand-success font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                 Refund Support: salestheartistmall@gmail.com
               </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

const LegalSection = ({ title, icon: Icon, content }: any) => (
  <div className="space-y-8">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    <ul className="space-y-4 ml-14">
      {content.map((item: string, idx: number) => (
        <li key={idx} className="flex items-start gap-3">
          <div className="mt-1.5 shrink-0">
             <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
          </div>
          <span className="text-slate-600 text-sm font-medium leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
