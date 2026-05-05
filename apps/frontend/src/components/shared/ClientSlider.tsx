import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { api } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

import 'swiper/css';

export const ClientSlider: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-clients'],
    queryFn: async () => {
      const res = await api.get('/clients');
      return res.data;
    }
  });

  const clients = data?.data?.clients || [];

  if (isLoading || clients.length === 0) return null;

  // Duplicate slides for seamless infinite loop feel
  const slides = clients.length < 6 ? [...clients, ...clients] : clients;

  return (
    <section className="py-20 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-12">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Trusted By</p>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Our Clients</h2>
        <p className="text-slate-400 font-medium">Client Success is our Ultimate Reward.</p>
      </div>

      <div className="w-full relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={20}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480:  { slidesPerView: 3, spaceBetween: 24 },
            768:  { slidesPerView: 4, spaceBetween: 32 },
            1024: { slidesPerView: 5, spaceBetween: 40 },
            1280: { slidesPerView: 6, spaceBetween: 48 },
          }}
          className="w-full"
          style={{ transitionTimingFunction: 'linear' }}
        >
          {slides.map((client: any, i: number) => (
            <SwiperSlide key={`${client._id}-${i}`}>
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center bg-white border border-slate-100 rounded-2xl p-5 h-24 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-slate-200 cursor-pointer"
                >
                  <img
                    src={resolveMediaUrl(client.logo)}
                    alt={client.name}
                    className="max-h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </a>
              ) : (
                <div className="group flex items-center justify-center bg-white border border-slate-100 rounded-2xl p-5 h-24 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-slate-200">
                  <img
                    src={resolveMediaUrl(client.logo)}
                    alt={client.name}
                    className="max-h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
