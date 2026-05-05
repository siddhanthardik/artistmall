import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Award, Lock, Crown, ChevronRight, BadgeCheck } from 'lucide-react';

export const CelebrityBooking: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[2px] w-12 bg-brand-orange"></div>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Celebrity Booking</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white leading-[1.05] mb-10 tracking-tighter"
            >
              Direct Access <br />
              for <span className="text-brand-orange italic">Your Event.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium tracking-tight mb-12"
            >
              Send inquiries for celebrity appearances, live performances, and brand engagements through a structured booking process.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
                Request Celebrity Quote
              </button>
              <button className="bg-white/10 text-white font-black px-12 py-5 rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest text-xs border border-white/10 active:scale-[0.98]">
                View Artists
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CELEBRITY SUITE */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-24">
             <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Engagement Options</h2>
             <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-xs">Professional coordination for high-impact presence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ModelCard 
              icon={Crown} 
              title="Guest Appearances" 
              description="Guest appearances for store launches, corporate events, and brand activations." 
            />
            <ModelCard 
              icon={Zap} 
              title="Live Performances" 
              description="Musical acts and theatrical performances by established artists." 
            />
            <ModelCard 
              icon={Award} 
              title="Brand Endorsements" 
              description="Artist-led brand campaigns and endorsement inquiries with clear scope, availability, and commercial terms." 
            />
          </div>
        </div>
      </section>

      {/* 3. PROFESSIONAL COMPLIANCE (TRUST) */}
      <section className="py-32 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1">
               <div className="aspect-[4/5] rounded-[48px] bg-slate-900 overflow-hidden shadow-2xl relative border-8 border-white">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                     <BadgeCheck className="w-16 h-16 text-brand-orange mb-6" />
                     <p className="text-3xl font-black text-white tracking-tight italic">"Transparency is our standard."</p>
                  </div>
                  <img src="/images/celebrity_compliance.png" alt="Celebrity Management" className="w-full h-full object-cover opacity-60" />
               </div>
            </div>
            <div className="flex-1 space-y-12">
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                 Booking Coordination. <br />
                 Clear Communication.
               </h2>
               <div className="space-y-8">
                  <TrustPoint 
                    title="Management Coordination" 
                    description="We coordinate with celebrity management offices to review availability, pricing, and event requirements." 
                  />
                  <TrustPoint 
                    title="Event Logistics" 
                    description="Our team helps coordinate security details, travel requirements, and technical riders." 
                  />
                  <TrustPoint 
                    title="Clear Agreements" 
                    description="Booking agreements define deliverables, payment terms, and event responsibilities for all parties." 
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY METRICS */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center">
                 <p className="text-5xl font-black text-slate-900 mb-2">150+</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Artist Profiles</p>
              </div>
              <div className="text-center">
                 <p className="text-5xl font-black text-slate-900 mb-2">100%</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management Coordination</p>
              </div>
              <div className="text-center">
                 <p className="text-5xl font-black text-slate-900 mb-2">24h</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quote Turnaround</p>
              </div>
              <div className="text-center">
                 <p className="text-5xl font-black text-slate-900 mb-2">₹500Cr+</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Volume</p>
              </div>
           </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Star className="w-20 h-20 text-brand-orange mx-auto mb-10 opacity-30" />
          <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">Plan a Celebrity Booking.</h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed mb-16">
            Contact our team for availability, requirements, and booking next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Request Confidential Quote
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-900 font-black px-12 py-5 rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

const ModelCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-white border border-slate-100 rounded-[40px] p-12 hover:shadow-2xl hover:-translate-y-2 transition-all group shadow-sm">
    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-10 border border-slate-100 transition-transform group-hover:scale-110 group-hover:bg-orange-50 group-hover:text-brand-orange">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{title}</h3>
    <p className="text-slate-500 text-base font-medium leading-relaxed mb-8">{description}</p>
    <div className="flex items-center gap-2 text-brand-orange font-black text-[10px] uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
      View Artists <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);

const TrustPoint = ({ title, description }: any) => (
  <div className="flex items-start gap-6 group">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-brand-orange group-hover:bg-orange-50 transition-all border border-slate-100 shadow-sm shrink-0">
      <Lock className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-slate-900 font-bold text-xl mb-1 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-base font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);
