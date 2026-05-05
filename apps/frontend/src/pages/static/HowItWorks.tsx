import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, CheckCircle2, Calendar, BadgeCheck, Star, ChevronRight, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[2px] w-12 bg-brand-orange"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">How It Works</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-none mb-6 tracking-tighter italic">
            Simple Booking Steps. <br />
            <span className="text-brand-orange not-italic">Professional Trust.</span>
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl font-medium tracking-tight max-w-2xl leading-relaxed">
            See how artist discovery, inquiry handling, and event coordination work on The Artist Mall.
          </p>
        </div>
      </section>

      {/* 2. THE TIMELINE (CORE) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          
          {/* Vertical line for desktop */}
          <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-slate-50 hidden lg:block"></div>
          
          <div className="space-y-40">
            <TimelineStep 
              number={1} 
              icon={Search} 
              title="Discover Artists" 
              description="Browse verified artist profiles or contact our team for help finding suitable options."
              side="left"
              color="orange"
            />
            <TimelineStep 
              number={2} 
              icon={FileText} 
              title="Define Requirements" 
              description="Share your event details, budget, duration, and technical requirements for review."
              side="right"
              color="blue"
            />
            <TimelineStep 
              number={3} 
              icon={Zap} 
              title="Availability Review" 
              description="Our team reviews artist availability and checks the profile information needed for your inquiry."
              side="left"
              color="orange"
            />
            <TimelineStep 
              number={4} 
              icon={BadgeCheck} 
              title="Booking Confirmation" 
              description="Once details are aligned, the booking requirements and commercial terms are documented clearly."
              side="right"
              color="blue"
            />
            <TimelineStep 
              number={5} 
              icon={Calendar} 
              title="Logistics Coordination" 
              description="Our ops desk handles the riders, travel, and on-ground technical coordination with the artist's management team."
              side="left"
              color="orange"
            />
            <TimelineStep 
              number={6} 
              icon={Star} 
              title="Event Follow-Up" 
              description="Our team supports event-day coordination and follows up after the event."
              side="right"
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* 3. TRUST FEATURES */}
      <section className="py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-10 leading-tight">
                Designed for <br />
                Professional Events.
              </h2>
              <div className="space-y-8">
                <TrustFeature 
                  title="Documented Terms" 
                  description="Booking terms and requirements are documented so both client and artist have clear expectations." 
                />
                <TrustFeature 
                  title="Payment Coordination" 
                  description="Commercial steps are coordinated according to the agreed booking process." 
                />
                <TrustFeature 
                  title="Operations Contact" 
                  description="A team member helps coordinate requirements and communication." 
                />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/5 rounded-full translate-x-10 -translate-y-10 transition-transform group-hover:scale-125"></div>
               <BadgeCheck className="w-16 h-16 text-brand-orange mb-8" />
               <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight italic">Our Compliance Standard</h3>
               <p className="text-slate-500 font-medium leading-relaxed mb-10">
                 We review artist profiles before publishing, including identity information, profile media, category details, and technical requirements where available.
               </p>
               <button className="flex items-center gap-3 text-brand-orange font-black uppercase tracking-widest text-xs hover:gap-5 transition-all">
                 Read Our Security Whitepaper <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-40 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-6xl font-black text-slate-900 mb-12 tracking-tighter">Ready to Begin?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Browse Artists
            </button>
            <button className="bg-slate-900 hover:bg-black text-white font-black px-12 py-5 rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

const TimelineStep = ({ number, icon: Icon, title, description, side, color }: any) => {
  const isLeft = side === 'left';
  const colorMap: any = {
    orange: 'bg-orange-50 text-brand-orange border-orange-100 shadow-orange-500/10',
    blue: 'bg-blue-50 text-brand-blue border-blue-100 shadow-blue-500/10'
  };

  return (
    <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-0 relative ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
      
      {/* Content Side */}
      <div className={`flex-1 w-full ${isLeft ? 'lg:text-right lg:pr-24' : 'lg:text-left lg:pl-24'}`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className={`inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center border font-black ${colorMap[color]}`}>{number}</span>
            <span className="text-slate-400">Phase {number}</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Center Point */}
      <div className="absolute left-[50%] -translate-x-[50%] hidden lg:flex items-center justify-center">
        <div className="w-4 h-4 bg-white border-4 border-slate-900 rounded-full z-10"></div>
      </div>

      {/* Visual Side */}
      <div className="flex-1 w-full">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className={`aspect-video rounded-[32px] bg-slate-100 border border-slate-200 overflow-hidden shadow-2xl ${isLeft ? 'lg:ml-24' : 'lg:mr-24'}`}
         >
           <div className="w-full h-full flex items-center justify-center">
              <Icon className={`w-24 h-24 ${isLeft ? 'text-brand-orange' : 'text-brand-blue'} opacity-20`} />
           </div>
         </motion.div>
      </div>

    </div>
  );
};

const TrustFeature = ({ title, description }: any) => (
  <div className="flex items-start gap-5 group">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-brand-orange group-hover:bg-orange-50 transition-all shadow-sm shrink-0">
      <CheckCircle2 className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-slate-900 font-bold text-lg mb-1 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);

