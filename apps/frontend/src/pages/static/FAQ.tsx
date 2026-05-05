import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageSquare, Star, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const FAQ_DATA = [
    {
      category: 'Artist Booking',
      icon: Calendar,
      questions: [
        { q: "How do I book an artist?", a: "Browse verified artist profiles, select an artist, and submit a booking inquiry. Our team reviews availability and shares the next steps." },
        { q: "Can I book artists for international events?", a: "Yes. The Artist Mall can help coordinate artist inquiries for events outside India, including travel and event requirements where applicable." },
        { q: "Is there a minimum notice period for bookings?", a: "We recommend booking 30-90 days in advance. Some bookings may be possible with shorter notice depending on artist availability." }
      ]
    },
    {
      category: 'Verification & Trust',
      icon: ShieldCheck,
      questions: [
        { q: "How do you verify the artists?", a: "We review legal identity, profile information, past performance records, and technical requirements before an artist is listed." },
        { q: "What is the Artist Mall Escrow system?", a: "Event budgets can be held in a secure escrow account. Funds are released to the artist after the agreed booking terms are met." }
      ]
    },
    {
      category: 'Pricing & Payments',
      icon: DollarSign,
      questions: [
        { q: "Are the prices on the platform final?", a: "Platform prices represent the professional standard for the talent. Final quotes may vary based on event duration, travel requirements, and specific technical riders requested." },
        { q: "Do you offer GST-compliant billing?", a: "Yes. Bookings through The Artist Mall can be processed with GST-compliant invoices suitable for corporate procurement." }
      ]
    },
    {
      category: 'Celebrity & Special Requests',
      icon: Star,
      questions: [
        { q: "How do I book a Bollywood celebrity?", a: "Celebrity booking inquiries require a detailed event brief before availability and commercial discussions can begin." },
        { q: "Can I request a custom performance set?", a: "Yes. Some featured artists can discuss custom setlists and performance durations based on the event brief." }
      ]
    }
  ];

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
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">FAQ</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-none mb-6 tracking-tighter">
            Frequently Asked <br />
            <span className="text-brand-orange italic">Questions.</span>
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl font-medium tracking-tight max-w-2xl leading-relaxed">
            Clear answers about artist booking, verification, pricing, and event coordination.
          </p>
        </div>
      </section>

      {/* 2. FAQ INTERFACE */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-20">
            {FAQ_DATA.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-brand-orange border border-slate-100">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{cat.category}</h2>
                </div>
                
                <div className="space-y-4">
                  {cat.questions.map((item, qIdx) => {
                    const globalIdx = catIdx * 10 + qIdx;
                    const isOpen = openIndex === globalIdx;
                    return (
                      <div 
                        key={qIdx} 
                        className={`border rounded-[32px] overflow-hidden transition-all duration-500 ${isOpen ? 'bg-slate-50 border-slate-200 shadow-lg' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                        <button 
                          onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                          className="w-full px-10 py-8 flex items-center justify-between text-left group"
                        >
                          <span className={`text-lg font-black tracking-tight transition-colors ${isOpen ? 'text-brand-orange' : 'text-slate-900 group-hover:text-brand-orange'}`}>{item.q}</span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-brand-orange text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                             {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                              <div className="px-10 pb-10">
                                <p className="text-slate-600 text-base leading-relaxed font-medium pt-2 border-t border-slate-200/50">
                                  {item.a}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STILL HAVE QUESTIONS */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <div className="bg-white border border-slate-200 rounded-[48px] p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full translate-x-10 -translate-y-10"></div>
              <MessageSquare className="w-16 h-16 text-brand-orange mx-auto mb-8" />
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">Still have specialized requirements?</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">
                Our team is available for event booking questions, artist availability, and celebrity coordination.
              </p>
              <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs active:scale-[0.98]">
                 Contact Our Team
              </button>
           </div>
        </div>
      </section>

    </div>
  );
};
