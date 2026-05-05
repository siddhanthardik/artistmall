import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/shared/SEO';
import { Briefcase, ArrowRight, Users, Zap, Globe, Heart } from 'lucide-react';

const ROLES = [
  { dept: 'Engineering', title: 'Senior Full-Stack Engineer (MERN)', type: 'Full-time · Remote', tag: 'HIRING' },
  { dept: 'Product', title: 'Product Manager — Marketplace Ops', type: 'Full-time · Mumbai / Remote', tag: 'HIRING' },
  { dept: 'Operations', title: 'Artist Onboarding Specialist', type: 'Full-time · Mumbai', tag: 'HIRING' },
  { dept: 'Sales', title: 'Enterprise Sales Manager — B2B', type: 'Full-time · Delhi / Mumbai', tag: 'HIRING' },
  { dept: 'Design', title: 'Product Designer (UI/UX)', type: 'Contract · Remote', tag: 'OPEN' },
];

const PERKS = [
  { icon: Zap, title: 'Practical Team Culture', desc: 'Move quickly, ship useful features, and support event and artist operations across India.' },
  { icon: Globe, title: 'Remote-First', desc: 'Work from anywhere in India. We trust you to own your output.' },
  { icon: Users, title: 'Small Team, Big Impact', desc: 'Every person on the team has outsized influence. No bureaucracy.' },
  { icon: Heart, title: 'Equity + Market Salary', desc: 'We pay competitively and offer ESOPs for all full-time hires.' },
];

export const Careers: React.FC = () => (
  <div className="min-h-screen bg-slate-900">
    <SEO title="Careers | The Artist Mall - Artist Booking Platform" description="Join The Artist Mall team and help build tools for artist booking operations in India. Open roles in engineering, product, operations, and sales." canonical="https://www.theartistmall.com/careers" />
    <section className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full mb-6">We're Hiring</span>
          <h1 className="text-5xl font-extrabold text-white mb-6">Help Build the Infrastructure <br /><span className="text-gradient">India's Entertainment Industry Needs.</span></h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">We're a small team building something the industry hasn't seen before. If you want to work on real problems with real impact, read on.</p>
        </motion.div>
      </div>
    </section>
    <section className="py-16 bg-slate-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14"><h2 className="text-3xl font-bold text-white mb-3">Open Positions</h2></div>
        <div className="space-y-4">
          {ROLES.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              className="glass-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold-500/30 transition-colors group cursor-pointer">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">{r.dept}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.tag === 'HIRING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>{r.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">{r.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{r.type}</p>
              </div>
              <a href="mailto:careers@theartistmall.com" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium text-sm flex-shrink-0">
                Apply Now <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-3">Why Work Here?</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PERKS.map((p, i) => (
            <div key={i} className="glass-panel p-8 flex gap-5 items-start">
              <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center flex-shrink-0"><p.icon className="w-6 h-6 text-gold-400" /></div>
              <div><h3 className="text-lg font-bold text-white mb-2">{p.title}</h3><p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="py-16 bg-slate-950">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <Briefcase className="w-10 h-10 text-gold-400 mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-white mb-4">Don't See Your Role?</h2>
        <p className="text-slate-400 mb-8">Send us your CV and a note about how you'd contribute. We review applications based on relevant skills, experience, and team needs.</p>
        <a href="mailto:careers@theartistmall.com" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-slate-900 font-bold px-8 py-4 rounded-lg transition-colors">Send Open Application</a>
      </div>
    </section>
  </div>
);


