import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Eye, Zap, Layers, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/shared/Breadcrumbs';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us | The Artist Mall';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Learn about The Artist Mall — a modern artist booking and entertainment platform powered by Nirala Entertainment Pvt Ltd, connecting brands, events, and audiences with premium talent across India.'
      );
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumbs ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-surface-container py-6 pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Breadcrumbs />
        </div>
      </div>

      {/* ─── Section 1: Hero Redesign ─────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[550px] w-full overflow-hidden flex items-center">
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000"
            alt="Entertainment Experience"
            className="w-full h-full object-cover"
          />
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 backdrop-blur-md border border-brand-primary/20 text-brand-primary text-[10px] font-black px-4 py-2 rounded-full tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              Premium Entertainment Ecosystem
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1]">
              India’s Trusted Artist Booking <br className="hidden md:block" />
              & Entertainment Platform
            </h1>

            <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Connecting world-class artists, live performers, celebrities, and entertainment
              experiences with brands, weddings, corporate events, colleges, and celebrations across
              India.
            </p>

            <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">
              The Artist Mall simplifies artist discovery, talent booking, and entertainment
              management through a modern digital experience backed by industry expertise and
              trusted relationships.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/artists"
                className="bg-brand-primary hover:bg-brand-primaryContainer text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-2xl shadow-brand-primary/20 active:scale-95"
              >
                Browse Artists
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Section 2: About Story Section ────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-brand-primary text-xs font-black uppercase tracking-[0.3em]">
                  The Brand Story
                </h2>
                <h3 className="text-3xl md:text-5xl font-bold text-neutral-content tracking-tighter leading-tight">
                  Built For Modern <br />
                  Entertainment Experiences
                </h3>
              </div>

              <div className="space-y-6 text-neutral-content/60 text-lg leading-relaxed font-medium">
                <p>
                  The Artist Mall was created to simplify the way artists, performers, and event
                  organisers connect. From celebrity performances and live concerts to weddings,
                  private celebrations, brand activations, and corporate entertainment, we help
                  clients discover and book verified talent with confidence.
                </p>
                <p className="bg-[#F8FAFC] p-8 rounded-3xl border-l-4 border-brand-primary text-neutral-content italic">
                  "As a part of the Nirala Entertainment Pvt Ltd group, The Artist Mall combines
                  creative industry expertise with technology-driven talent discovery to build a
                  trusted entertainment ecosystem for artists, brands, and event organisers."
                </p>
                <p>
                  Our platform focuses on transparency, premium artist representation, seamless
                  coordination, and curated entertainment experiences designed for modern India.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200"
                  alt="Live Concert"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Decorative Elements */}
              <div className="absolute -bottom-8 -right-8 bg-brand-secondary text-white p-10 rounded-[32px] shadow-2xl hidden md:block">
                <TrendingUp className="w-8 h-8 mb-4 text-white/50" />
                <p className="text-4xl font-bold tracking-tighter">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Verified Talent
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Vision & Mission Redesign ─────────────────────── */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-white p-12 md:p-16 rounded-[48px] border border-surface-container hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-content mb-6 tracking-tight">
                Our Vision
              </h3>
              <p className="text-neutral-content/50 text-lg md:text-xl leading-relaxed font-medium">
                To become India’s most trusted entertainment and artist booking platform by making
                talent discovery, artist management, and live entertainment experiences more
                accessible, transparent, and professionally managed.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group bg-brand-secondary p-12 md:p-16 rounded-[48px] shadow-2xl text-white hover:translate-y-[-8px] transition-all duration-500"
            >
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">Our Mission</h3>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed font-medium">
                To empower artists, event organisers, brands, and audiences through
                technology-driven entertainment solutions that simplify bookings, strengthen
                creative opportunities, and deliver memorable live experiences across every scale of
                event.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Why Choose Us ─────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-brand-primary text-xs font-black uppercase tracking-[0.3em]">
              The Advantage
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-neutral-content tracking-tighter">
              Why Choose The Artist Mall
            </h3>
            <p className="text-neutral-content/40 text-lg font-medium">
              We redefine the entertainment booking landscape with precision and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <HighlightCard
              icon={ShieldCheck}
              title="Verified Artist Network"
              description="Access trusted and professionally managed performers across multiple entertainment categories."
            />
            <HighlightCard
              icon={Layers}
              title="End-to-End Coordination"
              description="From enquiry to execution, our team helps streamline the booking experience."
            />
            <HighlightCard
              icon={Zap}
              title="Curated Entertainment"
              description="Quality-driven entertainment suited for weddings, brands, colleges, and corporate gatherings."
            />
            <HighlightCard
              icon={CheckCircle2}
              title="Transparent Commercials"
              description="Clear pricing guidance, structured communication, and simplified coordination."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const HighlightCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-[#F8FAFC] p-10 rounded-[40px] border border-surface-container space-y-6 hover:bg-white hover:shadow-xl transition-all duration-300 group">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
      <Icon className="w-6 h-6" />
    </div>
    <div className="space-y-3">
      <h4 className="text-lg font-bold text-neutral-content tracking-tight">{title}</h4>
      <p className="text-neutral-content/40 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);
