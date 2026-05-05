import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  openInNewTab?: boolean;
}

interface HeroSliderProps {
  banners: Banner[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] min-h-[500px] overflow-hidden bg-neutral-900">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (_index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        loop={banners.length > 1}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            {({ isActive }) => (
              <div className="relative w-full h-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className={`w-full h-full object-cover transition-transform duration-[8s] ease-linear ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Content Container */}
                <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <div className="max-w-3xl space-y-6 md:space-y-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        >
                          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1]">
                            {banner.title?.split(' ').map((word, i) => (
                              <span
                                key={i}
                                className={i % 3 === 0 ? 'text-white' : 'text-white/90'}
                              >
                                {word}{' '}
                              </span>
                            )) || 'Experience Excellence'}
                          </h1>
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="text-lg md:text-xl text-white/60 font-medium max-w-2xl leading-relaxed"
                        >
                          {banner.subtitle ||
                            "Book world-class verified artists for your next high-impact event with India's premier talent marketplace."}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className="flex flex-wrap gap-4 pt-4"
                        >
                          {banner.ctaText && (
                            <Link
                              to={banner.ctaLink || '/artists'}
                              target={banner.openInNewTab ? '_blank' : '_self'}
                              className="group bg-brand-primary hover:bg-brand-primaryContainer text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-brand-primary/20 flex items-center gap-3 active:scale-95"
                            >
                              <span>{banner.ctaText}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          )}
                          <Link
                            to="/contact"
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/20 active:scale-95"
                          >
                            Get a Quote
                          </Link>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .custom-bullet {
          width: 32px !important;
          height: 3px !important;
          border-radius: 0 !important;
          background: rgba(255, 255, 255, 0.2) !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
          margin: 0 4px !important;
        }
        .custom-bullet.swiper-pagination-bullet-active {
          background: #C2410C !important;
          width: 48px !important;
        }
        .swiper-pagination {
          bottom: 40px !important;
          text-align: left !important;
          padding-left: 8% !important;
        }
      `}</style>
    </section>
  );
};
