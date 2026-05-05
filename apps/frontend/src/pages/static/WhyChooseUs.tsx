import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Briefcase, BadgeCheck, Lock } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[2px] w-12 bg-brand-orange"></div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Why Choose Us
            </span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-none mb-6 tracking-tighter italic">
            Engineered for <br />
            <span className="text-brand-orange not-italic">Professional Trust.</span>
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl font-medium tracking-tight max-w-2xl leading-relaxed">
            The Artist Mall gives event teams a clearer way to review artist profiles, send booking
            inquiries, and coordinate requirements.
          </p>
        </div>
      </section>

      {/* 2. THE THREE PILLARS OF TRUST */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureBox
              icon={ShieldCheck}
              title="Identity & Performance Verification"
              description="Artist profiles are reviewed for identity, category, location, media, and booking information before they are published."
              color="orange"
            />
            <FeatureBox
              icon={Lock}
              title="Structured Process"
              description="Booking inquiries are handled through a consistent process so requirements, availability, and next steps are easy to track."
              color="blue"
            />
            <FeatureBox
              icon={Briefcase}
              title="Operational Support"
              description="We help coordinate event requirements, artist information, technical details, and follow-up communication."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* 3. COMPARISON SECTION */}
      <section className="py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="bg-white border border-slate-200 rounded-[48px] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Traditional Agency */}
              <div className="p-16 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
                  Traditional Booking
                </h3>
                <div className="space-y-8">
                  <ComparisonItem label="Unverified talent quality" negative />
                  <ComparisonItem label="Hidden commissions & fees" negative />
                  <ComparisonItem label="Informal, risky agreements" negative />
                  <ComparisonItem label="Unreliable rider management" negative />
                  <ComparisonItem label="Opaque availability tracking" negative />
                </div>
              </div>

              {/* The Artist Mall */}
              <div className="p-16 bg-white relative">
                <div className="absolute top-0 right-0 p-8">
                  <div className="bg-orange-50 text-brand-orange px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-sm">
                    Our Standard
                  </div>
                </div>
                <h3 className="text-xs font-black text-brand-blue uppercase tracking-[0.3em] mb-12">
                  The Artist Mall Advantage
                </h3>
                <div className="space-y-8">
                  <ComparisonItem label="Verified artist profiles" />
                  <ComparisonItem label="Clear pricing information" />
                  <ComparisonItem label="Structured inquiry handling" />
                  <ComparisonItem label="Operations coordination" />
                  <ComparisonItem label="Availability follow-up" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PARTNERSHIPS */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
                Built for <br />
                Event Teams.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10">
                From corporate events to weddings and private functions, our process helps clients
                find suitable artists and coordinate event requirements.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-3xl font-black text-slate-900">₹150Cr+</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Bookings Supported
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-black text-slate-900">4.9/5</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Client Rating
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Mock Partner Logos / Elements */}
              <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-default">
                <span className="text-xs font-black text-slate-300">CORPORATE HUB</span>
              </div>
              <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-default mt-8">
                <span className="text-xs font-black text-slate-300">EVENT PLANNERS</span>
              </div>
              <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-default">
                <span className="text-xs font-black text-slate-300">MEDIA AGENCIES</span>
              </div>
              <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-default mt-8">
                <span className="text-xs font-black text-slate-300">GLOBAL SUMMITS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <BadgeCheck className="w-20 h-20 text-brand-orange mx-auto mb-10" />
          <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">
            Use a Clear Booking Process.
          </h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed mb-16">
            Browse verified artist profiles and contact our team for booking support.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Browse Artists
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

const FeatureBox = ({ icon: Icon, title, description, color }: any) => {
  const colorMap: any = {
    orange: 'text-brand-orange bg-orange-50 border-orange-100',
    blue: 'text-brand-blue bg-blue-50 border-blue-100',
    green: 'text-brand-success bg-green-50 border-green-100',
  };
  return (
    <div className="bg-white border border-slate-100 rounded-[40px] p-12 hover:shadow-2xl hover:-translate-y-2 transition-all shadow-sm group">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border transition-transform group-hover:scale-110 ${colorMap[color]}`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
        {title}
      </h3>
      <p className="text-slate-500 text-base font-medium leading-relaxed">{description}</p>
    </div>
  );
};

const ComparisonItem = ({ label, negative = false }: any) => (
  <div className="flex items-center gap-4">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${negative ? 'bg-red-50 text-red-400' : 'bg-green-50 text-brand-success'}`}
    >
      {negative ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      )}
    </div>
    <span
      className={`text-sm font-bold ${negative ? 'text-slate-400' : 'text-slate-900'} tracking-tight`}
    >
      {label}
    </span>
  </div>
);
