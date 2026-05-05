import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Star, Globe, 
  Target, Eye, Zap, Headphones, 
  ArrowRight
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Event" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-block bg-brand-primary text-white text-[10px] font-black px-4 py-2 rounded-lg mb-8 tracking-widest">
              ESTABLISHED 2018
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[1.05] mb-10">
              Connecting the World's Finest Talent with India's Most Visionary Events.
            </h1>
            <p className="text-white/60 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
              The Artist Mall is India's premier talent ecosystem, curating world-class entertainment for high-stakes corporate summits, luxury weddings, and exclusive cultural festivals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Image with Badge */}
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-square rounded-[48px] overflow-hidden shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200" 
                  alt="Pianist" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 -right-6 bg-brand-secondary text-white p-8 rounded-3xl shadow-2xl border border-white/10"
              >
                <p className="text-4xl font-bold mb-1">1,500+</p>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Events Orchestrated</p>
              </motion.div>
            </div>

            {/* Right: Text Content */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-brand-primary"></div>
                <h2 className="text-3xl font-bold text-neutral-content tracking-tight">Our Story: Redefining the Stage</h2>
              </div>
              <div className="text-neutral-content/60 text-lg font-medium leading-relaxed space-y-6">
                <p>
                  Born out of a desire to bridge the gap between chaotic booking processes and high-end artistic expression, The Artist Mall began as a boutique agency in Mumbai. We realized that India's most visionary events were often limited by logistical friction rather than creative lack.
                </p>
                <p>
                  Today, we have evolved into a sophisticated digital marketplace and concierge service that manages the complex lifecycle of talent acquisition—from meticulous verification to seamless on-ground execution.
                </p>
                <p>
                  We don't just book artists; we curate experiences that resonate. Our platform serves as a trusted filter, ensuring that only the most professional, verified, and exceptional talent enters your event space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-16 rounded-[48px] shadow-sm border border-surface-container space-y-8"
            >
              <div className="w-16 h-16 bg-[#FDF0E9] rounded-2xl flex items-center justify-center text-brand-primary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-neutral-content tracking-tight">Our Mission</h3>
              <p className="text-neutral-content/50 text-lg font-medium leading-relaxed">
                To empower artists and event planners through a transparent, high-integrity platform that prioritizes artistic quality, financial security, and logistical perfection. We are here to make world-class entertainment accessible to every visionary event in India.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-brand-secondary p-16 rounded-[48px] shadow-2xl text-white space-y-8"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight">Our Vision</h3>
              <p className="text-white/60 text-lg font-medium leading-relaxed">
                To become the definitive global benchmark for talent marketplaces, setting the standard for how the world's most elite artists interact with high-end brands and individual collectors of experiences. We envision a future where India is the global hub for premium curated artistry.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. VALUES SECTION */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl font-bold text-neutral-content tracking-tighter">Values That Guide Us</h2>
            <p className="text-neutral-content/40 text-lg font-medium">The foundation of every partnership we build and every event we curate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={ShieldCheck}
              title="Verified Artistry"
              description="Every artist on our platform undergoes a rigorous 5-step vetting process, scanning performance history, technical proficiency, and professional conduct."
              bgColor="bg-[#FDF0E9]"
              iconColor="text-brand-primary"
            />
            <ValueCard 
              icon={Zap}
              title="Seamless Logistics"
              description="From technical riders to hospitality management, we handle the intricacies so you can focus on the applause. Precision in our booking."
              bgColor="bg-[#E9F0FD]"
              iconColor="text-brand-secondary"
            />
            <ValueCard 
              icon={Headphones}
              title="Direct Concierge Support"
              description="A dedicated booking expert is assigned to every premium event, providing real-time solutions and strategic curation tailored to your theme."
              bgColor="bg-[#E9FDF0]"
              iconColor="text-brand-success"
            />
          </div>
        </div>
      </section>

      {/* 5. THE CURATORS SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h2 className="text-5xl font-bold text-neutral-content tracking-tighter leading-tight">
                The Curators Behind <br />the Scenes
              </h2>
              <p className="text-neutral-content/60 text-lg font-medium leading-relaxed max-w-xl">
                Our team consists of veteran event producers, former touring musicians, and tech enthusiasts who believe in the power of a perfect performance. We don't just use algorithms; we use our ears and years of experience to recommend the right fit for your audience.
              </p>
              
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-brand-primary" />
                    <p className="text-xl font-bold text-neutral-content">Expert Curators</p>
                  </div>
                  <p className="text-sm text-neutral-content/40 font-bold uppercase tracking-widest">Industry Veterans</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-brand-secondary" />
                    <p className="text-xl font-bold text-neutral-content">Global Network</p>
                  </div>
                  <p className="text-sm text-neutral-content/40 font-bold uppercase tracking-widest">20+ Countries</p>
                </div>
              </div>

              <button className="text-brand-primary font-bold flex items-center gap-2 group">
                Meet the full concierge team <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-[40px] overflow-hidden shadow-2xl h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
                  alt="Office" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[40px] overflow-hidden shadow-2xl h-[400px] mt-12">
                <img 
                  src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?auto=format&fit=crop&q=80&w=800" 
                  alt="Team Working" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-[56px] p-20 md:p-32 text-center space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight">
                Your Event Deserves Nothing <br />Less Than Excellence.
              </h2>
              <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Let's create something legendary. Partner with Artist Mall for your next high-impact event and experience the difference of curated artistry.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap justify-center gap-6">
              <button className="bg-brand-primary hover:bg-brand-primaryContainer text-white font-bold px-12 py-5 rounded-2xl shadow-2xl shadow-brand-primary/20 transition-all uppercase tracking-widest text-xs">
                Start Your Booking
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-12 py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">
                Contact Concierge
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const ValueCard = ({ icon: Icon, title, description, bgColor, iconColor }: any) => (
  <div className="bg-white p-12 rounded-[48px] shadow-sm border border-surface-container space-y-8 hover:shadow-xl transition-all group">
    <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}>
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-bold text-neutral-content tracking-tight">{title}</h3>
    <p className="text-neutral-content/40 font-medium leading-relaxed">{description}</p>
  </div>
);
