import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, Zap, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '../../utils/constants';

export const CorporateSolutions: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-[2px] w-12 bg-brand-blue"></div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                  Enterprise Grade
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] mb-10 tracking-tighter"
              >
                Entertainment <br />
                for <span className="text-brand-blue">Corporate Teams.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 text-xl leading-relaxed max-w-xl font-medium tracking-tight mb-12"
              >
                The Artist Mall helps corporate teams find artists for brand launches, annual
                events, employee programs, and client gatherings.
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-brand-blue hover:bg-blue-700 text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs">
                  Request Proposals
                </button>
                <button className="bg-white border border-slate-200 text-slate-900 font-black px-12 py-5 rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
                  View Artists
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/images/corporate_hero.png"
                  alt="Corporate Event"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 bg-white rounded-[32px] shadow-2xl p-10 border border-slate-100 hidden md:block">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue border border-blue-100">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">500+</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Corporates Served
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-success" />
                    <span className="text-xs font-bold text-slate-600">GST Compliant Billing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-success" />
                    <span className="text-xs font-bold text-slate-600">Procurement Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOLUTION CATEGORIES */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
              Corporate Event Support
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-xs">
              Tailored for corporate requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <SolutionCard
              title="Brand Launches"
              description="Artist options for product reveals, launch events, and customer-facing programs."
              icon={Zap}
            />
            <SolutionCard
              title="Annual Summits"
              description="Professional anchors, motivational speakers, and evening performers who align with corporate values and event themes."
              icon={Award}
            />
            <SolutionCard
              title="Networking Events"
              description="Live bands, instrumentalists, and performers for business dinners and client gatherings."
              icon={Star}
            />
          </div>
        </div>
      </section>

      {/* 3. CORPORATE COMPLIANCE */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="bg-slate-900 rounded-[48px] p-16 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-20 shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-blue/20 via-transparent to-transparent"></div>

            <div className="flex-1 relative z-10">
              <h2 className="text-5xl font-black text-white mb-10 tracking-tighter leading-tight">
                Reliable Coordination. <br />
                Clear Documentation.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <ComplianceItem
                  title="Procurement Integration"
                  description="We align with your corporate procurement cycles and vendor onboarding requirements."
                />
                <ComplianceItem
                  title="Professional Billing"
                  description="Standardized invoices with full GST compliance and detailed cost breakdowns."
                />
                <ComplianceItem
                  title="Risk Management"
                  description="Comprehensive artist agreements and force majeure protection for every booking."
                />
                <ComplianceItem
                  title="Logistical Liaison"
                  description="Dedicated account managers to coordinate with your internal event teams."
                />
              </div>
            </div>

            <div className="flex-none w-full lg:w-[400px] relative z-10">
              <div className="bg-white rounded-[40px] p-10 shadow-2xl">
                <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight italic">
                  Our Service Promise
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  "Our corporate desk helps teams coordinate artist requirements, documentation, and
                  event timelines."
                </p>
                <div className="pt-8 border-t border-slate-100">
                  <p className="text-brand-blue font-black text-xs uppercase tracking-widest mb-2">
                    Speak To Our B2B Team
                  </p>
                  <a
                    href={`tel:+91${CONTACT_INFO.PHONE}`}
                    className="text-slate-900 font-black text-lg hover:text-brand-blue transition-colors"
                  >
                    +91 {CONTACT_INFO.PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl font-black text-slate-900 mb-12 tracking-tighter">
            Plan Your Next Event.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-brand-blue hover:bg-blue-700 text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Contact Corporate Desk
            </button>
            <button className="bg-slate-900 hover:bg-black text-white font-black px-12 py-5 rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
              Download Brochure
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const SolutionCard = ({ title, description, icon: Icon }: any) => (
  <div className="bg-white border border-slate-200 rounded-[40px] p-12 hover:shadow-2xl hover:-translate-y-2 transition-all group shadow-sm">
    <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-10 border border-blue-100 transition-transform group-hover:scale-110">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-base font-medium leading-relaxed">{description}</p>
    <div className="mt-8 flex items-center gap-2 text-brand-blue font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all cursor-pointer">
      Learn More <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);

const ComplianceItem = ({ title, description }: any) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-blue border border-white/10 shrink-0">
      <CheckCircle2 className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-white font-bold text-lg mb-1 tracking-tight">{title}</h4>
      <p className="text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);
