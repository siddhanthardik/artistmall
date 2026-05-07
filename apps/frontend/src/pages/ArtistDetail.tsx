import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../types';
import { BookingModal } from '../components/shared/BookingModal';

import { ArtistHero } from '../components/artist/ArtistHero';
import { ArtistBiography } from '../components/artist/ArtistBiography';
import { ArtistSidebar } from '../components/artist/ArtistSidebar';
import { ArtistMediaGallery } from '../components/artist/ArtistMediaGallery';

export const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    ArtistService.getArtistDetail(id)
      .then((res) => {
        setArtist(res.data.artist);
        window.scrollTo(0, 0);
      })
      .catch((err) => console.error('Failed to fetch artist details', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleOpenBookingModal = useCallback(() => {
    setIsBookingModalOpen(true);
  }, []);

  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-neutral-content/40 uppercase tracking-widest">
            Loading Artist Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-neutral-content mb-4">Artist Not Found</h1>
        <button
          onClick={() => navigate('/artists')}
          className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. CINEMATIC HERO SECTION */}
      <ArtistHero artist={artist} onBookNow={handleOpenBookingModal} />

      {/* 2. MAIN CONTENT GRID */}
      <div className="bg-[#F8F9FA]/50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT CONTENT (70%) */}
            <div className="lg:col-span-8 space-y-20">
              <ArtistBiography artist={artist} />
              
              <div className="hidden lg:block">
                <ArtistMediaGallery artist={artist} />
              </div>
            </div>

            {/* RIGHT SIDEBAR (30%) */}
            <div className="lg:col-span-4">
              <ArtistSidebar artist={artist} onBookNow={handleOpenBookingModal} />
            </div>

            {/* Mobile Media Gallery: shown below the sidebar on mobile devices */}
            <div className="lg:hidden col-span-1">
              <ArtistMediaGallery artist={artist} />
            </div>
            
          </div>
        </div>
      </div>

      {/* 3. READY TO ELEVATE CTA */}
      <section className="pb-32 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-[48px] p-16 md:p-24 text-center space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-tight">
                Ready to elevate <br />
                your event?
              </h2>
              <p className="text-white/50 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Bring the unmatched elegance and soulful voice of {artist.stageName} to your next
                special occasion. Limited dates available for 2024.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap justify-center gap-6">
              <button
                onClick={handleOpenBookingModal}
                className="bg-brand-primary hover:bg-brand-primaryContainer text-white font-bold px-12 py-5 rounded-2xl shadow-2xl shadow-brand-primary/20 transition-all flex items-center gap-3"
              >
                Book {artist.stageName} Now <ChevronRight className="w-4 h-4" />
              </button>
              <button className="bg-transparent border border-white/20 text-white font-bold px-12 py-5 rounded-2xl hover:bg-white/5 transition-all">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        artistName={artist.stageName}
        artistId={artist._id}
        startingPrice={artist.startingPrice}
      />

      {/* 4. WHATSAPP FLOATING ICON (ANIMATED) */}
      <motion.a
        href={`https://wa.me/918595767684?text=Hi, I want to book ${artist.stageName}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-5 rounded-full shadow-2xl flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-[#25D366] -z-10 opacity-30"
        />
        <span className="absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Quick Enquiry
        </span>
      </motion.a>

      {/* 5. MOBILE STICKY BOOKING BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-slate-100 p-4 flex gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <button
          onClick={handleOpenBookingModal}
          className="flex-1 bg-brand-orange text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          💬 Enquire Now
        </button>
      </div>
    </div>
  );
};
