import React from 'react';
import { ShieldAlert, Info, Scale, CheckCircle2 } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HEADER SECTION */}
      <section className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-slate-400"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Transparency Notice</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Disclaimer</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Effective Date: April 25, 2026</p>
        </div>
      </section>

      {/* 2. CONTENT SECTION */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 md:p-20 shadow-sm space-y-16">
            
            <div className="prose prose-slate max-w-none">
              <div className="flex items-center gap-4 mb-8">
                <ShieldAlert className="w-8 h-8 text-slate-400" />
                <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">Scope of Responsibility</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                The Artist Mall provides a secure platform and support service for professional artist booking. While we maintain verification processes, users should acknowledge the following legal boundaries of the platform's responsibility.
              </p>
            </div>

            <LegalSection 
              title="1. Artistic Performance" 
              icon={Info}
              content={[
                "Subjective Experience: We do not guarantee the 'artistic quality' or 'creative satisfaction' of a performance, as these are subjective metrics.",
                "Artist Conduct: While we review professional history, we are not liable for individual artist behavior outside the scope of the booking agreement.",
                "Content Accuracy: Artist short-bios and promotional media are provided by the talent management and represent their professional profile."
              ]}
            />

            <LegalSection 
              title="2. Platform Availability" 
              icon={Scale}
              content={[
                "System Uptime: We strive for 99.9% uptime but are not liable for temporary platform disruptions during peak booking cycles.",
                "External Links: The platform may contain links to artist social media or external portfolios; we do not endorse or control this external content.",
                "Real-time Data: Availability status is updated frequently but remains subject to final confirmation by our booking team."
              ]}
            />

            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
               <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Professional Advice</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                 Information provided on The Artist Mall regarding event coordination and artist management is for general reference only and does not constitute legal or professional event-planning advice.
               </p>
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                 Legal Contact: salestheartistmall@gmail.com
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
             <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-slate-600 text-sm font-medium leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-brand-blue"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Digital Compliance</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Cookie Policy</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Effective Date: April 25, 2026</p>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 md:p-20 shadow-sm space-y-12">
             <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 font-medium leading-relaxed text-lg">
                  The Artist Mall uses cookies to improve your browsing experience and facilitate secure talent bookings. By continuing to use our platform, you agree to our use of essential and analytical cookies.
                </p>
             </div>
             <LegalSection 
               title="Essential Cookies" 
               icon={ShieldAlert}
               content={[
                 "Authentication: Used to identify you once you log in to your secure operational dashboard.",
                 "Security: Protecting against unauthorized access and transactional fraud.",
                 "Preference: Remembering your preferred category filters and search settings."
               ]}
             />
          </div>
        </div>
      </section>
    </div>
  );
};
