import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { Artist } from '../../types';
import { resolveMediaUrl } from '../../utils/media';

interface ArtistHeroProps {
  artist: Artist;
  onBookNow: () => void;
}

export const ArtistHero: React.FC<ArtistHeroProps> = React.memo(({ artist, onBookNow }) => {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={resolveMediaUrl(artist.profileImage)}
          alt={artist.stageName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-end pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-6"></div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-4 flex items-center gap-3">
            {artist.stageName}
            {artist.isVerified && (
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 fill-blue-500/10" />
            )}
          </h1>

          <p className="text-white/90 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-10">
            {artist.shortBio}
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={onBookNow}
              className="bg-brand-orange hover:bg-brand-orangeHover text-white font-black px-10 py-4 rounded-xl shadow-2xl shadow-brand-orange/40 transition-all flex items-center gap-3 active:scale-95 text-sm uppercase tracking-widest"
            >
              Book Now <ChevronRight className="w-4 h-4" />
            </button>

            {artist.brochureFile && (
              <a
                href={resolveMediaUrl(artist.brochureFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-10 py-4 rounded-xl transition-all flex items-center gap-3 text-sm uppercase tracking-widest"
              >
                Download Profile (PDF) <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

ArtistHero.displayName = 'ArtistHero';
