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

      {/* HIGHLIGHTS SECTION (Single premium card) */}
      {artist.premiumHighlights && artist.premiumHighlights.length > 0 && (
        <div className="">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-surface-container max-w-4xl">
            <div className="flex items-center gap-6 mb-6">
              <div className="h-[2px] w-12 bg-brand-primary"></div>
              <h3 className="text-lg font-bold tracking-tight">Highlights</h3>
            </div>

            <ul className="space-y-4">
              {artist.premiumHighlights.map((h, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-1 text-brand-primary font-black text-lg leading-none">✓</span>
                  <p className="text-sm font-semibold text-neutral-content/80 leading-snug">{h}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});

ArtistBiography.displayName = 'ArtistBiography';
