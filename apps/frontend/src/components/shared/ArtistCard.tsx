import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, CalendarCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { BookingModal } from './BookingModal';
import { formatCurrencyShorthand, resolveMediaUrl } from '../../utils/media';

interface ArtistCardProps {
  id: string;
  name: string;
  categoryName: string;
  role?: string;
  cityName?: string;
  imageUrl: string;
  priceRange: { min: number; max: number };
  rating?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  shortSummary?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  id,
  name,
  categoryName,
  role,
  cityName,
  imageUrl,
  priceRange,
  isVerified,
  isFeatured,
  shortSummary,
}) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const resolvedImageUrl = resolveMediaUrl(imageUrl);

  const formatPrice = (num: number) => formatCurrencyShorthand(num);

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        className="bg-surface-lowest border border-surface-container rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500 group flex flex-col h-full relative"
      >
        {/* Badges Area */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex gap-2">
            {isFeatured && (
              <span className="bg-brand-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1 backdrop-blur-md">
                <Star className="w-3 h-3 fill-white" /> Featured
              </span>
            )}
            {isVerified && (
              <span className="bg-brand-secondary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <div className="bg-neutral-inverse/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
            {categoryName}
          </div>
        </div>

        <Link
          to={`/artists/${id}`}
          className="block relative h-64 w-full overflow-hidden bg-surface-low"
        >
          {resolvedImageUrl && (
            <img
              src={resolvedImageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-inverse/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        </Link>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow bg-surface-lowest relative z-20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-neutral-content tracking-tight group-hover:text-brand-primary transition-colors">
                {name}
              </h3>
              <p className="text-neutral-content/60 text-sm font-medium mt-0.5">
                {role || categoryName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-neutral-content/40 uppercase tracking-widest mb-0.5">
                Price Range
              </p>
              <p className="text-brand-secondary font-bold text-base leading-none">
                {priceRange.min > 0
                  ? `${formatPrice(priceRange.min)} – ${formatPrice(priceRange.max)}`
                  : 'On Request'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4 mt-2">
            <div className="flex items-center gap-1.5 text-neutral-content/60 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-brand-primary" /> {cityName || 'Pan India'}
            </div>
            <div className="flex items-center gap-1.5 text-brand-success text-xs font-semibold">
              <CalendarCheck className="w-3.5 h-3.5" /> High Availability
            </div>
          </div>

          <p className="text-neutral-content/70 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
            {shortSummary ||
              `View booking details, category, location, and pricing information for ${name}.`}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
            <Link
              to={`/artists/${id}`}
              className="flex items-center justify-center border-2 border-surface-container hover:border-brand-secondary text-neutral-content/70 hover:text-brand-secondary font-bold py-3 rounded-lg transition-all text-[11px] uppercase tracking-widest bg-surface-lowest"
            >
              View Profile
            </Link>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="flex items-center justify-center bg-brand-primary hover:bg-brand-primaryContainer text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-primary/10 transition-all text-[11px] uppercase tracking-widest group/btn relative overflow-hidden"
            >
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </motion.div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        artistName={name}
        artistId={id}
        startingPrice={priceRange.min}
      />
    </>
  );
};
