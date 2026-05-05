import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Download,
  CheckCircle2, Play, MessageCircle
} from 'lucide-react';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../types';
import { BookingModal } from '../components/shared/BookingModal';
import { formatCurrency, resolveMediaUrl } from '../utils/media';

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
      .then(res => {
        setArtist(res.data.artist);
        window.scrollTo(0, 0);
      })
      .catch(err => console.error('Failed to fetch artist details', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-neutral-content/40 uppercase tracking-widest">Loading Artist Profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-neutral-content mb-4">Artist Not Found</h1>
        <button onClick={() => navigate('/artists')} className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs">
          Back to Directory
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. CINEMATIC HERO SECTION */}
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
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Removed Category and Featured badges as requested */}
            </div>
            
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
                onClick={() => setIsBookingModalOpen(true)}
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

      {/* 2. HOOK LINE SECTION */}
      <section className="bg-white border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <p className="text-2xl md:text-3xl font-medium text-neutral-content/80 leading-relaxed max-w-4xl tracking-tight">
            {artist.shortBio}
          </p>
          <div className="flex items-center gap-4 mt-8">
            <div className="h-[1px] w-12 bg-neutral-content/20"></div>
            {/* Removed "Verified Artist Profile" line as requested */}
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT GRID */}
      <div className="bg-[#F8F9FA]/50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT CONTENT (70%) */}
            <div className="lg:col-span-8 space-y-20">

              {/* ABOUT SECTION */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="h-[2px] w-12 bg-brand-primary"></div>
                  <h2 className="text-2xl font-bold text-neutral-content tracking-tight">Biography</h2>
                </div>
                <div className="text-neutral-content/70 text-lg font-medium leading-relaxed space-y-8">
                  {artist.longBio || artist.shortBio}
                </div>
              </div>

              {/* HIGHLIGHTS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Expertise */}
                <div className="bg-brand-secondary rounded-3xl p-8 text-white">
                  <h3 className="text-lg font-bold mb-6 tracking-tight">Vocal Expertise</h3>
                  <div className="flex flex-wrap gap-3">
                    {(artist.performanceTypes || ['Mezzo-Soprano', 'Improvisation', 'Lyric Diction', 'Stage Presence']).map((tag, i) => (
                      <span key={i} className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-[10px] font-bold tracking-tight uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Highlights */}
                <div className="bg-white border border-surface-container rounded-3xl p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-neutral-content mb-6 tracking-tight italic">Highlights</h3>
                  <div className="space-y-4">
                    {(artist.premiumHighlights || [
                      "Headline at Royal Albert Hall (London)",
                      "Collaborated with 3x Grammy Nominated Composers",
                      "Featured in 'Artist of the Year 2024' Showcase"
                    ]).map((h, i) => (
                      <div key={i} className="flex gap-4">
                        <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
                        <p className="text-sm font-semibold text-neutral-content/70 leading-snug">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PERFORMANCES SECTION (Moved inside left column) */}
              {artist.videoLinks && artist.videoLinks.length > 0 && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-neutral-content tracking-tight">Performances</h2>
                    <button className="text-brand-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {artist.videoLinks.slice(0, 2).map((link, i) => (
                      <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="group block space-y-6">
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-content shadow-lg">
                          <img 
                            src={`https://img.youtube.com/vi/${link.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`} 
                            alt="Performance" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                            onError={(e: any) => e.target.src = resolveMediaUrl(artist.profileImage)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all">
                              <Play className="w-6 h-6 fill-current" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-neutral-content tracking-tight mb-1 group-hover:text-brand-primary transition-colors italic">
                            Official Media Capture #{i + 1}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-content/30">
                            <span className="w-1 h-1 bg-brand-primary rounded-full" />
                            Verified Live Stream
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR (30%) - STICKY PRICING CARD */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* PRICING CARD */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl p-10 space-y-10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                  <div className="relative z-10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-content/30 mb-3">Price Range</p>
                      <p className="text-3xl font-bold text-neutral-content tracking-tight">
                        {(artist.priceRange?.min && artist.priceRange?.max) 
                          ? `${formatCurrency(artist.priceRange.min)} – ${formatCurrency(artist.priceRange.max)}`
                          : artist.startingPrice 
                            ? `From ${formatCurrency(artist.startingPrice)}`
                            : "Price on Request"}
                      </p>
                      <p className="text-xs font-medium text-neutral-content/40 mt-3 leading-relaxed">Based on event type & venue requirements.</p>
                    </div>

                    <div className="pt-8 mt-8 border-t border-neutral-content/10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-content/30 mb-4">Available For</p>
                      <div className="flex flex-wrap gap-2">
                        {(artist.bookingTypes || ['Corporate Events', 'Weddings', 'Festivals']).map((type, i) => (
                          <span key={i} className="bg-neutral-content/5 text-neutral-content/60 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-neutral-content/5">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-10">
                       <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="w-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
                      >
                        Request Instant Quote
                      </button>
                    </div>
                  </div>
                </div>

                {/* Removed Trust and Protection cards as requested */}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. PORTFOLIO GALLERY */}
      {artist.gallery && artist.gallery.length > 0 && (
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-20">
            <h2 className="text-4xl font-bold text-neutral-content tracking-tight">Portfolio Gallery</h2>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {artist.gallery.map((url, i) => (
                <div key={i} className="break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <img src={resolveMediaUrl(url)} alt={`Gallery ${i}`} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. READY TO ELEVATE CTA */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-[48px] p-16 md:p-24 text-center space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-tight">
                Ready to elevate <br />your event?
              </h2>
              <p className="text-white/50 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Bring the unmatched elegance and soulful voice of {artist.stageName} to your next special occasion. Limited dates available for 2024.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => setIsBookingModalOpen(true)}
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
        onClose={() => setIsBookingModalOpen(false)}
        artistName={artist.stageName}
        artistId={artist._id}
        startingPrice={artist.startingPrice}
      />

      {/* 6. WHATSAPP FLOATING ICON (ANIMATED) */}
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

      {/* 7. MOBILE STICKY BOOKING BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-slate-100 p-4 flex gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="flex-1 bg-brand-orange text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          💬 Enquire Now
        </button>
      </div>
    </div>
  );
};
