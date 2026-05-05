import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HEADER SECTION */}
      <section className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-brand-blue"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Trust & Compliance</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Privacy Policy</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Effective Date: April 25, 2026</p>
        </div>
      </section>

      {/* 2. CONTENT SECTION */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 md:p-20 shadow-sm space-y-16">
            
            <div className="prose prose-slate max-w-none">
              <div className="flex items-center gap-4 mb-8">
                <Shield className="w-8 h-8 text-brand-blue" />
                <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">Our Commitment</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                At The Artist Mall, we understand that privacy matters for artists, clients, and event teams. This Privacy Policy outlines how we collect, protect, and use your information within our booking platform.
              </p>
            </div>

            <LegalSection 
              title="1. Information Collection" 
              icon={FileText}
              content={[
                "Identity Data: We collect verified ID information for KYC compliance for both artists and clients.",
                "Professional Data: Artist performance history, technical riders, and management contact details.",
                "Financial Data: Secure payment information processed through our encrypted escrow partners.",
                "Technical Data: IP addresses, browser types, and platform interaction logs for operational security."
              ]}
            />

            <LegalSection 
              title="2. Use of Information" 
              icon={Eye}
              content={[
                "To facilitate secure and professional artist bookings and contractual management.",
                "To verify the identity and professional standing of all platform participants.",
                "To process payments and manage financial compliance and GST documentation.",
                "To improve search, recommendations, and booking workflows for event inquiries."
              ]}
            />

            <LegalSection 
              title="3. Data Protection & Security" 
              icon={Lock}
              content={[
                "We utilize industry-standard AES-256 encryption for all sensitive data at rest and in transit.",
                "Access to personal data is strictly limited to authorized operations staff.",
                "Regular security reviews are performed to maintain platform protection.",
                "We do not sell your personal or professional data to third-party marketplaces."
              ]}
            />

            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
               <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Data Sovereignty</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                 You maintain full control over your professional data. Artists can request data portability or account closure at any time through our legal desk.
               </p>
               <p className="text-brand-blue font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                 Contact Legal Desk: salestheartistmall@gmail.com
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
             <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
          </div>
          <span className="text-slate-600 text-sm font-medium leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
