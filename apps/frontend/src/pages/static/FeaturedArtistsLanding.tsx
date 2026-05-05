import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { ArtistCard } from '../../components/shared/ArtistCard';

// Mock data mapped to ArtistCardProps
const MOCK_FEATURED = [
  {
    _id: '1',
    stageName: 'Armaan Malik',
    categoryName: 'Bollywood Singer',
    role: 'Playback Singer',
    profileImage:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop',
    shortBio: 'Bollywood playback singer available for live events and appearances.',
    premiumTier: 'GOLD',
    verified: true,
    isFeatured: true,
    priceRange: { min: 1500000, max: 2500000 },
    cityName: 'Mumbai',
  },
  {
    _id: '2',
    stageName: 'Zakir Khan',
    categoryName: 'Standup Comedian',
    role: 'Standup Comedian',
    profileImage:
      'https://images.unsplash.com/photo-1527224857810-8cd9f41f5128?q=80&w=2070&auto=format&fit=crop',
    shortBio: 'Comedy performer available for corporate, private, and live events.',
    premiumTier: 'GOLD',
    verified: true,
    isFeatured: true,
    priceRange: { min: 800000, max: 1200000 },
    cityName: 'Delhi NCR',
  },
  {
    _id: '3',
    stageName: 'Nucleya',
    categoryName: 'Celebrity DJ',
    role: 'Electronic Pioneer',
    profileImage:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    shortBio: 'The pioneer of modern electronic music in India.',
    premiumTier: 'SILVER',
    verified: true,
    isFeatured: true,
    priceRange: { min: 500000, max: 900000 },
    cityName: 'Goa',
  },
  {
    _id: '4',
    stageName: 'Sunidhi Chauhan',
    categoryName: 'Bollywood Singer',
    role: 'Powerhouse Vocalist',
    profileImage:
      'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop',
    shortBio: 'The powerhouse of Indian playback singing.',
    premiumTier: 'GOLD',
    verified: true,
    isFeatured: true,
    priceRange: { min: 1800000, max: 3000000 },
    cityName: 'Mumbai',
  },
  {
    _id: '5',
    stageName: 'Manish Paul',
    categoryName: 'Celebrity Anchor',
    role: 'Event Host',
    profileImage:
      'https://images.unsplash.com/photo-1466112928291-0903b80a9466?q=80&w=2070&auto=format&fit=crop',
    shortBio: 'Host and anchor available for corporate, private, and televised events.',
    premiumTier: 'SILVER',
    verified: true,
    isFeatured: true,
    priceRange: { min: 400000, max: 700000 },
    cityName: 'Mumbai',
  },
  {
    _id: '6',
    stageName: 'Shreya Ghoshal',
    categoryName: 'Bollywood Singer',
    role: 'Playback Singer',
    profileImage:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    shortBio: 'Playback singer available for concerts, private events, and appearances.',
    premiumTier: 'GOLD',
    verified: true,
    isFeatured: true,
    priceRange: { min: 2000000, max: 3500000 },
    cityName: 'Mumbai',
  },
];

export const FeaturedArtistsLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="h-[2px] w-12 bg-brand-orange"></div>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                Featured Artists
              </span>
              <div className="h-[2px] w-12 bg-brand-orange"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] mb-10 tracking-tighter"
            >
              Featured Artists. <br />
              <span className="text-brand-orange italic">Ready for Events.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-xl md:text-2xl leading-relaxed font-medium tracking-tight mb-12"
            >
              A selection of verified artist profiles for corporate events, weddings, private
              functions, and live shows.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. THE FEATURED GRID */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_FEATURED.map((artist: any) => (
              <ArtistCard
                key={artist._id}
                id={artist._id}
                name={artist.stageName}
                categoryName={artist.categoryName}
                role={artist.role}
                imageUrl={artist.profileImage}
                priceRange={artist.priceRange}
                cityName={artist.cityName}
                isVerified={artist.verified}
                isFeatured={artist.isFeatured}
                shortSummary={artist.shortBio}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. LISTING INFO */}
      <section className="py-32 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                Understanding <br />
                Listing Levels.
              </h2>
              <div className="space-y-8">
                <TierInfo
                  tier="Gold Tier"
                  color="orange"
                  description="Artists with a strong booking history, complete profile information, and consistently positive client feedback."
                />
                <TierInfo
                  tier="Silver Tier"
                  color="blue"
                  description="Experienced performers with reviewed profiles and clear event booking information."
                />
                <TierInfo
                  tier="Standard"
                  color="slate"
                  description="Verified professionals who meet the baseline listing requirements for event bookings."
                />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[48px] bg-slate-900 overflow-hidden shadow-2xl relative border-8 border-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-40 h-40 text-white opacity-10" />
                </div>
                <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px]">
                  <p className="text-white font-black text-xl mb-2 italic">Verified Listings</p>
                  <p className="text-slate-300 text-xs font-medium leading-relaxed">
                    Listing levels help clients understand profile completeness, booking history,
                    and event readiness.
                  </p>
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
            Find the Right Artist.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all uppercase tracking-widest text-xs">
              View All Artists
            </button>
            <button className="bg-slate-900 hover:bg-black text-white font-black px-12 py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const TierInfo = ({ tier, color, description }: any) => {
  const colorMap: any = {
    orange: 'bg-brand-orange',
    blue: 'bg-brand-blue',
    slate: 'bg-slate-400',
  };

  return (
    <div className="flex items-start gap-6 group">
      <div
        className={`w-3 h-3 rounded-full mt-2 shrink-0 ${colorMap[color]} shadow-[0_0_10px_currentColor]`}
      ></div>
      <div>
        <h4 className="text-slate-900 font-bold text-xl mb-2 tracking-tight">{tier}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
