import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Star, CheckSquare, Calendar, Loader2 } from 'lucide-react';
import { HeroSlider } from '../components/home/HeroSlider';
import { ClientSlider } from '../components/shared/ClientSlider';
import { useQuery } from '@tanstack/react-query';
import { ArtistService } from '../services/artist.service';
import { resolveMediaUrl, formatCurrencyShorthand } from '../utils/media';
import { Link } from 'react-router-dom';

// Image paths - using generated assets in public/images
const BENTO_SINGER = '/images/bento_singer.png';
const BENTO_DJ = '/images/bento_dj.png';
const BENTO_DRUMMER = '/images/bento_drummer.png';
const BENTO_DANCER = '/images/bento_dancer.png';

export const Home: React.FC = () => {
  const { data: featuredArtists, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featured-artists-home'],
    queryFn: () => ArtistService.getFeaturedArtists(3),
  });

  // Homepage artists query removed as it was unused

  // Actually use the specific homepage endpoint from backend
  const { data: popularArtists, isLoading: isPopularLoading } = useQuery({
    queryKey: ['popular-artists-home'],
    queryFn: async () => {
      const env = (import.meta as any).env;
      const baseUrl = env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/v1/artists/homepage-featured`).then((r) => r.json());
      return res.data?.artists || [];
    },
  });

  const { data: bannersResponse, isLoading: isBannersLoading } = useQuery({
    queryKey: ['hero-banners'],
    queryFn: () => ArtistService.getHeroBanners(),
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['public-categories'],
    queryFn: () => ArtistService.getCategories(),
  });

  const featuredList = featuredArtists?.data?.artists || [];
  const popularList = popularArtists || [];
  const banners = bannersResponse?.data || [];
  const categories = categoriesResponse?.data?.categories || [];

  return (
    <div className="min-h-screen bg-surface">
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-brand-primary text-white py-3 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-sm font-medium">
        <span>New Artist Marketplace is Live! Limited time booking discounts.</span>
        <Link
          to="/artists"
          className="bg-white text-brand-primary px-6 py-1.5 rounded-full text-xs font-bold hover:bg-white/90 transition-all uppercase tracking-wider"
        >
          Check Offers
        </Link>
      </div>

      {/* 1. HERO SECTION */}
      {isBannersLoading ? (
        <div className="h-[85vh] flex items-center justify-center bg-black">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
        </div>
      ) : (
        <HeroSlider banners={banners} />
      )}

      {/* 2. FEATURED ARTISTS (NEW DYNAMIC SECTION) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-neutral-content tracking-tight">
                🔥 Featured Artists
              </h2>
              <p className="text-neutral-content/40 font-medium mt-2">
                The most sought-after performers in our network.
              </p>
            </div>
            <Link
              to="/artists?featured=true"
              className="text-brand-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 group"
            >
              View All{' '}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isFeaturedLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredList.map((artist: any) => (
                <SpotlightCard
                  key={artist._id}
                  id={artist.slug || artist._id}
                  name={artist.stageName || artist.name}
                  role={artist.categoryName}
                  rating={artist.rating || 'New'}
                  badge="FEATURED"
                  minPrice={artist.priceRange?.min || 0}
                  maxPrice={artist.priceRange?.max || 0}
                  image={resolveMediaUrl(artist.profileImage)}
                  description={artist.shortBio}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. CURATED CATEGORIES (BENTO GRID) */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-bold text-neutral-content mb-4 tracking-tight">
                Popular Categories
              </h2>
              <p className="text-neutral-content/50 font-medium">
                Find the perfect match for every occasion.
              </p>
            </div>
            <Link
              to="/artists"
              className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest group"
            >
              View all categories{' '}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[700px]">
            {isCategoriesLoading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full py-20 text-center text-neutral-content/40 font-bold uppercase tracking-widest">
                No categories available
              </div>
            ) : (
              categories.slice(0, 4).map((cat: any, idx: number) => {
                const isLarge = idx === 0;
                const isWide = idx === 1;
                const gridClass = isLarge
                  ? 'md:col-span-2 md:row-span-2'
                  : isWide
                    ? 'md:col-span-2'
                    : '';
                const img = cat.image_url
                  ? resolveMediaUrl(cat.image_url)
                  : [BENTO_SINGER, BENTO_DJ, BENTO_DRUMMER, BENTO_DANCER][idx % 4];

                return (
                  <Link
                    key={cat._id}
                    to={`/artists?categoryId=${cat._id}&categoryName=${encodeURIComponent(cat.name)}`}
                    className={`${gridClass} relative rounded-3xl overflow-hidden group block aspect-square md:aspect-auto`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={cat.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2 block">
                        {isLarge ? 'Top Performers' : 'Popular'}
                      </span>
                      <h3 className={`${isLarge ? 'text-3xl' : 'text-xl'} font-bold`}>
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 4. POPULAR ON HOMEPAGE (NEW DYNAMIC SECTION) */}
      <section className="py-32 bg-surface-lowest">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-neutral-content tracking-tight">
                ⭐ Popular Picks
              </h2>
            </div>
          </div>

          {isPopularLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularList.map((artist: any) => (
                <SpotlightCard
                  key={artist._id}
                  id={artist.slug || artist._id}
                  name={artist.stageName || artist.name}
                  role={artist.categoryName}
                  rating={artist.rating || 'New'}
                  badge="POPULAR"
                  minPrice={artist.priceRange?.min || 0}
                  maxPrice={artist.priceRange?.max || 0}
                  image={resolveMediaUrl(artist.profileImage)}
                  description={artist.shortBio}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. SEAMLESS PROFESSIONAL BOOKING */}
      <section className="py-32 bg-surface-lowest">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-20">
          <h2 className="text-4xl font-bold text-neutral-content mb-4 tracking-tight">
            Seamless Professional Booking
          </h2>
          <p className="text-neutral-content/40 font-bold uppercase tracking-[0.2em] text-[10px]">
            The elite standard for talent acquisition in India.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BookingStep
            number={1}
            title="Discover"
            description="Browse through our curated list of verified top-tier artists."
            icon={Search}
          />
          <BookingStep
            number={2}
            title="Shortlist"
            description="Review portfolios, high-definition videos, and past performance ratings."
            icon={CheckSquare}
          />
          <BookingStep
            number={3}
            title="Book Securely"
            description="Confirm dates and manage payments through our secure escrow system."
            icon={Calendar}
          />
          <BookingStep
            number={4}
            title="Experience"
            description="Enjoy a world-class performance tailored to your specific event needs."
            icon={Star}
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        className="relative overflow-hidden py-36"
        style={{ background: 'linear-gradient(135deg, #2d0f00 0%, #1a1a2e 50%, #16213e 100%)' }}
      >
        {/* Background stage image at low opacity */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={BENTO_SINGER}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top"
            style={{ opacity: 0.07, filter: 'blur(2px) saturate(0.5)' }}
          />
        </div>

        {/* Colour overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(45,15,0,0.85) 0%, rgba(26,26,46,0.75) 100%)',
          }}
        />

        {/* Animated glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ff6b00 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-100px] right-[-60px] w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0095f8 0%, transparent 70%)' }}
        />

        {/* Subtle sparkle dots */}
        {[
          { top: '20%', left: '10%', delay: 0 },
          { top: '60%', left: '20%', delay: 1.5 },
          { top: '30%', right: '15%', delay: 0.8 },
          { top: '75%', right: '25%', delay: 2.2 },
          { top: '50%', left: '50%', delay: 1 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: pos.delay, ease: 'easeInOut' }}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand-primaryContainer/60 pointer-events-none"
            style={pos}
          />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 border border-brand-primary/30 bg-brand-primary/10 backdrop-blur-sm text-brand-primaryContainer px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-brand-primaryContainer rounded-full"
            />
            India's Most Trusted Artist Booking Platform
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            <span className="text-white">Plan Your</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ff6b00, #ffaa44, #ff6b00)',
                backgroundSize: '200%',
              }}
            >
              Event Booking.
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Work with a verified artist network and a dedicated team that supports every booking —
            from first inquiry to event day.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
          >
            <Link
              to="/artists"
              className="group relative flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] text-white transition-all duration-300 active:scale-95 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #a04100, #ff6b00)' }}
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
              />
              <span>Book an Artist Now</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://wa.me/918595767684?text=Hi, I want to book an artist for my event"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] text-white transition-all duration-300 active:scale-95 border border-white/15 hover:border-white/30 hover:bg-white/10 backdrop-blur-sm"
            >
              <span className="text-base">💬</span>
              Talk To Our Team
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-10 mb-10"
          >
            {[
              { value: '500+', label: 'Verified Artists' },
              { value: '10K+', label: 'Events Delivered' },
              { value: '4.9★', label: 'Client Rating' },
              { value: '24/7', label: 'Team Support' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl font-black text-white tracking-tight">{stat.value}</span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-0.5">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust bar */}
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest"></p>
        </div>
      </section>

      {/* OUR CLIENTS SLIDER */}
      <ClientSlider />
    </div>
  );
};

interface BookingStepProps {
  number: number;
  title: string;
  description: string;
  icon: any;
}

const BookingStep = ({ number, title, description, icon: Icon }: BookingStepProps) => (
  <div className="bg-white p-10 rounded-3xl border border-surface-container shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-left">
    <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-8 border border-brand-primary/10">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-4">
      {number}. {title}
    </h3>
    <p className="text-neutral-content/50 leading-relaxed text-sm">{description}</p>
  </div>
);

interface SpotlightCardProps {
  id: string;
  name: string;
  role: string;
  rating: string | number;
  badge: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  description: string;
}

const SpotlightCard = ({
  id,
  name,
  role,
  rating,
  badge,
  minPrice,
  maxPrice,
  image,
  description,
}: SpotlightCardProps) => (
  <Link
    to={`/artists/${id}`}
    className="group bg-white rounded-[32px] overflow-hidden border border-surface-container shadow-sm hover:shadow-2xl transition-all duration-700 block"
  >
    <div className="relative h-72 overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
        <Star className="w-3 h-3 fill-brand-primary text-brand-primary" /> {rating}
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-bold text-neutral-content">{name}</h4>
        <span className="text-[9px] font-bold bg-brand-secondary/5 text-brand-secondary px-3 py-1 rounded-full border border-brand-secondary/10 tracking-widest">
          {badge}
        </span>
      </div>
      <p className="text-brand-primary font-bold text-xs uppercase tracking-widest mb-4">{role}</p>
      <p className="text-neutral-content/40 text-sm leading-relaxed mb-8 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center justify-between border-t border-surface-container pt-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-neutral-content/30 uppercase tracking-widest mb-1">
            Price Range
          </span>
          <span className="text-xl font-bold text-neutral-content">
            {minPrice > 0
              ? `${formatCurrencyShorthand(minPrice)} – ${formatCurrencyShorthand(maxPrice)}`
              : 'On Request'}
          </span>
        </div>
        <div className="text-brand-primary font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
          View Profile <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  </Link>
);
