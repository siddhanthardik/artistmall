import React from 'react';
import { Artist } from '../../types';
import { formatCurrency } from '../../utils/media';

interface ArtistPriceCardProps {
  artist: Artist;
  onBookNow: () => void;
}

export const ArtistPriceCard: React.FC<ArtistPriceCardProps> = React.memo(({ artist, onBookNow }) => {
  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 md:p-10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-content/40 mb-3">
            Price Range
          </p>
          <p className="text-4xl font-bold text-neutral-content tracking-tight">
            {artist.priceRange?.min && artist.priceRange?.max
              ? `${formatCurrency(artist.priceRange.min)} – ${formatCurrency(artist.priceRange.max)}`
              : 'Price on Request'}
          </p>
          <p className="text-xs font-medium text-neutral-content/50 mt-3 leading-relaxed">
            Based on event type & venue requirements.
          </p>
        </div>

        <div className="pt-8 mt-8 border-t border-neutral-content/10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-content/40 mb-4">
            Available For
          </p>
          <div className="flex flex-wrap gap-2">
            {(artist.bookingTypes || ['Corporate Events', 'Weddings', 'Festivals']).map((type, i) => (
              <span
                key={i}
                className="bg-neutral-content/5 text-neutral-content/70 hover:bg-neutral-content/10 transition-colors px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-neutral-content/5 cursor-default"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-10">
          <button
            onClick={onBookNow}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-orangeHover text-white font-black py-5 rounded-xl shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            Request Instant Quote
          </button>
        </div>
      </div>
    </div>
  );
});

ArtistPriceCard.displayName = 'ArtistPriceCard';
