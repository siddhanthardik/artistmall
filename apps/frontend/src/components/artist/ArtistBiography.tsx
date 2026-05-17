import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Artist } from '../../types';

interface ArtistBiographyProps {
  artist: Artist;
}

export const ArtistBiography: React.FC<ArtistBiographyProps> = React.memo(({ artist }) => {
  const bioHtml = DOMPurify.sanitize(artist.longBio || artist.shortBio || '');

  return (
    <div className="space-y-20">
      {/* ABOUT SECTION */}
      <div className="space-y-10">
        <div className="flex items-center gap-6">
          <div className="h-[2px] w-12 bg-brand-primary"></div>
          <h2 className="text-2xl font-bold text-neutral-content tracking-tight">About {artist.stageName || 'Artist'}</h2>
        </div>
        
        {/* Rich Text Editorial Layout */}
        <div
          className="prose prose-lg max-w-4xl leading-8 text-slate-700 space-y-6 [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify [&_p]:mb-4 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-2"
          dangerouslySetInnerHTML={{ __html: bioHtml }}
        />
      </div>

      {/* HIGHLIGHTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Expertise */}
        <div className="bg-brand-secondary rounded-3xl p-8 text-white">
          <h3 className="text-lg font-bold mb-6 tracking-tight">Vocal Expertise</h3>
          <div className="flex flex-wrap gap-3">
            {(
              artist.performanceTypes || [
                'Mezzo-Soprano',
                'Improvisation',
                'Lyric Diction',
                'Stage Presence',
              ]
            ).map((tag, i) => (
              <span
                key={i}
                className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-[10px] font-bold tracking-tight uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Performance Highlights */}
        <div className="bg-white border border-surface-container rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-content mb-6 tracking-tight italic">
            Highlights
          </h3>
          <div className="space-y-4">
            {(artist.premiumHighlights || []).map((h, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
                <p className="text-sm font-semibold text-neutral-content/70 leading-snug">
                  {h}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ArtistBiography.displayName = 'ArtistBiography';
