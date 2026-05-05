import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArtistService } from '../../services/artist.service';
import { resolveMediaUrl } from '../../utils/media';

export const CategoriesLanding: React.FC = () => {
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ['public-categories-full'],
    queryFn: () => ArtistService.getCategories(),
  });

  const categories = categoriesResponse?.data?.categories || [];

  const FALLBACK_IMAGES = [
    '/images/bento_singer.png',
    '/images/bento_drummer.png',
    '/images/bento_dj.png',
    '/images/bento_dancer.png',
  ];

  const AVATARS = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="bg-[#f5f3f0] pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-neutral-content leading-[0.9] mb-8 tracking-tighter">
              Mastery in{' '}
              <span className="text-brand-primary">
                Every <br />
                Discipline
              </span>
            </h1>

            <p className="text-neutral-content/60 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-10">
              Explore a comprehensive directory of professional talent across various artistic
              disciplines. From world-class vocalists and grand orchestras to innovative digital
              artists and high-profile celebrity appearances, The Artist Mall connects you with the
              finest creators for any scale of performance or production.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Artist"
                    className="w-12 h-12 rounded-full border-2 border-[#f5f3f0] object-cover"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-content/40 tracking-tight">
                Joined by <span className="text-neutral-content">5,000+ top-tier artists</span>{' '}
                worldwide
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORY LISTING */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-16 pb-6 border-b border-surface-container">
            <h2 className="text-3xl font-bold text-neutral-content tracking-tight">Categories</h2>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full border border-surface-container flex items-center justify-center text-neutral-content/40 hover:text-brand-primary transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full border border-surface-container flex items-center justify-center text-neutral-content hover:text-brand-primary transition-colors">
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full py-20 text-center text-neutral-content/40 font-bold uppercase tracking-widest">
                No categories available
              </div>
            ) : (
              categories.map((cat: any, idx: number) => (
                <CategoryCard
                  key={cat._id}
                  id={cat._id}
                  name={cat.name}
                  count={cat.description ? 'Specialized Talent' : 'Verified Artists'}
                  image={cat.image_url ? resolveMediaUrl(cat.image_url) : FALLBACK_IMAGES[idx % 4]}
                  filter={cat.name}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-secondary rounded-[32px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-secondaryContainer opacity-50"></div>
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Can't find a specific discipline?
              </h2>
              <p className="text-white/70 font-medium">
                Our concierge team can help you source the rarest artistic talents for your custom
                requirements.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4">
              <button className="bg-white text-brand-secondary font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-all text-sm tracking-tight">
                Request Custom Talent
              </button>
              <button className="bg-transparent border border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-sm tracking-tight">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CategoryCard = ({ id, name, count, image }: any) => {
  return (
    <Link
      to={`/artists?categoryId=${id}&categoryName=${encodeURIComponent(name)}`}
      className="group"
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-surface-container shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="h-60 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-8">
          <h3 className="text-xl font-bold text-neutral-content mb-2 tracking-tight group-hover:text-brand-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm font-semibold text-neutral-content/30 uppercase tracking-widest">
            {count}
          </p>
        </div>
      </div>
    </Link>
  );
};
