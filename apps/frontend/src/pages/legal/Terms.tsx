import React from 'react';
import { FileText, Scale, Gavel, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HEADER SECTION */}
      <section className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-brand-orange"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Service Agreement
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Effective Date: April 25, 2026
          </p>
        </div>
      </section>

      {/* 2. CONTENT SECTION */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 md:p-20 shadow-sm space-y-16">
            <div className="prose prose-slate max-w-none">
              <div className="flex items-center gap-4 mb-8">
                <Scale className="w-8 h-8 text-brand-orange" />
                <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                  Legal Framework
                </h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                By accessing The Artist Mall, you enter into a legally binding agreement governing
                the booking and management of professional talent. These terms ensure transparency,
                security, and operational excellence for all parties.
              </p>
            </div>

            <LegalSection
              title="1. Scope of Engagement"
              icon={FileText}
              content={[
                'Platform Role: The Artist Mall acts as a secure platform for artist booking coordination.',
                'Contractual Integrity: Every booking constitutes a tripartite agreement between the Host, the Artist, and the Platform.',
                'User Eligibility: Access is restricted to legally competent entities and verified professional artists.',
                'Booking Agreement: Each engagement is governed by a specific agreement defining duration, fees, and riders.',
              ]}
            />

            <LegalSection
              title="2. Financial Obligations"
              icon={Gavel}
              content={[
                'Enterprise Pricing: All fees are professional and inclusive of platform coordination unless stated otherwise.',
                'Escrow Management: Payments are held in a secure escrow system to protect the interests of both parties.',
                'GST Compliance: Invoicing is compliant with Indian tax regulations for eligible clients.',
                'Cancellation Clauses: Specific penalties apply to cancellations as defined in our official Cancellation Policy.',
              ]}
            />

            <LegalSection
              title="3. Conduct & Compliance"
              icon={ShieldAlert}
              content={[
                'Professional Integrity: All participants must adhere to the highest standards of professional conduct.',
                'Identity Accuracy: Misrepresentation of identity or performance history results in immediate platform ban.',
                'Confidentiality: Terms of celebrity engagements are strictly confidential and protected by NDA clauses.',
                'Dispute Resolution: Disputes are managed through our internal audit desk before escalation to legal arbitration.',
              ]}
            />

            <div className="bg-slate-900 rounded-3xl p-10 border border-white/5">
              <h3 className="text-lg font-black text-white mb-4 tracking-tight">Force Majeure</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                Both the Platform and the Artist are protected against unforeseen circumstances that
                make a performance impossible. In such cases, we facilitate rescheduling or
                professional refund coordination.
              </p>
              <p className="text-brand-orange font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                Governing Law: Republic of India
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
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
          </div>
          <span className="text-slate-600 text-sm font-medium leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
