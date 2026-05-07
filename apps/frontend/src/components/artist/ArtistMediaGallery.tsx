import React from 'react';
import { Play } from 'lucide-react';
import { Artist } from '../../types';
import { resolveMediaUrl } from '../../utils/media';

interface ArtistMediaGalleryProps {
  artist: Artist;
}

export const ArtistMediaGallery: React.FC<ArtistMediaGalleryProps> = React.memo(({ artist }) => {
  return (
    <>
      {/* 1. PERFORMANCES SECTION (Videos) */}
      {artist.videoLinks && artist.videoLinks.length > 0 && (
        <div className="space-y-12 pb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-content tracking-tight">Performances</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {artist.videoLinks.slice(0, 2).map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-content shadow-lg">
                  <img
                    src={`https://img.youtube.com/vi/${link.split('v=')[1]?.split('&')[0] || ''}/maxresdefault.jpg`}
                    alt="Performance"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                    onError={(e: any) => (e.target.src = resolveMediaUrl(artist.profileImage))}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 2. PORTFOLIO GALLERY (Images) */}
      {artist.gallery && artist.gallery.length > 0 && (
        <section className="py-20 border-t border-surface-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-content tracking-tight">
              Portfolio Gallery
            </h2>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {artist.gallery.map((url, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <img
                  src={resolveMediaUrl(url)}
                  alt={`Gallery ${i}`}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
});

ArtistMediaGallery.displayName = 'ArtistMediaGallery';
