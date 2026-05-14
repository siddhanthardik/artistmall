import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '../../components/shared/Breadcrumbs';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-4">
        <Breadcrumbs />
      </div>
      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-24 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-8xl font-bold text-neutral-content tracking-tighter leading-tight mb-8">
              Get in <span className="text-brand-primary">Touch</span>
            </h1>
            <p className="text-neutral-content/60 text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
              Whether you're planning a gala or a private exhibition, we help you find the perfect
              artist to transform your vision into an unforgettable reality.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="rounded-[40px] overflow-hidden shadow-2xl h-[450px]"
          >
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200"
              alt="Luxury Lounge"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. FORM & CONTACT DETAILS */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white p-12 rounded-[48px] shadow-sm border border-surface-container"
            >
              <h2 className="text-3xl font-bold text-neutral-content tracking-tight mb-10">
                Send a Message
              </h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="NAME" placeholder="Your full name" />
                  <FormInput label="EMAIL" placeholder="email@example.com" type="email" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="PHONE" placeholder="+91 00000 00000" />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.2em] ml-1">
                      EVENT TYPE
                    </label>
                    <select className="w-full bg-[#f8fafc] border border-surface-container rounded-2xl px-6 py-5 text-sm font-bold text-neutral-content focus:outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer">
                      <option>Exhibition</option>
                      <option>Corporate Gala</option>
                      <option>Wedding</option>
                      <option>Private Party</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.2em] ml-1">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can our concierge help you?"
                    className="w-full bg-[#f8fafc] border border-surface-container rounded-3xl p-6 text-sm font-bold text-neutral-content placeholder:text-neutral-content/20 focus:outline-none focus:border-brand-primary transition-all resize-none"
                  ></textarea>
                </div>
                <button className="w-full bg-brand-primary hover:bg-brand-primaryContainer text-white font-bold py-6 rounded-2xl shadow-2xl shadow-brand-primary/20 transition-all flex items-center justify-center gap-3 group">
                  Send Message{' '}
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Details Side */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-10">
                <h3 className="text-2xl font-bold text-neutral-content tracking-tight">
                  Contact Details
                </h3>
                <div className="space-y-8">
                  <DetailItem
                    icon={MapPin}
                    title="Our Atelier"
                    value="A-208, Dwarka Sector-28, New Delhi - 110077"
                    iconBg="bg-[#0ea5e9]"
                  />
                  <DetailItem
                    icon={Mail}
                    title="Email Concierge"
                    value="concierge@theartistmall.com"
                    iconBg="bg-[#0ea5e9]"
                    isLink
                    link={`mailto:concierge@theartistmall.com`}
                  />
                  <DetailItem
                    icon={Phone}
                    title="Hotline"
                    value="+91 8595767884"
                    iconBg="bg-[#0ea5e9]"
                    isLink
                    link={`tel:+918595767884`}
                  />
                </div>
              </div>

              {/* Map Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-[40px] overflow-hidden border border-surface-container shadow-sm group"
              >
                <div className="relative h-64 bg-[#e5e7eb] flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                    alt="Map Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute flex flex-col items-center">
                    <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-2xl mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <p className="text-white font-bold text-lg tracking-tight">
                      Visit Us in New Delhi
                    </p>
                    <button className="mt-4 bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-xs font-bold hover:bg-white/40 transition-all flex items-center gap-2">
                      Open in Google Maps <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-brand-primary rounded-[56px] p-20 md:p-32 text-center space-y-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-tight">
                Ready to elevate your event?
              </h2>
              <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Our curators are standing by to help you select the perfect artistic talent for your
                specific needs.
              </p>
            </div>

            <div className="relative z-10 flex justify-center">
              <button className="bg-[#1a1a1a] hover:bg-black text-white font-bold px-12 py-5 rounded-2xl shadow-2xl transition-all uppercase tracking-widest text-xs">
                Talk to an Expert
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const FormInput = ({ label, placeholder, type = 'text' }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-[#f8fafc] border border-surface-container rounded-2xl px-6 py-5 text-sm font-bold text-neutral-content placeholder:text-neutral-content/20 focus:outline-none focus:border-brand-primary transition-all"
    />
  </div>
);

const DetailItem = ({ icon: Icon, title, value, iconBg, isLink, link }: any) => (
  <div className="flex items-start gap-6">
    <div
      className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center text-white shrink-0`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-bold text-neutral-content tracking-tight">{title}</p>
      {isLink ? (
        <a href={link} className="text-brand-secondary font-bold text-sm hover:underline">
          {value}
        </a>
      ) : (
        <p className="text-neutral-content/40 font-medium text-sm leading-relaxed max-w-[200px]">
          {value}
        </p>
      )}
    </div>
  </div>
);
