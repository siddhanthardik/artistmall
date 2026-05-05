import React from 'react';
import { XCircle, ShieldAlert, Clock, Info, CheckCircle2 } from 'lucide-react';

export const BookingPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HEADER SECTION */}
      <section className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-brand-error"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Booking Protocols
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
            Cancellation Policy
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
                <XCircle className="w-8 h-8 text-brand-error" />
                <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">
                  Structured Terms
                </h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                As we deal with high-demand professional talent, cancellations impact artist
                schedules and logistical commitments. Our cancellation policy ensures that all
                parties are compensated fairly for time and resources allocated.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PolicyTier
                title="60+ Days Before Event"
                penalty="15% Retention"
                description="Full refund of balance excluding platform service fees and initial processing deposits."
              />
              <PolicyTier
                title="30-60 Days Before Event"
                penalty="30% Retention"
                description="A percentage of the artist fee is retained to cover opportunity costs for the blocked date."
              />
              <PolicyTier
                title="15-30 Days Before Event"
                penalty="60% Retention"
                description="Significant retention as finding replacement bookings becomes statistically improbable."
              />
              <PolicyTier
                title="Less than 15 Days"
                penalty="100% Retention"
                description="No refunds applicable as the artist has finalized travel and technical preparations."
              />
            </div>

            <LegalSection
              title="Artist-Led Cancellations"
              icon={ShieldAlert}
              content={[
                'Full Restitution: If an artist cancels for non-professional reasons, a 100% refund is processed immediately.',
                'Force Majeure Events: Artist illness or extreme travel disruption is treated under our professional contingency protocols.',
                'Replacement Service: We offer suitable alternative artist options based on the original booking requirements.',
              ]}
            />

            <LegalSection
              title="How to Cancel"
              icon={Clock}
              content={[
                'All cancellation requests must be submitted in writing to salestheartistmall@gmail.com.',
                "The 'Effective Time' of cancellation is determined by the timestamp of the written notification.",
                'Verbal cancellations or communications via social channels are not recognized as legally binding.',
              ]}
            />

            <div className="bg-red-50 rounded-3xl p-10 border border-red-100 flex items-start gap-6">
              <div className="shrink-0 pt-1">
                <Info className="w-6 h-6 text-brand-error" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">
                  Force Majeure Exceptions
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  National emergencies, government-mandated lockdowns, and acts of god are reviewed
                  on a case-by-case basis. Our priority in these scenarios is to facilitate a fair
                  outcome for both the host and the talent.
                </p>
              </div>
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
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-error" />
          </div>
          <span className="text-slate-600 text-sm font-medium leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PolicyTier = ({ title, penalty, description }: any) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
    <p className="text-2xl font-black text-brand-error mb-4">{penalty}</p>
    <p className="text-slate-500 text-xs font-medium leading-relaxed">{description}</p>
  </div>
);
