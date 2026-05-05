import React from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../../components/shared/SEO';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowRight } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Rohit Kapoor', role: 'VP Marketing, Reliance Retail', quote: 'We used to spend 3 weeks coordinating a single celebrity booking. With The Artist Mall, our last Diwali event was locked in 4 days — formal contract included. It\'s a completely different standard.', rating: 5, event: 'Pan-India Diwali Campaign, 12 cities' },
  { name: 'Meghna Sinha', role: 'Founder, Wedding Planning Firm', quote: 'Our wedding clients expect a reliable process. The Artist Mall\'s verified artist profiles gave us instant confidence. The Deal Room eliminated all the back-and-forth WhatsApp chaos we used to manage.', rating: 5, event: 'Destination Wedding, Udaipur' },
  { name: 'Arjun Tiwari', role: 'Events Director, PepsiCo India', quote: 'We booked 8 artists across 4 quarterly events through The Artist Mall. The commission structure is transparent and the platform\'s audit trail is exactly what our finance team requires.', rating: 5, event: 'Q1–Q4 Corporate Events, 2025' },
  { name: 'Sunita Bose', role: 'CEO, Wavelength Entertainment', quote: 'As a management company, this platform is a genuine business upgrade. Our artists get real corporate inquiries, not time-wasters. The verification system protects everyone.', rating: 5, event: 'Artist Profiles: 22 verified artists' },
  { name: 'Karan Mehta', role: 'Head of Experiences, HDFC Bank', quote: 'For a regulated institution like ours, the formal contracting flow and KYC compliance was non-negotiable. The Artist Mall was the only platform that met our procurement standards.', rating: 5, event: 'Annual Employee Awards, Mumbai' },
  { name: 'Priya Gupta', role: 'Founder, Sunburn Festival', quote: 'We\'ve booked 30+ artists through the platform over two festival seasons. The transparency in pricing and the Deal Room make it our first stop for every lineup discussion.', rating: 5, event: 'Sunburn Arena, Pune & Delhi' },
];

export const Testimonials: React.FC = () => (
  <div className="min-h-screen bg-slate-900">
    <SEO title="Testimonials | The Artist Mall — Trusted by India's Top Agencies" description="Read what India's leading corporate event planners, brand agencies, and artist management companies say about The Artist Mall." canonical="https://www.theartistmall.com/testimonials" />
    <section className="pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block text-xs font-bold tracking-widest text-gold-400 uppercase bg-gold-400/10 border border-gold-400/20 px-4 py-2 rounded-full mb-6">Client Voices</span>
          <h1 className="text-5xl font-extrabold text-white mb-4">Trusted by India's Best.</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">850+ companies. ₹120 Cr+ facilitated. Here's what they say.</p>
        </motion.div>
      </div>
    </section>
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="glass-panel p-8 flex flex-col hover:border-gold-500/30 transition-colors group">
            <Quote className="w-8 h-8 text-gold-500/30 mb-5 group-hover:text-gold-500/60 transition-colors" />
            <p className="text-slate-300 leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>
            <div className="flex gap-1 mb-4">{Array.from({length: t.rating}).map((_, j) => <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />)}</div>
            <div className="border-t border-slate-700/50 pt-4">
              <p className="font-bold text-white">{t.name}</p>
              <p className="text-sm text-slate-400 mb-2">{t.role}</p>
              <p className="text-xs text-gold-400/60 bg-gold-400/5 px-2 py-1 rounded border border-gold-400/10 inline-block">{t.event}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    <section className="py-16 bg-slate-950">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Join These Companies</h2>
        <p className="text-slate-400 mb-10">Start booking verified artists with the same confidence and speed.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-slate-900 font-bold px-10 py-4 rounded-lg transition-colors">Contact Our Team <ArrowRight className="w-5 h-5" /></Link>
      </div>
    </section>
  </div>
);

