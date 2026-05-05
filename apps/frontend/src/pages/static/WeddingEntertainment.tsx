import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, BadgeCheck, ChevronRight, Sparkles } from 'lucide-react';

export const WeddingEntertainment: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[2px] w-12 bg-brand-orange"></div>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Wedding Entertainment</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] mb-10 tracking-tighter"
            >
              The Soundtrack <br />
              to your <span className="text-brand-orange italic">Celebration.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium tracking-tight mb-12"
            >
              Find singers, DJs, live bands, anchors, and performers for weddings, sangeets, receptions, and destination events.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs">
                Inquire For Wedding
              </button>
              <button className="bg-slate-900 text-white font-black px-12 py-5 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-xs">
                Browse Artists
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WEDDING SPECIALTIES */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <WeddingSpecialtyCard 
              title="Sangeet Performances" 
              description="Bollywood singers, anchors, and dance performers for wedding functions."
              icon={Music}
            />
            <WeddingSpecialtyCard 
              title="Receptions" 
              description="Live bands, instrumental ensembles, and performers for wedding dinners and receptions."
              icon={Sparkles}
            />
            <WeddingSpecialtyCard 
              title="Intimate Ceremonies" 
              description="Sufi ensembles, traditional folk singers, and soulful instrumentalists for a spiritually resonant atmosphere."
              icon={Heart}
            />
          </div>
        </div>
      </section>

      {/* 3. WHY THE ARTIST MALL FOR WEDDINGS */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-12">
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                 Reliability Meets <br />
                 Artist Coordination.
               </h2>
               <div className="space-y-8">
                  <ValuePoint title="Confirmed Requirements" description="Booking requirements are documented before the event." />
                  <ValuePoint title="Logistics Support" description="Coordination support for travel, technical riders, and event-day requirements." />
                  <ValuePoint title="Verified Artist Profiles" description="Published artist profiles are reviewed before appearing in the directory." />
               </div>
            </div>
            <div className="flex-1">
               <div className="aspect-square bg-slate-100 rounded-[48px] overflow-hidden shadow-2xl relative border-8 border-white">
                  <img 
                    src="/images/wedding_focus.png" 
                    alt="Wedding event" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
                     <p className="text-3xl font-black text-brand-orange mb-1">500+</p>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-tight">Destination <br />Weddings Supported</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESTINATION WEDDINGS HEATMAP */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
           <div className="text-center mb-24">
             <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">Destination Support</h2>
             <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-xs">Artist coordination for major wedding destinations</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <DestinationItem city="Udaipur" events="120+" />
              <DestinationItem city="Dubai" events="85+" />
              <DestinationItem city="Goa" events="150+" />
              <DestinationItem city="Jaipur" events="95+" />
              <DestinationItem city="Istanbul" events="40+" />
              <DestinationItem city="Bali" events="30+" />
              <DestinationItem city="London" events="25+" />
              <DestinationItem city="Phuket" events="35+" />
           </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-20 h-20 text-brand-orange mx-auto mb-10 opacity-20" />
          <h2 className="text-6xl font-black text-slate-900 mb-12 tracking-tighter italic">Plan Your Wedding Entertainment.</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Connect With Wedding Desk
            </button>
            <button className="bg-slate-900 hover:bg-black text-white font-black px-12 py-5 rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Download Wedding Guide
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

const WeddingSpecialtyCard = ({ title, description, icon: Icon }: any) => (
  <div className="bg-white border border-slate-200 rounded-[40px] p-12 hover:shadow-2xl hover:-translate-y-2 transition-all group shadow-sm">
    <div className="w-16 h-16 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center mb-10 border border-orange-100 transition-transform group-hover:scale-110">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-base font-medium leading-relaxed">{description}</p>
    <div className="mt-8 flex items-center gap-2 text-brand-orange font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all cursor-pointer">
      Inquire Now <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);

const ValuePoint = ({ title, description }: any) => (
  <div className="flex items-start gap-5 group">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-brand-orange group-hover:bg-orange-50 transition-all shadow-sm shrink-0">
      <BadgeCheck className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-slate-900 font-bold text-xl mb-1 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-base font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);

const DestinationItem = ({ city, events }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-default">
    <p className="text-white font-black text-xl mb-1">{city}</p>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{events} Events</p>
  </div>
);

